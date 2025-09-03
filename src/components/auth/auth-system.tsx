'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export function AuthSystem() {
  const { data: session, status } = useSession()
  const [isSignUp, setIsSignUp] = useState(false)
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

    // Check if response is ok first
    if (!response.ok) {
      // Try to parse JSON error message
      let errorMessage = 'Signup failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (jsonError) {
        // If JSON parsing fails, use status text
        errorMessage = `Server error: ${response.status} ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    // Parse successful response
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

  // Loading state
  if (status === 'loading') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin text-4xl">🔄</div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  // User is logged in
  if (session) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-1">{session.user?.name || 'User'}</p>
          <p className="text-sm text-gray-500">{session.user?.email}</p>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-700 text-sm font-medium">
                Successfully logged in
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    )
  }

  // User is not logged in - show auth forms
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isSignUp 
            ? 'Sign up for your Intelligent Task Planner' 
            : 'Sign in to your Intelligent Task Planner'
          }
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{message}</p>
        </div>
      )}

      <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4 mb-6">
        {isSignUp && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            required
          />
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin text-lg mr-2">🔄</div>
              {isSignUp ? 'Creating Account...' : 'Signing in...'}
            </span>
          ) : (
            isSignUp ? '🎯 Create Account' : '🔐 Sign In'
          )}
        </button>
      </form>

      {/* Toggle Sign Up / Sign In */}
      <div className="text-center mb-4">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
            setMessage('')
            setFormData({ name: '', email: '', password: '', confirmPassword: '' })
          }}
          className="text-blue-600 hover:underline text-sm"
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
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google Login */}
      <button
        onClick={() => signIn('google')}
        className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg border border-gray-300 transition duration-200 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
        🚀 Continue with Google
      </button>
    </div>
  )
}
