// Simplified Smart Contract Service for Demo
// This will be replaced with actual Algorand integration after contract deployment

export interface ContractCallResult {
  success: boolean
  txId?: string
  error?: string
}

export interface UserInfo {
  user_type: number // 0 = not registered, 1 = doctor, 2 = patient
  name: string
  specialization?: string
  rating_sum?: number
  rating_count?: number
  consultations_count?: number
  emergency_status?: number
  registered: boolean
}

export interface GlobalStats {
  total_doctors: number
  total_patients: number
  total_consultations: number
  owner: string
}

class SmartContractService {
  /**
   * Register a doctor on the smart contract (Demo implementation)
   */
  async registerDoctor(name: string, specialization: string): Promise<ContractCallResult> {
    try {
      console.log('📝 Registering doctor:', name, specialization)
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const txId = 'DEMO_TX_' + Math.random().toString(36).substr(2, 9)
      console.log('✅ Doctor registered successfully (demo):', txId)
      
      return { success: true, txId }
    } catch (error) {
      console.error('❌ Failed to register doctor:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Register a patient on the smart contract (Demo implementation)
   */
  async registerPatient(name: string): Promise<ContractCallResult> {
    try {
      console.log('📝 Registering patient:', name)
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const txId = 'DEMO_TX_' + Math.random().toString(36).substr(2, 9)
      console.log('✅ Patient registered successfully (demo):', txId)
      
      return { success: true, txId }
    } catch (error) {
      console.error('❌ Failed to register patient:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Submit proof of work for treatment (Demo implementation)
   */
  async submitProofOfWork(patientAddress: string, treatmentDescription: string): Promise<ContractCallResult> {
    try {
      console.log('📝 Submitting proof of work:', patientAddress, treatmentDescription)
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const txId = 'DEMO_TX_' + Math.random().toString(36).substr(2, 9)
      console.log('✅ Proof of work submitted successfully (demo):', txId)
      
      return { success: true, txId }
    } catch (error) {
      console.error('❌ Failed to submit proof of work:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Rate a doctor (Demo implementation)
   */
  async rateDoctor(doctorAddress: string, rating: number): Promise<ContractCallResult> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }

      console.log('📝 Rating doctor:', doctorAddress, rating)
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const txId = 'DEMO_TX_' + Math.random().toString(36).substr(2, 9)
      console.log('✅ Doctor rated successfully (demo):', txId)
      
      return { success: true, txId }
    } catch (error) {
      console.error('❌ Failed to rate doctor:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Set emergency status for patient (Demo implementation)
   */
  async setEmergencyStatus(emergencyStatus: boolean): Promise<ContractCallResult> {
    try {
      console.log('📝 Setting emergency status:', emergencyStatus)
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const txId = 'DEMO_TX_' + Math.random().toString(36).substr(2, 9)
      console.log('✅ Emergency status updated successfully (demo):', txId)
      
      return { success: true, txId }
    } catch (error) {
      console.error('❌ Failed to set emergency status:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get user information from the smart contract (Demo implementation)
   */
  async getUserInfo(address: string): Promise<UserInfo> {
    try {
      console.log('📝 Getting user info for:', address)
      
      // Return demo data
      return {
        user_type: 1, // Demo doctor
        name: 'Demo User',
        specialization: 'General Practice',
        rating_sum: 20,
        rating_count: 5,
        consultations_count: 10,
        emergency_status: 0,
        registered: true
      }
    } catch (error) {
      console.error('❌ Failed to get user info:', error)
      return { user_type: 0, name: '', registered: false }
    }
  }

  /**
   * Get global contract statistics (Demo implementation)
   */
  async getGlobalStats(): Promise<GlobalStats> {
    try {
      console.log('📝 Getting global stats')
      
      // Return demo data
      return {
        total_doctors: 5,
        total_patients: 20,
        total_consultations: 50,
        owner: 'DEMO_OWNER'
      }
    } catch (error) {
      console.error('❌ Failed to get global stats:', error)
      return { total_doctors: 0, total_patients: 0, total_consultations: 0, owner: '' }
    }
  }

  /**
   * Update contract configuration after deployment
   */
  updateContractConfig(appId: number, appAddress: string) {
    console.log('📝 Contract configuration updated:', { appId, appAddress })
  }
}

// Export singleton instance
export const smartContractService = new SmartContractService()
export default smartContractService
