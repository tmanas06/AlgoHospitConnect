import * as algosdk from 'algosdk'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface UserInfo {
  address: string
  user_type: number
  name: string
  specialization?: string
  rating_sum: number
  rating_count: number
  consultations_count: number
  emergency_status: number
  registered: boolean
}

export interface RegisterDoctorRequest {
  name: string
  specialization: string
  wallet_address: string
}

export interface RegisterPatientRequest {
  name: string
  wallet_address: string
}

export interface SubmitPoWRequest {
  doctor_address: string
  patient_address: string
  treatment_description: string
  medications?: string
  follow_up_required: boolean
  follow_up_date?: string
}

export interface RateDoctorRequest {
  patient_address: string
  doctor_address: string
  rating: number
  comment?: string
}

export interface SetEmergencyRequest {
  patient_address: string
  emergency_status: boolean
}

export interface EmergencyPatient {
  address: string
  name: string
  emergency_status: number
  location: string
}

export interface NearbyDoctor {
  address: string
  name: string
  specialization: string
  rating: number
  location: string
  consultations_count: number
}

class MedicalConnectAPI {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  // User Registration
  async registerDoctor(data: RegisterDoctorRequest): Promise<{ success: boolean; transaction_id: string; user_info: UserInfo }> {
    return this.request('/api/medical/register/doctor', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async registerPatient(data: RegisterPatientRequest): Promise<{ success: boolean; transaction_id: string; user_info: UserInfo }> {
    return this.request('/api/medical/register/patient', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // User Information
  async getUserInfo(address: string): Promise<UserInfo> {
    return this.request(`/api/medical/user/${address}`)
  }

  // Proof of Work
  async submitPoW(data: SubmitPoWRequest): Promise<{ success: boolean; transaction_id: string; pow_data: any }> {
    return this.request('/api/medical/pow/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Ratings
  async submitRating(data: RateDoctorRequest): Promise<{ success: boolean; transaction_id: string; rating_data: any }> {
    return this.request('/api/medical/rating/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Emergency
  async setEmergencyStatus(data: SetEmergencyRequest): Promise<{ success: boolean; transaction_id: string; emergency_data: any }> {
    return this.request('/api/medical/emergency/set', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getEmergencyPatients(): Promise<EmergencyPatient[]> {
    return this.request('/api/medical/emergency/patients')
  }

  // Doctor Discovery
  async getNearbyDoctors(location?: string): Promise<NearbyDoctor[]> {
    const params = location ? `?location=${encodeURIComponent(location)}` : ''
    return this.request(`/api/medical/doctors/nearby${params}`)
  }

  // Global Stats
  async getGlobalStats(): Promise<{ total_doctors: number; total_patients: number; total_consultations: number; owner: string }> {
    return this.request('/api/medical/stats')
  }

  // Test Accounts (for development)
  async getTestAccounts(): Promise<{ success: boolean; accounts: any }> {
    return this.request('/api/medical/test-accounts')
  }
}

// Create singleton instance
export const medicalAPI = new MedicalConnectAPI()

// Utility functions
export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const isValidAlgorandAddress = (address: string): boolean => {
  try {
    algosdk.decodeAddress(address)
    return true
  } catch {
    return false
  }
}

export const calculateAverageRating = (ratingSum: number, ratingCount: number): number => {
  if (ratingCount === 0) return 0
  return ratingSum / ratingCount
}

export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars)
}

export default medicalAPI
