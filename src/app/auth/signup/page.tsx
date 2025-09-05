'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User,
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft,
  Shield,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/signin')
      }, 2000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-accent-50/20 to-background dark:from-background dark:via-accent-950/10 dark:to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center backdrop-blur-sm border-border/50 dark:border-white/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-50 dark:bg-accent-950/50 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-accent-600 dark:text-accent-400" />
            </motion.div>
            <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent mb-4">
              Account Created!
            </h2>
            <p className="text-muted-foreground dark:text-slate-400 mb-6">
              Your account has been created successfully. You can now sign in with your credentials.
            </p>
            <LoadingSpinner className="w-6 h-6 mx-auto text-accent-600 dark:text-accent-400" />
            <p className="text-sm text-muted-foreground dark:text-slate-400 mt-4">
              Redirecting to sign in...
            </p>
          </Card>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent-50/20 to-background dark:from-background dark:via-accent-950/10 dark:to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 backdrop-blur-sm border-border/50 dark:border-white/10">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-muted-foreground dark:text-slate-400">
              Join Intelligent Task Planner today
            </p>
          </div>

          {error && (
            <motion.div 
              className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive dark:text-destructive/90"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground dark:text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="transition-colors duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground dark:text-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="transition-colors duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground dark:text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="transition-colors duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground dark:text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="transition-colors duration-200"
                required
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={loading}
              className="w-full shadow-lg shadow-accent-600/20 dark:shadow-accent-500/20"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 dark:border-white/10 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground dark:text-slate-400">
                Already have an account?{' '}
                <Button variant="link" asChild className="text-accent-600 dark:text-accent-400 p-0 h-auto font-medium">
                  <Link href="/signin" className="inline-flex items-center gap-1 hover:gap-2 transition-all duration-200">
                    <ArrowLeft className="w-3 h-3" />
                    Sign In
                  </Link>
                </Button>
              </p>
            </div>

            <p className="text-xs text-muted-foreground dark:text-slate-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              By signing up you agree to our Terms and Privacy Policy
            </p>
          </div>
        </Card>
      </motion.div>
    </main>
  )
}
