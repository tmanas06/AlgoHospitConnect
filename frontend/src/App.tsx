import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/wallet'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientDashboard from './pages/PatientDashboard'
import Layout from './components/Layout'
import './App.css'

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'doctor' | 'patient' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light dark:text-text-dark">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Main App Routes
const AppRoutes: React.FC = () => {
  const { user } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/doctor/*" 
          element={
            <ProtectedRoute requiredRole="doctor">
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/*" 
          element={
            <ProtectedRoute requiredRole="patient">
              <Layout>
                <PatientDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'doctor' ? '/doctor' : '/patient'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors">
            <AppRoutes />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
