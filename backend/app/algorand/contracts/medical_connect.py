from pyteal import *
from algokit_utils import ApplicationClient
from algosdk.atomic_transaction_composer import TransactionWithSigner
from algosdk.transaction import ApplicationCallTxn
from algosdk.abi import Method, ABIType, Returns
from typing import Dict, Any, Optional
import json


class MedicalConnectContract:
    """Smart contract for Medical Connect DApp managing PoW, ratings, and consultations"""
    
    def __init__(self):
        self.app_id = Int(0)  # Will be set during deployment
        
    def approval_program(self) -> Expr:
        """Main approval program for the smart contract"""
        
        # Global state keys
        owner_key = Bytes("owner")
        total_doctors_key = Bytes("total_doctors")
        total_patients_key = Bytes("total_patients")
        total_consultations_key = Bytes("total_consultations")
        
        # Application arguments
        action = Txn.application_args[0]
        
        # On creation
        on_create = Seq([
            App.globalPut(owner_key, Txn.sender()),
            App.globalPut(total_doctors_key, Int(0)),
            App.globalPut(total_patients_key, Int(0)),
            App.globalPut(total_consultations_key, Int(0)),
            Approve()
        ])
        
        # Register doctor
        register_doctor = Seq([
            Assert(Txn.application_args.length() == Int(3)),  # action, name, specialization
            Assert(App.localGet(Int(0), Bytes("user_type")) == Int(0)),  # Not registered yet
            
            App.localPut(Int(0), Bytes("user_type"), Int(1)),  # 1 = doctor
            App.localPut(Int(0), Bytes("name"), Txn.application_args[1]),
            App.localPut(Int(0), Bytes("specialization"), Txn.application_args[2]),
            App.localPut(Int(0), Bytes("rating_sum"), Int(0)),
            App.localPut(Int(0), Bytes("rating_count"), Int(0)),
            App.localPut(Int(0), Bytes("consultations_count"), Int(0)),
            
            App.globalPut(total_doctors_key, App.globalGet(total_doctors_key) + Int(1)),
            Approve()
        ])
        
        # Register patient
        register_patient = Seq([
            Assert(Txn.application_args.length() == Int(2)),  # action, name
            Assert(App.localGet(Int(0), Bytes("user_type")) == Int(0)),  # Not registered yet
            
            App.localPut(Int(0), Bytes("user_type"), Int(2)),  # 2 = patient
            App.localPut(Int(0), Bytes("name"), Txn.application_args[1]),
            App.localPut(Int(0), Bytes("emergency_status"), Int(0)),  # 0 = not in emergency
            
            App.globalPut(total_patients_key, App.globalGet(total_patients_key) + Int(1)),
            Approve()
        ])
        
        # Submit Proof of Work (PoW)
        submit_pow = Seq([
            Assert(Txn.application_args.length() == Int(4)),  # action, patient_addr, treatment_desc, timestamp
            Assert(App.localGet(Int(0), Bytes("user_type")) == Int(1)),  # Must be doctor
            
            # Create PoW record
            pow_id = App.globalGet(total_consultations_key) + Int(1),
            App.localPut(Int(0), Bytes("pow_id"), pow_id),
            App.localPut(Int(0), Bytes("patient_addr"), Txn.application_args[1]),
            App.localPut(Int(0), Bytes("treatment_desc"), Txn.application_args[2]),
            App.localPut(Int(0), Bytes("timestamp"), Txn.application_args[3]),
            App.localPut(Int(0), Bytes("status"), Int(1)),  # 1 = completed
            
            # Update doctor's consultation count
            App.localPut(Int(0), Bytes("consultations_count"), 
                        App.localGet(Int(0), Bytes("consultations_count")) + Int(1)),
            
            # Update global consultation count
            App.globalPut(total_consultations_key, pow_id),
            Approve()
        ])
        
        # Rate doctor
        rate_doctor = Seq([
            Assert(Txn.application_args.length() == Int(3)),  # action, doctor_addr, rating
            Assert(App.localGet(Int(0), Bytes("user_type")) == Int(2)),  # Must be patient
            
            # Get rating value (1-5)
            rating = Btoi(Txn.application_args[2]),
            Assert(And(rating >= Int(1), rating <= Int(5))),
            
            # Update doctor's rating (simplified - in real implementation, you'd need to store per-doctor ratings)
            # For now, we'll store the rating in the patient's local state
            App.localPut(Int(0), Bytes("last_rating"), rating),
            App.localPut(Int(0), Bytes("rated_doctor"), Txn.application_args[1]),
            
            Approve()
        ])
        
        # Set emergency status
        set_emergency = Seq([
            Assert(Txn.application_args.length() == Int(2)),  # action, emergency_status
            Assert(App.localGet(Int(0), Bytes("user_type")) == Int(2)),  # Must be patient
            
            emergency_status = Btoi(Txn.application_args[1]),
            Assert(Or(emergency_status == Int(0), emergency_status == Int(1))),  # 0 or 1
            
            App.localPut(Int(0), Bytes("emergency_status"), emergency_status),
            Approve()
        ])
        
        # Handle different actions
        handle_action = Cond(
            [action == Bytes("register_doctor"), register_doctor],
            [action == Bytes("register_patient"), register_patient],
            [action == Bytes("submit_pow"), submit_pow],
            [action == Bytes("rate_doctor"), rate_doctor],
            [action == Bytes("set_emergency"), set_emergency],
        )
        
        # Main program logic
        program = Cond(
            [Txn.application_id() == Int(0), on_create],
            [Txn.on_completion() == OnComplete.UpdateApplication, Reject()],
            [Txn.on_completion() == OnComplete.DeleteApplication, Reject()],
            [Txn.on_completion() == OnComplete.OptIn, Approve()],
            [Txn.on_completion() == OnComplete.CloseOut, Approve()],
            [Txn.on_completion() == OnComplete.NoOp, handle_action],
        )
        
        return program
    
    def clear_state_program(self) -> Expr:
        """Clear state program"""
        return Approve()
    
    def compile_contracts(self) -> tuple[str, str]:
        """Compile the contracts to TEAL"""
        approval_teal = compileTeal(self.approval_program(), mode=Mode.Application, version=8)
        clear_teal = compileTeal(self.clear_state_program(), mode=Mode.Application, version=8)
        return approval_teal, clear_teal


