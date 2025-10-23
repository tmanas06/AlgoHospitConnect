import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { formatAddress } from '../contexts/AuthContext'
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Moon, 
  Sun,
  Copy,
  Check
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { user, logout } = useAuth()

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const copyAddress = async () => {
    if (!user?.address) return
    
    try {
      await navigator.clipboard.writeText(user.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-card-light dark:bg-card-dark border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
                  Medical Connect
                </h1>
                <p className="text-xs text-text-light/70 dark:text-text-dark/70">
                  {user?.role === 'doctor' ? 'Doctor Dashboard' : 'Patient Dashboard'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 bg-primary/10 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-text-light dark:text-text-dark">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-text-light/70 dark:text-text-dark/70 font-mono">
                    {formatAddress(user?.address || '')}
                  </div>
                </div>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-primary/20 rounded transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-light/70 dark:text-text-dark/70" />
                  )}
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-text-light dark:text-text-dark" />
                ) : (
                  <Moon className="w-5 h-5 text-text-light dark:text-text-dark" />
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-text-light dark:text-text-dark" />
                ) : (
                  <Moon className="w-5 h-5 text-text-light dark:text-text-dark" />
                )}
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-text-light dark:text-text-dark" />
                ) : (
                  <Menu className="w-5 h-5 text-text-light dark:text-text-dark" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card-light dark:bg-card-dark border-t border-primary/20">
            <div className="px-4 py-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 bg-primary/10 rounded-lg px-3 py-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-light dark:text-text-dark">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70 font-mono">
                    {formatAddress(user?.address || '')}
                  </div>
                </div>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-primary/20 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-light/70 dark:text-text-dark/70" />
                  )}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
