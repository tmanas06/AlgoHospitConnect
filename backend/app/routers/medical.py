from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from algosdk import account, mnemonic
from algosdk.transaction import PaymentTxn
from algosdk.atomic_transaction_composer import TransactionWithSigner
import json
import time

from ..algorand.client import MedicalConnectClient, create_test_accounts
from ..config import settings

router = APIRouter(prefix="/api/medical", tags=["medical"])

# Pydantic models for API requests/responses
class RegisterDoctorRequest(BaseModel):
    name: str
    specialization: str
    wallet_address: str

class RegisterPatientRequest(BaseModel):
    name: str
    wallet_address: str

class SubmitPoWRequest(BaseModel):
    doctor_address: str
    patient_address: str
    treatment_description: str
    medications: Optional[str] = None
    follow_up_required: bool = False
    follow_up_date: Optional[str] = None

class RateDoctorRequest(BaseModel):
    patient_address: str
    doctor_address: str
    rating: int
    comment: Optional[str] = None

class SetEmergencyRequest(BaseModel):
    patient_address: str
    emergency_status: bool

class UserInfoResponse(BaseModel):
    address: str
    user_type: int
    name: str
    specialization: Optional[str] = None
    rating_sum: int = 0
    rating_count: int = 0
    consultations_count: int = 0
    emergency_status: int = 0
    registered: bool

class GlobalStatsResponse(BaseModel):
    total_doctors: int
    total_patients: int
    total_consultations: int
    owner: str

class EmergencyPatientResponse(BaseModel):
    address: str
    name: str
    emergency_status: int
    location: str

class NearbyDoctorResponse(BaseModel):
    address: str
    name: str
    specialization: str
    rating: float
    location: str
    consultations_count: int

# Mock data for demo purposes
MOCK_DOCTORS = [
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
        "location": "Brooklyn, NY",
        "consultations_count": 200
    },
    {
        "address": "DEMO_DOCTOR_3",
        "name": "Dr. Carol Davis",
        "specialization": "Cardiology",
        "rating": 4.9,
        "location": "Queens, NY",
        "consultations_count": 120
    }
]

MOCK_PATIENTS = [
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
        "location": "Brooklyn, NY"
    }
]

