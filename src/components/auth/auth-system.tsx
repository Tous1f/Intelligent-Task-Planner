'use client'

import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react'

export function EnhancedAuthSystem() {
  const { data: session, status } = useSession()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setMessage('')
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Signup failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (jsonError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setMessage(data.message || 'Account created successfully! You can now sign in.')
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      setIsSignUp(false)

    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password')
      setLoading(false)
      return
    }

    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    })

    if (result?.error) {
      setError(result.error)
    } else if (result?.ok) {
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    }

    setLoading(false)
  }

  // Loading state with beautiful spinner
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center">
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-lavender-200/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-4">
            <motion.div
              className="w-8 h-8 border-3 border-lavender-300 border-t-lavender-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-lavender-700 font-medium">Loading your workspace...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  // User is logged in - Dashboard view
  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-lavender-200/50 max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
            </motion.div>
            <h2 className="text-2xl font-bold text-lavender-900 mb-2">Welcome Back!</h2>
            <p className="text-lavender-600 font-medium">{session.user?.name || 'User'}</p>
            <p className="text-sm text-lavender-500">{session.user?.email}</p>
          </div>

          <div className="space-y-4">
            <motion.div 
              className="p-4 bg-green-50 rounded-2xl border border-green-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-700 font-medium">Successfully authenticated</span>
              </div>
            </motion.div>

            <motion.button
              onClick={() => signOut()}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Out
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Authentication forms
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-lavender-200/50 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-white text-2xl">🎯</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-lavender-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-lavender-600">
            {isSignUp 
              ? 'Join the Intelligent Task Planner community' 
              : 'Sign in to your workspace'
            }
          </p>
        </div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div 
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
                <p className="text-green-700 font-medium">{message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6 mb-6">
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-semibold text-lavender-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-lavender-400" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-lavender-200 rounded-2xl focus:outline-none focus:border-lavender-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-semibold text-lavender-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-lavender-400" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-lavender-200 rounded-2xl focus:outline-none focus:border-lavender-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-lavender-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-lavender-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-4 border-2 border-lavender-200 rounded-2xl focus:outline-none focus:border-lavender-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-lavender-400 hover:text-lavender-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-semibold text-lavender-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-lavender-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-lavender-200 rounded-2xl focus:outline-none focus:border-lavender-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {isSignUp ? 'Creating Account...' : 'Signing in...'}
              </span>
            ) : (
              isSignUp ? '🎯 Create Account' : '🔐 Sign In'
            )}
          </motion.button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center mb-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setMessage('')
              setFormData({ name: '', email: '', password: '', confirmPassword: '' })
            }}
            className="text-lavender-600 hover:text-lavender-700 font-medium transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in here' 
              : "Don't have an account? Sign up here"
            }
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-lavender-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-lavender-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <motion.button
          onClick={() => signIn('google')}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  )
}