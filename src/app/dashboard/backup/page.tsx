'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  PlusCircle, 
  Brain,
  Target, 
  CheckCircle,
  BarChart3,
  BookOpen,
  Timer,
  Settings,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  User,
  Clock
} from 'lucide-react';
import TaskCreationDialog from '@/components/tasks/TaskCreationDialog';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Metric from '@/components/ui/metric';
import EmptyState from '@/components/ui/emptyState';

interface DashboardStats {
  taskProgress: {
    total: number;
    completed: number;
    upcoming: number;
    overdue: number;
  };
  studyStats: {
    totalHours: number;
    weeklyTarget: number;
    weeklyProgress: number;
    streak: number;
  };
  focusTime: number;
  efficiency: number;
  studyHours: number;
  studyStreak: number;
  weeklyProgress: {
    current: number;
    target: number;
  };
  aiInsights: Array<{
    id: string;
    insightType: string;
    title: string;
    description: string;
    confidenceLevel: number;
    insightData: {
      progress?: number;
      recommendations?: string[];
      [key: string]: any;
    };
  }>;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [greeting, setGreeting] = useState('');

  const fetchDashboardData = async () => {
    try {
      // Simulate API call
      const mockData: DashboardStats = {
        taskProgress: { total: 10, completed: 7, upcoming: 2, overdue: 1 },
        studyStats: {
          totalHours: 120,
          weeklyTarget: 20,
          weeklyProgress: 15,
          streak: 5
        },
        focusTime: 180,
        efficiency: 85,
        studyHours: 12,
        studyStreak: 5,
        weeklyProgress: {
          current: 15,
          target: 20
        },
        aiInsights: []
      };
      setStats(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent-50/20 to-background dark:from-background dark:via-accent-950/10 dark:to-background flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12 text-accent-600 dark:text-accent-400" />
      </div>
    );
  }

  const quickStatsData = [
    { 
      icon: CheckCircle, 
      label: 'Tasks Completed', 
      value: stats.taskProgress.completed.toString(),
      subtext: `${Math.round((stats.taskProgress.completed / stats.taskProgress.total) * 100)}% completion rate`,
      color: 'from-emerald-500 to-green-500'
    },
    { 
      icon: Clock, 
      label: 'Focus Time', 
      value: `${Math.floor(stats.focusTime / 60)}h ${stats.focusTime % 60}m`,
      subtext: `${stats.efficiency}% efficiency rate`,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Brain, 
      label: 'Study Hours', 
      value: `${stats.studyHours}h`,
      subtext: `${stats.studyStreak} day streak`,
      color: 'from-violet-500 to-purple-500'
    },
    { 
      icon: Target, 
      label: 'Weekly Goal', 
      value: `${Math.round((stats.weeklyProgress.current / stats.weeklyProgress.target) * 100)}%`,
      subtext: `${stats.weeklyProgress.current}/${stats.weeklyProgress.target} hours`,
      color: 'from-rose-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-50/40 via-background to-background dark:from-accent-900/20 dark:via-background dark:to-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-[0.02]" />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center">
                <User className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                  {greeting}, {session?.user?.name?.split(' ')[0] || 'there'}
                </h1>
                <p className="text-muted-foreground dark:text-slate-400">
                  Here's an overview of your productivity
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <TaskCreationDialog
                trigger={
                  <Button variant="accent" size="sm" className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    New Task
                  </Button>
                }
                onTaskCreated={() => {
                  // Refresh tasks list
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {quickStatsData.map((stat, index) => (
            <motion.div key={stat.label} variants={cardVariants}>
              <Card className="p-6 backdrop-blur-[20px] bg-white/50 dark:bg-slate-950/50 border-white/20 dark:border-white/10 overflow-hidden relative group hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br opacity-[0.08] group-hover:opacity-[0.11] transition-opacity duration-200" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-foreground dark:text-slate-200">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                    {stat.subtext}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Task Overview</h2>
                <div className="space-y-4">
                  <Progress value={75} />
                  <div className="grid grid-cols-2 gap-4">
                    <Metric title="Completed" value={stats.taskProgress.completed} />
                    <Metric title="Remaining" value={stats.taskProgress.upcoming} />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Study Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Study Progress</h2>
                <div className="space-y-4">
                  <Progress value={65} />
                  <div className="grid grid-cols-2 gap-4">
                    <Metric title="Hours Today" value={stats.studyStats.totalHours} />
                    <Metric title="Weekly Target" value={stats.studyStats.weeklyTarget} />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">AI Insights</h2>
                {stats.aiInsights.length === 0 ? (
                  <EmptyState
                    icon={<Lightbulb />}
                    title="No insights yet"
                    description="Complete more tasks to get personalized insights"
                  />
                ) : (
                  <div className="space-y-4">
                    {stats.aiInsights.map((insight) => (
                      <div key={insight.id} className="p-4 rounded-lg bg-accent-50 dark:bg-accent-950">
                        <p className="font-medium">{insight.title}</p>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Study Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Timer className="w-4 h-4 mr-2" />
                    Begin Focus Time
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Weekly Goals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Weekly Goals</h2>
                <div className="space-y-4">
                  <Progress value={60} />
                  <p className="text-sm text-muted-foreground">12/20 hours completed</p>
                </div>
              </Card>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Alerts</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-yellow-500">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-sm">2 tasks due today</p>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    <p className="text-sm">Productivity up by 15%</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Focus Sessions', value: '12', change: '+2' },
            { label: 'Study Hours', value: '24', change: '+5' },
            { label: 'Tasks Completed', value: '45', change: '+8' },
            { label: 'Streak', value: '7 days', change: '+1' }
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-emerald-500">{stat.change} this week</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
