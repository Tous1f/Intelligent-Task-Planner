'use client';

import { motion } from 'framer-motion';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  BarChart,
} from 'lucide-react';

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  upcoming: number;
  overdue: number;
  completionRate: number;
}

interface TaskStatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  metric?: string;
  trend?: number;
}

function TaskStatCard({ title, value, icon: Icon, gradient, metric, trend }: TaskStatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <h3 className="text-2xl font-bold">{value}</h3>
            {metric && (
              <span className="text-sm text-gray-500">{metric}</span>
            )}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'transform rotate-180' : ''}`} />
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${gradient}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export function TaskStats({ stats }: { stats: TaskStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <TaskStatCard
        title="Total Tasks"
        value={stats.total}
        icon={BarChart}
        gradient="from-blue-500 to-indigo-600"
        trend={10}
      />
      
      <TaskStatCard
        title="Completed"
        value={stats.completed}
        icon={CheckSquare}
        gradient="from-green-500 to-emerald-600"
        metric={`${stats.completionRate}% rate`}
        trend={15}
      />
      
      <TaskStatCard
        title="In Progress"
        value={stats.inProgress}
        icon={Clock}
        gradient="from-yellow-500 to-orange-600"
      />
      
      <TaskStatCard
        title="Upcoming"
        value={stats.upcoming}
        icon={Calendar}
        gradient="from-purple-500 to-pink-600"
      />
      
      <TaskStatCard
        title="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
        gradient="from-red-500 to-pink-600"
        trend={-5}
      />
    </div>
  );
}
