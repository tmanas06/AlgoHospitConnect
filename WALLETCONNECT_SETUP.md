# WalletConnect Setup Guide

## Getting Your WalletConnect Project ID

The errors you're seeing are because the WalletConnect Project ID is not configured. Here's how to fix it:

### Step 1: Get a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in to your account
3. Create a new project
4. Copy your Project ID

### Step 2: Update Your Environment Variables

1. Open `frontend/.env` file
2. Replace `your-project-id-here` with your actual Project ID:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your-actual-project-id-here
   ```

### Step 3: Restart Your Development Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

## What Was Fixed

✅ **Created `.env` file** with proper environment variable template
✅ **Fixed wallet configuration** to handle missing Project ID gracefully  
✅ **Added error boundary** to catch and display AppKitProvider errors nicely
✅ **Added validation warnings** when Project ID is missing

## Current Status

- The app will now show a warning in the console if WalletConnect Project ID is missing
- WalletConnect features will be disabled until a valid Project ID is provided
- Error boundary will catch any remaining AppKitProvider errors and show a user-friendly message
- The app should load without crashing even without a valid Project ID

## Next Steps

1. Get your WalletConnect Project ID from the cloud dashboard
2. Update the `.env` file with your actual Project ID
3. Restart the development server
4. The 403 errors should disappear and wallet connection should work properly
