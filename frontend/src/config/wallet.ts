import { PeraWalletConnect } from '@perawallet/connect'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import { QueryClient } from '@tanstack/react-query'
import algosdk from 'algosdk'

// Algorand Network Configuration
export const ALGORAND_NETWORKS = {
  TESTNET: {
    id: 'testnet',
    name: 'Algorand Testnet',
    algodUrl: 'https://testnet-api.algonode.cloud',
    indexerUrl: 'https://testnet-idx.algonode.cloud',
  },
  MAINNET: {
    id: 'mainnet',
    name: 'Algorand Mainnet',
    algodUrl: 'https://mainnet-api.algonode.cloud',
    indexerUrl: 'https://mainnet-idx.algonode.cloud',
  },
} as const;

// Get network from environment or default to testnet
const isTestnet = (import.meta.env.VITE_ALGORAND_NETWORK || 'testnet').toLowerCase() === 'testnet';
export const selectedNetwork = isTestnet ? ALGORAND_NETWORKS.TESTNET : ALGORAND_NETWORKS.MAINNET;

// Initialize Pera Wallet Connect with proper configuration
export const peraWallet = new PeraWalletConnect({
  chainId: selectedNetwork.id === 'testnet' ? 416002 : 416001, // Testnet or Mainnet
  shouldShowSignTxnToast: false
});

// Initialize WalletConnect
const walletConnectOpts = {
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModal: QRCodeModal,
  qrcodeModalOptions: {
    mobileLinks: ['pera', 'defly', 'exodus']
  }
};

// Function to connect with QR code using WalletConnect
export const connectWithQR = async (): Promise<string> => {
  console.log('🔵 [wallet.ts] Starting WalletConnect QR code connection...');
  
  const connector = new WalletConnect({
    ...walletConnectOpts,
    clientMeta: {
      name: 'AlgoHospitConnect',
      description: 'Decentralized Healthcare Platform',
      url: window.location.origin,
      icons: [`${window.location.origin}/logo192.png`]
    }
  });

  try {
    // Check if connection is already established
    if (!connector.connected) {
      console.log('🔄 [wallet.ts] Creating new WalletConnect session');
      await connector.createSession();
      
      // Wait for the user to connect
      const accounts = await new Promise<string[]>((resolve, reject) => {
        connector.on('connect', (error, payload) => {
          if (error) {
            reject(error);
            return;
          }
          const { accounts } = payload.params[0];
          resolve(accounts);
        });
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from WalletConnect');
      }
      
      console.log('✅ [wallet.ts] WalletConnect connection successful, accounts:', accounts);
      return accounts[0];
    } else {
      // Reuse existing connection
      return connector.accounts[0];
    }
  } catch (error) {
    console.error('❌ [wallet.ts] WalletConnect connection error:', error);
    throw new Error(`WalletConnect failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Function to connect with extension
export const connectWithExtension = async (): Promise<string> => {
  console.log('🔵 [wallet.ts] Starting extension connection...');
  
  try {
    console.log('🔍 [wallet.ts] Checking if Pera Wallet is available');
    const isAvailable = isPeraWalletAvailable();
    console.log(`ℹ️ [wallet.ts] Pera Wallet available:`, isAvailable);
    
    if (!isAvailable) {
      // If Pera Wallet is not available, try WalletConnect as fallback
      console.log('⚠️ [wallet.ts] Pera Wallet not found, trying WalletConnect...');
      return connectWithQR();
    }
    
    console.log('🔄 [wallet.ts] Calling peraWallet.connect()');
    const accounts = await peraWallet.connect();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from Pera Wallet');
    }
    
    console.log('✅ [wallet.ts] Extension connection successful, accounts:', accounts);
    return accounts[0];
  } catch (error) {
    console.error('❌ [wallet.ts] Extension connection error, falling back to QR code:', error);
    
    // If extension connection fails, try WalletConnect as fallback
    try {
      console.log('🔄 [wallet.ts] Falling back to QR code connection...');
      return await connectWithQR();
    } catch (qrError) {
      console.error('❌ [wallet.ts] All connection methods failed:', qrError);
      throw new Error(`Failed to connect with any method: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Create query client
export const queryClient = new QueryClient();

// Helper function to check if Pera Wallet is available
export const isPeraWalletAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.peraWallet;
};

export default peraWallet;
