import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import * as algosdk from 'algosdk'
import { PrivyProvider, usePrivy } from '@privy-io/react-auth'
import { peraWallet, isPeraWalletAvailable, connectWithQR, connectWithExtension } from '../config/wallet'
import { smartContractService } from '../services/smartContract'

// Extend window interface for Pera Wallet
declare global {
  interface Window {
    peraWallet?: any
  }
}

export type UserRole = 'doctor' | 'patient' | null

export interface User {
  address?: string
  role: UserRole
  name?: string
  specialization?: string
  isRegistered: boolean
  privyId?: string
  email?: string
  walletConnected?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (role: UserRole, userData?: Partial<User>) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  connectWallet: (method: 'qr' | 'extension') => Promise<string | null>
  disconnectWallet: () => Promise<void>
  isWalletConnected: boolean
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

// Inner AuthProvider component that uses Privy
const AuthProviderInner: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { ready, authenticated, user: privyUser, login: privyLogin, logout: privyLogout } = usePrivy()

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

  // Sync with Privy user when authenticated
  useEffect(() => {
    if (ready && authenticated && privyUser && !user) {
      const privyUserData: User = {
        privyId: privyUser.id,
        email: privyUser.email?.address,
        role: null, // Will be set during login
        isRegistered: false,
        walletConnected: false
      }
      setUser(privyUserData)
    }
  }, [ready, authenticated, privyUser, user])

  const connectWallet = async (method: 'qr' | 'extension'): Promise<string | null> => {
    console.log(`🔗 [AuthContext] connectWallet called with method: ${method}`);
    
    try {
      console.log(`🔗 [AuthContext] Attempting to connect to Pera Wallet via ${method}...`);
      
      let address: string | null = null;
      
      if (method === 'qr') {
        console.log('🔄 [AuthContext] Connecting with QR code...');
        try {
          address = await connectWithQR();
        } catch (qrError) {
          console.error('❌ [AuthContext] QR connection failed:', qrError);
          throw new Error(`QR code connection failed: ${qrError instanceof Error ? qrError.message : 'Unknown error'}`);
        }
      } else {
        console.log('🔌 [AuthContext] Connecting with extension...');
        try {
          address = await connectWithExtension();
        } catch (extError) {
          console.error('❌ [AuthContext] Extension connection failed:', extError);
          // If extension connection fails, suggest trying QR code
          throw new Error(`Extension connection failed. ${extError instanceof Error ? extError.message : 'Please try using QR code instead.'}`);
        }
      }
      
      if (address) {
        console.log('✅ [AuthContext] Successfully connected to Pera Wallet');
        console.log('📱 [AuthContext] Connected account:', address);
        
        // Update user with wallet connection
        if (user) {
          const updatedUser = { ...user, address, walletConnected: true }
          setUser(updatedUser)
          localStorage.setItem('medicalConnectUser', JSON.stringify(updatedUser))
        }
        
        return address;
      } else {
        const errorMsg = '❌ [AuthContext] No accounts returned from Pera Wallet';
        console.error(errorMsg);
        throw new Error('No accounts returned from Pera Wallet');
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

  const disconnectWallet = async (): Promise<void> => {
    try {
      await peraWallet.disconnect()
      
      if (user) {
        const updatedUser = { ...user, address: undefined, walletConnected: false }
        setUser(updatedUser)
        localStorage.setItem('medicalConnectUser', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const login = async (role: UserRole, userData?: Partial<User>) => {
    setIsLoading(true)
    try {
      // First authenticate with Privy if not already authenticated
      if (!authenticated) {
        await privyLogin()
        return // Privy login will trigger the useEffect that sets up the user
      }

      // If user is authenticated with Privy, complete the role selection
      if (user && privyUser) {
        const updatedUser: User = {
          ...user,
          role,
          name: userData?.name || user.name,
          specialization: userData?.specialization || user.specialization,
          isRegistered: true
        }

        setUser(updatedUser)
        localStorage.setItem('medicalConnectUser', JSON.stringify(updatedUser))
        
        console.log('✅ User logged in successfully with role:', role)
      }
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
      // Disconnect from Pera Wallet if connected
      if (user?.walletConnected) {
        await disconnectWallet()
      }
      
      // Logout from Privy
      await privyLogout()
      
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
    connectWallet,
    disconnectWallet,
    isWalletConnected: user?.walletConnected || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Outer AuthProvider component that wraps with PrivyProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID || 'your-privy-app-id'}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'discord'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </PrivyProvider>
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