# Contract methods for ABI
class ContractMethods:
    """Contract methods for ABI generation"""
    
    @staticmethod
    def get_methods() -> list[Method]:
        """Get all contract methods"""
        return [
            Method(
                name="register_doctor",
                args=[
                    ABIType.from_string("string"),  # name
                    ABIType.from_string("string"),  # specialization
                ],
                returns=Returns(),
                desc="Register a new doctor"
            ),
            Method(
                name="register_patient", 
                args=[
                    ABIType.from_string("string"),  # name
                ],
                returns=Returns(),
                desc="Register a new patient"
            ),
            Method(
                name="submit_pow",
                args=[
                    ABIType.from_string("string"),  # patient_addr
                    ABIType.from_string("string"),  # treatment_desc
                    ABIType.from_string("uint64"),  # timestamp
                ],
                returns=Returns(),
                desc="Submit proof of work for treatment"
            ),
            Method(
                name="rate_doctor",
                args=[
                    ABIType.from_string("string"),  # doctor_addr
                    ABIType.from_string("uint64"),  # rating (1-5)
                ],
                returns=Returns(),
                desc="Rate a doctor"
            ),
            Method(
                name="set_emergency",
                args=[
                    ABIType.from_string("uint64"),  # emergency_status (0 or 1)
                ],
                returns=Returns(),
                desc="Set emergency status for patient"
            ),
        ]


if __name__ == "__main__":
    contract = MedicalConnectContract()
    approval_teal, clear_teal = contract.compile_contracts()
    
    print("=== APPROVAL PROGRAM ===")
    print(approval_teal)
    print("\n=== CLEAR STATE PROGRAM ===")
    print(clear_teal)
    
    # Generate ABI
    methods = ContractMethods.get_methods()
    abi = {
        "name": "MedicalConnectContract",
        "methods": [method.dict() for method in methods],
        "networks": {},
        "events": []
    }
    
    print("\n=== ABI ===")
    print(json.dumps(abi, indent=2))
