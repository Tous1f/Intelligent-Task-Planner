// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Calendar, Clock, Target, Brain, Zap, 
  TrendingUp, CheckCircle, AlertTriangle, Timer,
  Play, Pause, RotateCcw, BookOpen, Star
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import QuickTaskCreator from '@/components/dashboard/QuickTaskCreator'
import PomodoroTimer from '@/components/dashboard/PomodoroTimer'
import UpcomingTasks from '@/components/dashboard/UpcomingTasks'
import ProductivityStats from '@/components/dashboard/ProductivityStats'
import GoogleCalendarIntegration from '@/components/ui/GoogleCalendarIntegration'
import SpacedRepetition from '@/components/dashboard/SpacedRepetition'

interface Task {
  id: string
  title: string
  dueDate?: string
  priority: number
  status: string
  estimatedDuration?: number
  subject?: string
  taskType: string
}

interface Stats {
  focusedToday: number
  tasksCompleted: number
  upcomingDeadlines: number
  pomodoroStreak: number
  weeklyProductivity: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<Stats>({
    focusedToday: 0,
    tasksCompleted: 0,
    upcomingDeadlines: 0,
    pomodoroStreak: 0,
    weeklyProductivity: 0
  })
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    fetchTasks()
    fetchStats()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks?limit=5')
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/ai/insights')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev.slice(0, 4)])
    setStats(prev => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {greeting}, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Ready to conquer your day with intelligent planning?
              </p>
            </div>
            <motion.div
              className="hidden md:flex items-center space-x-2 bg-white/60 backdrop-blur-lg rounded-2xl px-4 py-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">All systems operational</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: Clock, label: 'Focused Today', value: `${Math.floor(stats.focusedToday / 60)}h ${stats.focusedToday % 60}m`, color: 'from-blue-500 to-cyan-500' },
            { icon: CheckCircle, label: 'Completed', value: stats.tasksCompleted.toString(), color: 'from-green-500 to-emerald-500' },
            { icon: AlertTriangle, label: 'Due Soon', value: stats.upcomingDeadlines.toString(), color: 'from-orange-500 to-red-500' },
            { icon: Zap, label: 'Streak', value: `${stats.pomodoroStreak} days`, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-white/50"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Task Creator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuickTaskCreator onTaskCreated={handleTaskCreated} />
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UpcomingTasks tasks={tasks} />
            </motion.div>

            {/* Calendar Integration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GoogleCalendarIntegration />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Pomodoro Timer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PomodoroTimer />
            </motion.div>

            {/* Spaced Repetition */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SpacedRepetition />
            </motion.div>

            {/* Productivity Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ProductivityStats stats={stats} />
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Plus, label: 'New Task', href: '/dashboard/tasks/new', color: 'from-purple-500 to-pink-500' },
              { icon: Calendar, label: 'View Calendar', href: '/dashboard/calendar', color: 'from-blue-500 to-cyan-500' },
              { icon: Target, label: 'Goals', href: '/dashboard/goals', color: 'from-green-500 to-emerald-500' },
              { icon: Brain, label: 'Study Cards', href: '/dashboard/flashcards', color: 'from-orange-500 to-red-500' },
              { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics', color: 'from-indigo-500 to-purple-500' }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={action.href}
                  className={`inline-flex items-center space-x-3 bg-gradient-to-r ${action.color} text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <action.icon className="w-5 h-5" />
                  <span>{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}