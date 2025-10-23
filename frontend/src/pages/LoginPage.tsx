import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usePrivy } from '@privy-io/react-auth'
import { User, Stethoscope, AlertCircle, ArrowRight, Mail, LogIn } from 'lucide-react'

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient' | null>(null)
  const [userData, setUserData] = useState({
    name: '',
    specialization: ''
  })
  const [error, setError] = useState<string | null>(null)
  
  const { login, user } = useAuth()
  const { ready, authenticated, login: privyLogin } = usePrivy()
  const navigate = useNavigate()

  const handlePrivyLogin = async () => {
    setError(null)
    try {
      await privyLogin()
    } catch (error) {
      console.error('Privy login failed:', error)
      setError('Failed to authenticate. Please try again.')
    }
  }

  const handleRoleSelect = async (role: 'doctor' | 'patient') => {
    setSelectedRole(role)
    setError(null)
  }

  const handleLogin = async () => {
    if (!selectedRole) return
    
    setError(null)
    try {
      await login(selectedRole, {
        name: userData.name,
        specialization: userData.specialization
      })
      navigate(selectedRole === 'doctor' ? '/doctor' : '/patient')
    } catch (error) {
      console.error('Login failed:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  const isFormValid = () => {
    if (!selectedRole) return false
    if (!userData.name.trim()) return false
    if (selectedRole === 'doctor' && !userData.specialization.trim()) return false
    return true
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl p-8 border border-primary/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
              Medical Connect
            </h1>
            <p className="text-text-light/70 dark:text-text-dark/70">
              Decentralized Healthcare Platform
            </p>
          </div>

          {/* Authentication */}
          {!authenticated ? (
            <div className="space-y-6">
              <div className="text-center">
                <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Sign In to Continue</h2>
                <p className="text-text-light/70 dark:text-text-dark/70 mb-6">
                  Choose your preferred sign-in method
                </p>
              </div>
              
              <button
                onClick={handlePrivyLogin}
                disabled={!ready}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-5 h-5" />
                {!ready ? 'Loading...' : 'Sign In with Email'}
              </button>
              
              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                <p className="text-text-light/70 dark:text-text-dark/70 mb-6">
                  You're successfully signed in. Please select your role to continue.
                </p>
              </div>
            </div>
          )}

          {/* Role Selection */}
          {authenticated && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Select Your Role</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('doctor')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'doctor'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Doctor</div>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                    Provide medical care
                  </div>
                </button>
                
                <button
                  onClick={() => handleRoleSelect('patient')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === 'patient'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <Stethoscope className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Patient</div>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                    Seek medical help
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* User Information Form */}
          {authenticated && selectedRole && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {selectedRole === 'doctor' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specialization *
                  </label>
                  <select
                    value={userData.specialization}
                    onChange={(e) => setUserData({ ...userData, specialization: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select specialization</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="General Practice">General Practice</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                  </select>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={!isFormValid()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
