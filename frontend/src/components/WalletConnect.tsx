import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Wallet, QrCode, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

interface WalletConnectProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
  className?: string
}

const WalletConnect: React.FC<WalletConnectProps> = ({ 
  onConnect, 
  onDisconnect, 
  className = '' 
}) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { connectWallet, disconnectWallet, isWalletConnected, user } = useAuth()

  const handleConnectWallet = async (method: 'qr' | 'extension') => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const address = await connectWallet(method)
      if (address && onConnect) {
        onConnect(address)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      console.error('Wallet connection failed:', error)
      
      // Provide more user-friendly error messages
      let displayError = errorMessage
      if (errorMessage.includes('Pera Wallet')) {
        displayError = 'Pera Wallet not found. Please try using QR code or install the Pera Wallet extension.'
      } else if (errorMessage.includes('rejected')) {
        displayError = 'Connection was rejected. Please try again.'
      }
      
      setError(displayError)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet()
      if (onDisconnect) {
        onDisconnect()
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      setError('Failed to disconnect wallet')
    }
  }

  if (isWalletConnected && user?.address) {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Wallet Connected
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnectWallet}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 text-sm font-medium"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Connect Wallet for Blockchain Activities</h3>
        <p className="text-text-light/70 dark:text-text-dark/70 text-sm">
          Connect your Pera Wallet to access blockchain features like doctor reviews and proof of work uploads
        </p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => handleConnectWallet('extension')}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V5H20V19Z" fill="currentColor"/>
            <path d="M16 15H8V17H16V15Z" fill="currentColor"/>
            <path d="M10.09 7.41L11.5 8.82L8.32 12L11.5 15.18L10.09 16.6L5.5 12L10.09 7.41Z" fill="currentColor"/>
          </svg>
          {isConnecting ? 'Connecting...' : 'Browser Extension'}
        </button>
        
        <div className="flex items-center my-2">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="px-4 text-sm text-text-light/60 dark:text-text-dark/60">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>
        
        <button
          onClick={() => handleConnectWallet('qr')}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-text-light dark:text-text-dark font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <QrCode className="w-5 h-5" />
          {isConnecting ? 'Preparing QR...' : 'Mobile Wallet (QR Code)'}
        </button>
      </div>
      
      <p className="text-xs text-center text-text-light/60 dark:text-text-dark/60 mt-4">
        Don't have Pera Wallet?{' '}
        <a 
          href="https://perawallet.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          Download it here
          <ExternalLink className="w-3 h-3" />
        </a>
      </p>
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          </div>
          {error.includes('Pera Wallet not found') && (
            <div className="mt-2 text-xs text-red-500 dark:text-red-400">
              Please install the Pera Wallet browser extension from{' '}
              <a 
                href="https://perawallet.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                perawallet.app
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WalletConnect
