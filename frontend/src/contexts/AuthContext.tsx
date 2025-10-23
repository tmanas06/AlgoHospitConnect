import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import * as algosdk from 'algosdk'
import { peraWallet, isPeraWalletAvailable } from '../config/wallet'
import { smartContractService } from '../services/smartContract'

// Extend window interface for Pera Wallet
declare global {
  interface Window {
    peraWallet?: any
  }
}

export type UserRole = 'doctor' | 'patient' | null

export interface User {
  address: string
  role: UserRole
  name?: string
  specialization?: string
  isRegistered: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (role: UserRole, userData?: Partial<User>) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  connectWallet: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('medicalConnectUser')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('medicalConnectUser')
      }
    }
  }, [])

  const connectWallet = async (): Promise<string | null> => {
    try {
      console.log('🔗 Attempting to connect to Pera Wallet...')
      
      // Check if Pera Wallet is available
      if (!isPeraWalletAvailable()) {
        console.error('❌ Pera Wallet not found. Please install Pera Wallet extension.')
        throw new Error('Pera Wallet not found. Please install Pera Wallet extension.')
      }

      console.log('🔌 Pera Wallet found, attempting connection...')
      
      // Try to connect to Pera Wallet
      const accounts = await peraWallet.connect()
      
      if (accounts && accounts.length > 0) {
        console.log('✅ Successfully connected to Pera Wallet')
        console.log('📱 Connected account:', accounts[0])
        return accounts[0]
      } else {
        console.error('❌ No accounts returned from Pera Wallet')
        throw new Error('No accounts returned from Pera Wallet')
      }
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('rejected')) {
          throw new Error('Connection rejected by user')
        } else if (error.message.includes('not found') || error.message.includes('undefined')) {
          throw new Error('Pera Wallet not found. Please install Pera Wallet extension.')
        } else {
          throw new Error(`Wallet connection failed: ${error.message}`)
        }
      }
      
      throw new Error('Failed to connect wallet')
    }
  }

  const login = async (role: UserRole, userData?: Partial<User>) => {
    setIsLoading(true)
    try {
      const address = await connectWallet()
      if (!address) {
        throw new Error('Failed to connect wallet')
      }

      // Register user on the smart contract
      let contractResult
      if (role === 'doctor' && userData?.name && userData?.specialization) {
        contractResult = await smartContractService.registerDoctor(
          userData.name, 
          userData.specialization
        )
      } else if (role === 'patient' && userData?.name) {
        contractResult = await smartContractService.registerPatient(userData.name)
      } else {
        throw new Error('Missing required user data for registration')
      }

      if (!contractResult.success) {
        throw new Error(contractResult.error || 'Failed to register on smart contract')
      }

      const newUser: User = {
        address,
        role,
        isRegistered: true,
        ...userData
      }

      setUser(newUser)
      localStorage.setItem('medicalConnectUser', JSON.stringify(newUser))
      
      console.log('✅ User registered successfully on smart contract:', contractResult.txId)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // Disconnect from Pera Wallet
      await peraWallet.disconnect()
      
      setUser(null)
      localStorage.removeItem('medicalConnectUser')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('medicalConnectUser', JSON.stringify(updatedUser))
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    connectWallet
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

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
