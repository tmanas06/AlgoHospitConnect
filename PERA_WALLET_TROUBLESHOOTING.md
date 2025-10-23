# 🔧 Pera Wallet Connection Troubleshooting Guide

## Current Status

✅ **Enhanced Error Handling**: Added detailed logging and user-friendly error messages  
✅ **Fallback Mechanism**: Demo mode available when Pera Wallet is not installed  
✅ **Better UI Feedback**: Error messages displayed to users with helpful links  

## Debugging Steps

### 1. Check Console Logs
Open browser DevTools (F12) and look for these logs:
- `🔗 Attempting to connect to Pera Wallet...`
- `❌ Pera Wallet not found` (if extension not installed)
- `✅ Successfully connected to Pera Wallet` (if successful)

### 2. Verify Pera Wallet Installation
- **Install Pera Wallet**: Visit [perawallet.app](https://perawallet.app)
- **Check Extension**: Look for Pera Wallet icon in browser toolbar
- **Network Setting**: Ensure Pera Wallet is on **Testnet** (not Mainnet)

### 3. Test Connection Process

#### Option A: With Pera Wallet Installed
1. Click "Connect Pera Wallet" button
2. Pera Wallet should open automatically
3. Select an account to connect
4. Should see success message in console

#### Option B: Without Pera Wallet (Demo Mode)
1. Set `VITE_ENABLE_DEBUG=true` in `.env` file
2. Click "Connect Pera Wallet" button
3. Should use demo address for testing

### 4. Common Issues & Solutions

#### Issue: "Pera Wallet not found"
**Solution**: Install Pera Wallet extension from [perawallet.app](https://perawallet.app)

#### Issue: "Connection rejected by user"
**Solution**: User cancelled the connection. Try again and approve the connection.

#### Issue: "Network mismatch"
**Solution**: 
- Ensure Pera Wallet is on **Testnet**
- Check that `VITE_ALGORAND_NETWORK=testnet` in `.env`

#### Issue: "No accounts returned"
**Solution**: 
- Make sure you have accounts in Pera Wallet
- Try creating a new account in Pera Wallet

## Environment Configuration

Make sure your `.env` file contains:
```env
VITE_ALGORAND_NETWORK=testnet
VITE_ENABLE_DEBUG=true
```

## Testing Checklist

- [ ] Pera Wallet extension installed
- [ ] Pera Wallet on Testnet
- [ ] At least one account in Pera Wallet
- [ ] Console shows connection attempts
- [ ] Error messages display properly
- [ ] Demo mode works when Pera Wallet not available

## Next Steps

1. **Install Pera Wallet** if not already installed
2. **Switch to Testnet** in Pera Wallet settings
3. **Refresh the page** and try connecting again
4. **Check console logs** for detailed error information
5. **Try demo mode** if Pera Wallet is not available

The enhanced error handling should now provide clear feedback about what's going wrong! 🎯
