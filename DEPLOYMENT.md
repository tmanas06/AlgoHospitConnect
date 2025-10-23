# Medical Connect DApp - Deployment Guide

## 🚀 Lora Explorer DApp Lab Deployment

This guide will help you deploy the Medical Connect DApp to Lora Explorer's DApp Lab for demonstration purposes.

### Prerequisites

1. **Algorand Testnet Account**: Create an account on Algorand Testnet
2. **Pera Wallet**: Install Pera Wallet browser extension
3. **Testnet ALGO**: Get testnet ALGO from the [Algorand Testnet Faucet](https://testnet.algoexplorer.io/dispenser)
4. **Lora Explorer Account**: Sign up at [Lora Explorer](https://lora.algokit.io/)

### Step 1: Prepare the Frontend

1. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Configure environment variables**:
   Create a `.env.production` file:
   ```env
   VITE_API_URL=https://your-backend-url.com
   VITE_WALLETCONNECT_PROJECT_ID=your-project-id
   ```

### Step 2: Deploy Smart Contract

1. **Navigate to Lora Explorer DApp Lab**:
   - Go to [Lora Explorer DApp Lab](https://lora.algokit.io/testnet/app-lab)
   - Connect your wallet

2. **Deploy the Medical Connect Contract**:
   ```bash
   cd backend
   python app/algorand/contracts/medical_connect.py
   ```
   Copy the generated TEAL code and ABI to Lora Explorer.

3. **Configure Contract Parameters**:
   - Set contract name: "MedicalConnectContract"
   - Set description: "Decentralized healthcare platform"
   - Upload the compiled TEAL code

### Step 3: Deploy Frontend

1. **Upload Frontend Build**:
   - Zip the `frontend/dist` folder
   - Upload to Lora Explorer DApp Lab
   - Configure the app settings

2. **Configure App Settings**:
   - App Name: "Medical Connect"
   - Description: "Decentralized healthcare platform"
   - Category: "Healthcare"
   - Tags: "algorand", "healthcare", "emergency", "blockchain"

### Step 4: Test the Deployment

1. **Connect Wallet**:
   - Open the deployed DApp
   - Connect your Pera Wallet
   - Ensure you're on Algorand Testnet

2. **Test Core Features**:
   - Register as a doctor or patient
   - Test emergency functionality
   - Submit proof of work
   - Rate doctors

### Step 5: Demo Preparation

1. **Prepare Demo Data**:
   - Create test doctor accounts
   - Create test patient accounts
   - Set up emergency scenarios

2. **Demo Script**:
   ```
   1. Show login flow with Pera Wallet
   2. Demonstrate doctor registration
   3. Show patient emergency request
   4. Display doctor dashboard
   5. Submit proof of work
   6. Show rating system
   7. Display blockchain verification
   ```

## 🔧 Configuration Files

### Frontend Build Configuration

Update `frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### Backend API Configuration

Update `backend/app/config.py`:
```python
class Settings(BaseSettings):
    environment: str = Field("production", alias="ENVIRONMENT")
    cors_origins: str = Field(
        "https://lora.algokit.io,https://your-frontend-url.com", 
        alias="CORS_ORIGINS"
    )
    algorand_network: str = Field("testnet", alias="ALGORAND_NETWORK")
    algod_url: str = Field("https://testnet-api.algonode.cloud", alias="ALGOD_URL")
    indexer_url: str = Field(
        "https://testnet-idx.algonode.cloud", 
        alias="INDEXER_URL"
    )
    algod_token: str = Field("", alias="ALGOD_TOKEN")
```

## 📱 Mobile Optimization

For better mobile experience on Lora Explorer:

1. **Responsive Design**: Ensure all components are mobile-friendly
2. **Touch Interactions**: Optimize buttons and touch targets
3. **Wallet Integration**: Test Pera Wallet mobile app integration

## 🔍 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**:
   - Ensure Pera Wallet is installed
   - Check network configuration (Testnet)
   - Clear browser cache

2. **Smart Contract Errors**:
   - Verify TEAL compilation
   - Check contract parameters
   - Ensure sufficient ALGO for deployment

3. **API Connection Issues**:
   - Check CORS configuration
   - Verify API endpoints
   - Test backend connectivity

### Debug Mode

Enable debug mode in production:
```env
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

## 📊 Analytics and Monitoring

1. **User Analytics**: Track user interactions
2. **Error Monitoring**: Monitor API errors
3. **Performance Metrics**: Track load times

## 🎯 Demo Checklist

- [ ] Frontend builds successfully
- [ ] Smart contract deploys without errors
- [ ] Wallet connection works
- [ ] User registration functions
- [ ] Emergency system works
- [ ] PoW submission works
- [ ] Rating system functions
- [ ] Mobile responsiveness verified
- [ ] All features tested end-to-end

## 📈 Post-Deployment

1. **Monitor Performance**: Track app usage and performance
2. **Collect Feedback**: Gather user feedback
3. **Iterate**: Make improvements based on feedback
4. **Scale**: Consider mainnet deployment

---

**Note**: This is a demonstration version. For production use, additional security measures, testing, and compliance requirements should be implemented.
