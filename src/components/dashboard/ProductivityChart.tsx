'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductivityData {
  date: string;
  tasksCompleted: number;
  productivity: number;
}

interface ProductivityMetrics {
  dailyData: ProductivityData[];
  totalTasksCompleted: number;
  averageProductivity: number;
  streak: number;
}

export function ProductivityChart({ metrics }: { metrics: ProductivityMetrics }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Productivity Overview</h3>
          <p className="text-sm text-gray-500">Track your daily progress</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Tasks Done</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.totalTasksCompleted}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Avg. Score</p>
            <p className="text-2xl font-bold text-indigo-600">
              {metrics.averageProductivity.toFixed(1)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Streak</p>
            <p className="text-2xl font-bold text-green-600">{metrics.streak}</p>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={metrics.dailyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="productivity"
              stroke="url(#colorGradient)"
              strokeWidth={2}
              dot={{ stroke: '#6366F1', strokeWidth: 2, r: 4, fill: '#fff' }}
              activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
