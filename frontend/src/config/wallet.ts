import { PeraWalletConnect } from '@perawallet/connect'
import { QueryClient } from '@tanstack/react-query'

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
  // Optional: Add any specific configuration here
  // The library should auto-detect the network
});

// Create query client
export const queryClient = new QueryClient();

// Helper function to check if Pera Wallet is available
export const isPeraWalletAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.peraWallet;
};

export default peraWallet;
