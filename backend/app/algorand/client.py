from algokit_utils import ApplicationClient, ApplicationSpecification
from algosdk.atomic_transaction_composer import TransactionWithSigner
from algosdk.transaction import ApplicationCallTxn, PaymentTxn
from algosdk.account import generate_account
from algosdk.encoding import decode_address, encode_address
from typing import Dict, Any, Optional, List
import json
import time


class MedicalConnectClient:
    """Client for interacting with the Medical Connect smart contract"""
    
    def __init__(self, algod_client, app_client: ApplicationClient):
        self.algod_client = algod_client
        self.app_client = app_client
        
    @classmethod
    def deploy_contract(cls, algod_client, creator_account) -> 'MedicalConnectClient':
        """Deploy the Medical Connect contract"""
        from .medical_connect import MedicalConnectContract
        
        contract = MedicalConnectContract()
        approval_teal, clear_teal = contract.compile_contracts()
        
        # Create app spec
        app_spec = ApplicationSpecification(
            name="MedicalConnectContract",
            approval_program=approval_teal,
            clear_state_program=clear_teal,
            global_schema=None,
            local_schema=None,
            foreign_apps=[],
            foreign_assets=[],
            boxes=[],
            methods=[]
        )
        
        # Deploy the contract
        app_client = ApplicationClient(algod_client, app_spec, creator=creator_account)
        app_client.create()
        
        return cls(algod_client, app_client)
    
    def register_doctor(self, doctor_account, name: str, specialization: str) -> str:
        """Register a new doctor"""
        try:
            result = self.app_client.call(
                doctor_account,
                "register_doctor",
                name=name,
                specialization=specialization
            )
            return result.txid
        except Exception as e:
            raise Exception(f"Failed to register doctor: {str(e)}")
    
    def register_patient(self, patient_account, name: str) -> str:
        """Register a new patient"""
        try:
            result = self.app_client.call(
                patient_account,
                "register_patient", 
                name=name
            )
            return result.txid
        except Exception as e:
            raise Exception(f"Failed to register patient: {str(e)}")
    
    def submit_pow(self, doctor_account, patient_address: str, treatment_desc: str) -> str:
        """Submit proof of work for treatment"""
        try:
            timestamp = int(time.time())
            result = self.app_client.call(
                doctor_account,
                "submit_pow",
                patient_addr=patient_address,
                treatment_desc=treatment_desc,
                timestamp=timestamp
            )
            return result.txid
        except Exception as e:
            raise Exception(f"Failed to submit PoW: {str(e)}")
    
    def rate_doctor(self, patient_account, doctor_address: str, rating: int) -> str:
        """Rate a doctor (1-5 scale)"""
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
            
        try:
            result = self.app_client.call(
                patient_account,
                "rate_doctor",
                doctor_addr=doctor_address,
                rating=rating
            )
            return result.txid
        except Exception as e:
            raise Exception(f"Failed to rate doctor: {str(e)}")
    
    def set_emergency_status(self, patient_account, emergency_status: bool) -> str:
        """Set emergency status for patient"""
        try:
            status = 1 if emergency_status else 0
            result = self.app_client.call(
                patient_account,
                "set_emergency",
                emergency_status=status
            )
            return result.txid
        except Exception as e:
            raise Exception(f"Failed to set emergency status: {str(e)}")
    
    def get_user_info(self, account_address: str) -> Dict[str, Any]:
        """Get user information from local state"""
        try:
            local_state = self.app_client.get_local_state(account_address)
            if not local_state:
                return {"user_type": 0, "registered": False}
            
            return {
                "user_type": local_state.get("user_type", 0),
                "name": local_state.get("name", ""),
                "specialization": local_state.get("specialization", ""),
                "rating_sum": local_state.get("rating_sum", 0),
                "rating_count": local_state.get("rating_count", 0),
                "consultations_count": local_state.get("consultations_count", 0),
                "emergency_status": local_state.get("emergency_status", 0),
                "registered": True
            }
        except Exception as e:
            return {"user_type": 0, "registered": False, "error": str(e)}
    
    def get_global_stats(self) -> Dict[str, Any]:
        """Get global contract statistics"""
        try:
            global_state = self.app_client.get_global_state()
            return {
                "total_doctors": global_state.get("total_doctors", 0),
                "total_patients": global_state.get("total_patients", 0),
                "total_consultations": global_state.get("total_consultations", 0),
                "owner": global_state.get("owner", "")
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_emergency_patients(self) -> List[Dict[str, Any]]:
        """Get list of patients in emergency status"""
        # This would require scanning all accounts that opted into the contract
        # For demo purposes, we'll return a mock list
        return [
            {
                "address": "DEMO_PATIENT_1",
                "name": "John Doe",
                "emergency_status": 1,
                "location": "New York, NY"
            },
            {
                "address": "DEMO_PATIENT_2", 
                "name": "Jane Smith",
                "emergency_status": 1,
                "location": "Los Angeles, CA"
            }
        ]
    
    def get_nearby_doctors(self, patient_location: str) -> List[Dict[str, Any]]:
        """Get list of nearby doctors"""
        # This would require location-based filtering
        # For demo purposes, we'll return a mock list
        return [
            {
                "address": "DEMO_DOCTOR_1",
                "name": "Dr. Alice Johnson",
                "specialization": "Emergency Medicine",
                "rating": 4.8,
                "location": "New York, NY",
                "consultations_count": 150
            },
            {
                "address": "DEMO_DOCTOR_2",
                "name": "Dr. Bob Wilson", 
                "specialization": "General Practice",
                "rating": 4.5,
                "location": "New York, NY",
                "consultations_count": 200
            }
        ]


# Utility functions for account management
def create_test_accounts() -> Dict[str, Dict[str, str]]:
    """Create test accounts for development"""
    accounts = {}
    
    # Create doctor account
    doctor_private_key, doctor_address = generate_account()
    accounts["doctor"] = {
        "address": doctor_address,
        "private_key": doctor_private_key,
        "mnemonic": ""  # In real implementation, you'd generate mnemonic
    }
    
    # Create patient account
    patient_private_key, patient_address = generate_account()
    accounts["patient"] = {
        "address": patient_address,
        "private_key": patient_private_key,
        "mnemonic": ""
    }
    
    return accounts


def format_address(address: str) -> str:
    """Format Algorand address for display"""
    if len(address) > 10:
        return f"{address[:6]}...{address[-4:]}"
    return address