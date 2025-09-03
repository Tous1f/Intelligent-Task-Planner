'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  BookOpen,
  Timer,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';
import GoogleCalendarIntegration from './GoogleCalendarIntegration';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  estimatedDuration?: number;
  subject?: string;
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  todayTasks: number;
  weeklyProductivity: number;
  studyStreak: number;
}

export default function EnhancedDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    todayTasks: 0,
    weeklyProductivity: 0,
    studyStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    initializeDashboard();
    setGreeting(getTimeBasedGreeting());
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      // Simulate API calls - replace with actual API calls
      await Promise.all([
        fetchTasks(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Dashboard initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    // Simulate API call
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete React Assignment',
        description: 'Build a todo app with React hooks',
        dueDate: '2025-09-06T18:00:00.000Z',
        priority: 5,
        status: 'IN_PROGRESS',
        estimatedDuration: 120,
        subject: 'Computer Science'
      },
      {
        id: '2',
        title: 'Study for Math Exam',
        description: 'Review chapters 5-8 for calculus exam',
        dueDate: '2025-09-08T09:00:00.000Z',
        priority: 4,
        status: 'TODO',
        estimatedDuration: 180,
        subject: 'Mathematics'
      },
      {
        id: '3',
        title: 'Write History Essay',
        description: 'World War II analysis paper',
        dueDate: '2025-09-10T23:59:00.000Z',
        priority: 3,
        status: 'TODO',
        estimatedDuration: 240,
        subject: 'History'
      }
    ];
    setTasks(mockTasks);
  };

  const fetchStats = async () => {
    // Simulate API call
    const mockStats: DashboardStats = {
      totalTasks: 15,
      completedTasks: 8,
      overdueTasks: 2,
      todayTasks: 3,
      weeklyProductivity: 78,
      studyStreak: 5
    };
    setStats(mockStats);
  };

  const getUrgentTasks = () => {
    const now = new Date();
    const urgent = tasks.filter(task => {
      if (!task.dueDate || task.status === 'COMPLETED') return false;
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      return daysDiff <= 2 && daysDiff >= 0;
    });
    return urgent.slice(0, 3);
  };

  const getCompletionRate = () => {
    return stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'lavender',
    trend,
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
    trend?: string;
    subtitle?: string;
  }) => (
    <motion.div
      className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-lavender-200/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-lavender-600 font-medium mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-lavender-900">{value}</span>
            {trend && (
              <span className="text-sm font-medium text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-lavender-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-2xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-lavender-200 border-t-lavender-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lavender-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-lavender-900 mb-2">
            {greeting}! 👋
          </h1>
          <p className="text-lavender-600 text-lg">
            Here's what's happening with your tasks today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={Target}
            color="blue"
            subtitle="Active tasks"
          />
          <StatCard
            title="Completed"
            value={`${getCompletionRate()}%`}
            icon={CheckCircle2}
            color="green"
            trend="+12%"
            subtitle={`${stats.completedTasks} tasks done`}
          />
          <StatCard
            title="Study Streak"
            value={`${stats.studyStreak} days`}
            icon={Timer}
            color="purple"
            subtitle="Keep it up!"
          />
          <StatCard
            title="Weekly Focus"
            value={`${stats.weeklyProductivity}%`}
            icon={BarChart3}
            color="orange"
            trend="+8%"
            subtitle="Productivity score"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Urgent Tasks */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-lavender-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-lavender-900">Urgent Tasks</h3>
                    <p className="text-lavender-600">Due within 2 days</p>
                  </div>
                </div>
                <motion.button
                  className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {getUrgentTasks().length === 0 ? (
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-lavender-700 mb-2">
                        No urgent tasks!
                      </h4>
                      <p className="text-lavender-500">
                        You're all caught up. Great job! 🎉
                      </p>
                    </motion.div>
                  ) : (
                    getUrgentTasks().map((task, index) => (
                      <motion.div
                        key={task.id}
                        className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {task.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {task.estimatedDuration} min
                              </span>
                              <span className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                {task.subject}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                task.priority >= 4 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {task.priority >= 4 ? 'High Priority' : 'Medium Priority'}
                              </span>
                            </div>
                            {task.dueDate && (
                              <p className="text-sm text-red-600 font-medium">
                                Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                          <motion.button
                            className="p-2 rounded-lg text-lavender-600 hover:text-lavender-700 hover:bg-lavender-100 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-lavender-100">
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-lavender-50 to-lavender-100 rounded-2xl text-lavender-700 font-medium hover:from-lavender-100 hover:to-lavender-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Timer className="w-5 h-5" />
                    <span>Start Pomodoro</span>
                  </motion.button>
                  <motion.button
                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl text-green-700 font-medium hover:from-green-100 hover:to-green-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>View Insights</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Google Calendar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GoogleCalendarIntegration />
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Weekly Progress */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-lavender-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-lavender-900">Weekly Progress</h3>
                <p className="text-lavender-600">Your productivity this week</p>
              </div>
            </div>

            <div className="space-y-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const progress = Math.random() * 100; // Mock data
                const isToday = index === new Date().getDay();
                return (
                  <div key={day} className="flex items-center space-x-4">
                    <span className={`w-8 text-sm font-medium ${
                      isToday ? 'text-lavender-700' : 'text-lavender-500'
                    }`}>
                      {day}
                    </span>
                    <div className="flex-1 bg-lavender-100 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          isToday 
                            ? 'bg-gradient-to-r from-lavender-500 to-lavender-600' 
                            : 'bg-gradient-to-r from-lavender-300 to-lavender-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="w-8 text-sm text-lavender-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Distribution */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-lavender-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-lavender-900">Study Focus</h3>
                <p className="text-lavender-600">Time spent by subject</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { subject: 'Computer Science', time: 12, color: 'blue' },
                { subject: 'Mathematics', time: 8, color: 'green' },
                { subject: 'Physics', time: 6, color: 'purple' },
                { subject: 'History', time: 4, color: 'orange' }
              ].map((item, index) => (
                <motion.div
                  key={item.subject}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                    <span className="text-lavender-700 font-medium">{item.subject}</span>
                  </div>
                  <span className="text-lavender-600 font-semibold">{item.time}h</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}