@router.post("/register/doctor", response_model=Dict[str, Any])
async def register_doctor(request: RegisterDoctorRequest):
    """Register a new doctor"""
    try:
        # In a real implementation, this would interact with the smart contract
        # For demo purposes, we'll simulate the registration
        
        # Validate inputs
        if not request.name.strip():
            raise HTTPException(status_code=400, detail="Name is required")
        if not request.specialization.strip():
            raise HTTPException(status_code=400, detail="Specialization is required")
        if not request.wallet_address:
            raise HTTPException(status_code=400, detail="Wallet address is required")
        
        # Simulate smart contract interaction
        tx_id = f"DEMO_TX_{int(time.time())}"
        
        return {
            "success": True,
            "transaction_id": tx_id,
            "message": "Doctor registered successfully",
            "user_info": {
                "address": request.wallet_address,
                "user_type": 1,  # 1 = doctor
                "name": request.name,
                "specialization": request.specialization,
                "registered": True
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/register/patient", response_model=Dict[str, Any])
async def register_patient(request: RegisterPatientRequest):
    """Register a new patient"""
    try:
        # Validate inputs
        if not request.name.strip():
            raise HTTPException(status_code=400, detail="Name is required")
        if not request.wallet_address:
            raise HTTPException(status_code=400, detail="Wallet address is required")
        
        # Simulate smart contract interaction
        tx_id = f"DEMO_TX_{int(time.time())}"
        
        return {
            "success": True,
            "transaction_id": tx_id,
            "message": "Patient registered successfully",
            "user_info": {
                "address": request.wallet_address,
                "user_type": 2,  # 2 = patient
                "name": request.name,
                "registered": True
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/pow/submit", response_model=Dict[str, Any])
async def submit_pow(request: SubmitPoWRequest):
    """Submit proof of work for treatment"""
    try:
        # Validate inputs
        if not request.doctor_address:
            raise HTTPException(status_code=400, detail="Doctor address is required")
        if not request.patient_address:
            raise HTTPException(status_code=400, detail="Patient address is required")
        if not request.treatment_description.strip():
            raise HTTPException(status_code=400, detail="Treatment description is required")
        
        # Simulate smart contract interaction
        tx_id = f"DEMO_POW_{int(time.time())}"
        
        return {
            "success": True,
            "transaction_id": tx_id,
            "message": "Proof of work submitted successfully",
            "pow_data": {
                "doctor_address": request.doctor_address,
                "patient_address": request.patient_address,
                "treatment_description": request.treatment_description,
                "medications": request.medications,
                "follow_up_required": request.follow_up_required,
                "follow_up_date": request.follow_up_date,
                "timestamp": int(time.time())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PoW submission failed: {str(e)}")

@router.post("/rating/submit", response_model=Dict[str, Any])
async def submit_rating(request: RateDoctorRequest):
    """Submit a rating for a doctor"""
    try:
        # Validate inputs
        if not request.patient_address:
            raise HTTPException(status_code=400, detail="Patient address is required")
        if not request.doctor_address:
            raise HTTPException(status_code=400, detail="Doctor address is required")
        if request.rating < 1 or request.rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
        # Simulate smart contract interaction
        tx_id = f"DEMO_RATING_{int(time.time())}"
        
        return {
            "success": True,
            "transaction_id": tx_id,
            "message": "Rating submitted successfully",
            "rating_data": {
                "patient_address": request.patient_address,
                "doctor_address": request.doctor_address,
                "rating": request.rating,
                "comment": request.comment,
                "timestamp": int(time.time())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rating submission failed: {str(e)}")

@router.post("/emergency/set", response_model=Dict[str, Any])
async def set_emergency_status(request: SetEmergencyRequest):
    """Set emergency status for a patient"""
    try:
        if not request.patient_address:
            raise HTTPException(status_code=400, detail="Patient address is required")
        
        # Simulate smart contract interaction
        tx_id = f"DEMO_EMERGENCY_{int(time.time())}"
        
        return {
            "success": True,
            "transaction_id": tx_id,
            "message": f"Emergency status set to {request.emergency_status}",
            "emergency_data": {
                "patient_address": request.patient_address,
                "emergency_status": request.emergency_status,
                "timestamp": int(time.time())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emergency status update failed: {str(e)}")

@router.get("/user/{address}", response_model=UserInfoResponse)
async def get_user_info(address: str):
    """Get user information"""
    try:
        # In a real implementation, this would query the smart contract
        # For demo purposes, we'll return mock data
        
        # Check if it's a known doctor
        for doctor in MOCK_DOCTORS:
            if doctor["address"] == address:
                return UserInfoResponse(
                    address=address,
                    user_type=1,
                    name=doctor["name"],
                    specialization=doctor["specialization"],
                    rating_sum=int(doctor["rating"] * 100),  # Convert to integer
                    rating_count=25,  # Mock count
                    consultations_count=doctor["consultations_count"],
                    registered=True
                )
        
        # Check if it's a known patient
        for patient in MOCK_PATIENTS:
            if patient["address"] == address:
                return UserInfoResponse(
                    address=address,
                    user_type=2,
                    name=patient["name"],
                    emergency_status=patient["emergency_status"],
                    registered=True
                )
        
        # Return unregistered user
        return UserInfoResponse(
            address=address,
            user_type=0,
            name="",
            registered=False
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user info: {str(e)}")

@router.get("/stats", response_model=GlobalStatsResponse)
async def get_global_stats():
    """Get global contract statistics"""
    try:
        # In a real implementation, this would query the smart contract
        return GlobalStatsResponse(
            total_doctors=len(MOCK_DOCTORS),
            total_patients=len(MOCK_PATIENTS),
            total_consultations=500,  # Mock count
            owner="DEMO_OWNER"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.get("/emergency/patients", response_model=List[EmergencyPatientResponse])
async def get_emergency_patients():
    """Get list of patients in emergency status"""
    try:
        emergency_patients = [
            EmergencyPatientResponse(**patient) 
            for patient in MOCK_PATIENTS 
            if patient["emergency_status"] == 1
        ]
        return emergency_patients
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get emergency patients: {str(e)}")

@router.get("/doctors/nearby", response_model=List[NearbyDoctorResponse])
async def get_nearby_doctors(location: Optional[str] = None):
    """Get list of nearby doctors"""
    try:
        nearby_doctors = [NearbyDoctorResponse(**doctor) for doctor in MOCK_DOCTORS]
        return nearby_doctors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get nearby doctors: {str(e)}")

@router.get("/test-accounts")
async def get_test_accounts():
    """Get test accounts for development"""
    try:
        accounts = create_test_accounts()
        return {
            "success": True,
            "accounts": accounts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create test accounts: {str(e)}")
