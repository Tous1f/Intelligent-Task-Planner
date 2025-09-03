'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [recentTasks, setRecentTasks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard data for authenticated users
  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [tasksRes, insightsRes] = await Promise.all([
        fetch('/api/tasks?limit=5'),
        fetch('/api/ai/insights')
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setRecentTasks(tasksData.tasks || []);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData.insights || []);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAIParsing = async () => {
    try {
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Study calculus for 2 hours tomorrow at 3pm' })
      });
      
      const data = await response.json();
      alert(`AI Parsing Result:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-lavender-700 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show landing page
  if (!session) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-lavender-50 to-lavender-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-lavender-900 mb-6">
                🎯 Intelligent Task Planner
              </h1>
              <p className="text-xl md:text-2xl text-lavender-700 mb-8 leading-relaxed">
                AI-powered task planning designed specifically for university students.
                <br />
                <span className="text-lavender-600">Smart scheduling • Productivity insights • Seamless integration</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/auth/signin"
                  className="bg-lavender-500 hover:bg-lavender-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Get Started Free 🚀
                </Link>
                <Link 
                  href="/features"
                  className="border-2 border-lavender-300 text-lavender-700 hover:bg-lavender-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  Explore Features
                </Link>
              </div>

              <div className="mt-12 text-sm text-lavender-600">
                ✨ No credit card required • ⚡ Setup in under 2 minutes • 🎓 Built for students
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center text-lavender-900 mb-12">
              Why Students Choose Our Task Planner
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-xl bg-lavender-50 hover:bg-lavender-100 transition-colors">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-lavender-900 mb-3">AI Task Creation</h3>
                <p className="text-lavender-700">
                  Just describe what you need to do in plain English. Our AI understands and creates structured tasks automatically.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-sage-50 hover:bg-sage-100 transition-colors">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-lavender-900 mb-3">Smart Scheduling</h3>
                <p className="text-lavender-700">
                  AI-powered scheduling that considers your calendar, deadlines, and productivity patterns.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-coral-50 hover:bg-coral-100 transition-colors">
                <div className="text-4xl mb-4">🍅</div>
                <h3 className="text-xl font-semibold text-lavender-900 mb-3">Pomodoro Timer</h3>
                <p className="text-lavender-700">
                  Built-in focus timer with productivity tracking and session analytics to optimize your study habits.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-cream-50 hover:bg-cream-100 transition-colors">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-lavender-900 mb-3">AI Insights</h3>
                <p className="text-lavender-700">
                  Personalized productivity recommendations and workload predictions based on your behavior patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-lavender-500 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-6">
              Ready to Transform Your Study Routine? 
            </h2>
            <p className="text-lavender-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who've improved their productivity with AI-powered task planning.
            </p>
            <Link 
              href="/auth/signin"
              className="bg-white text-lavender-600 hover:bg-lavender-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Start Planning Smarter Today 🎯
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated user - show dashboard
  return (
    <div className="min-h-screen bg-lavender-50">
      {/* Dashboard Header */}
      <section className="bg-white border-b border-lavender-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-lavender-900">
                Welcome back, {session.user?.name?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="text-lavender-600 mt-2">
                Let's make today productive. Here's your overview:
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link 
                href="/tasks/new"
                className="bg-lavender-500 hover:bg-lavender-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + New Task
              </Link>
              <button
                onClick={testAIParsing}
                className="border border-lavender-300 hover:bg-lavender-50 text-lavender-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🤖 Test AI
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-lavender-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-lavender-900">Recent Tasks</h2>
                <Link href="/tasks" className="text-lavender-500 hover:text-lavender-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-lavender-50 rounded-lg">
                      <div className="w-4 h-4 bg-lavender-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-lavender-200 rounded w-3/4"></div>
                        <div className="h-3 bg-lavender-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentTasks.length > 0 ? (
                <div className="space-y-3">
                  {recentTasks.map((task: any) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 border border-lavender-100 rounded-lg hover:bg-lavender-50 transition-colors">
                      <div className={`w-4 h-4 rounded border-2 ${task.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-lavender-300'}`}></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lavender-900">{task.title}</h3>
                        <p className="text-sm text-lavender-600">
                          {task.subject && <span className="font-medium">{task.subject}</span>}
                          {task.dueDate && <span> • Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                          {task.priority >= 4 && <span className="text-red-600"> • High Priority</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-lavender-600">
                  <div className="text-4xl mb-4">📋</div>
                  <p>No tasks yet. Create your first task to get started!</p>
                  <Link href="/tasks/new" className="text-lavender-500 hover:text-lavender-700 font-medium mt-2 inline-block">
                    Create Task →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/tasks/new" className="bg-white p-6 rounded-xl shadow-sm border border-lavender-200 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">➕</div>
                <div className="font-medium text-lavender-900">New Task</div>
              </Link>
              
              <Link href="/pomodoro" className="bg-white p-6 rounded-xl shadow-sm border border-lavender-200 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">🍅</div>
                <div className="font-medium text-lavender-900">Pomodoro</div>
              </Link>
              
              <Link href="/schedule" className="bg-white p-6 rounded-xl shadow-sm border border-lavender-200 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">📅</div>
                <div className="font-medium text-lavender-900">Schedule</div>
              </Link>
              
              <Link href="/insights" className="bg-white p-6 rounded-xl shadow-sm border border-lavender-200 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium text-lavender-900">Insights</div>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-lavender-200 p-6">
              <h2 className="text-lg font-semibold text-lavender-900 mb-4">🤖 AI Insights</h2>
              
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-4 bg-lavender-200 rounded w-3/4"></div>
                      <div className="h-3 bg-lavender-100 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.slice(0, 3).map((insight: any, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      insight.priority === 'high' ? 'bg-red-50 border-red-400' :
                      insight.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-green-50 border-green-400'
                    }`}>
                      <p className="text-sm text-lavender-800">{insight.message}</p>
                      {insight.actionable && (
                        <div className="mt-2">
                          <span className="text-xs bg-lavender-100 text-lavender-700 px-2 py-1 rounded">
                            Action Required
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lavender-600 text-sm">
                  Complete a few tasks to get personalized insights!
                </p>
              )}
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-lavender-200 p-6">
              <h2 className="text-lg font-semibold text-lavender-900 mb-4">📈 This Week</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lavender-700">Tasks Completed</span>
                  <span className="font-semibold text-lavender-900">
                    {recentTasks.filter(t => t.status === 'COMPLETED').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lavender-700">Study Sessions</span>
                  <span className="font-semibold text-lavender-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lavender-700">Focus Time</span>
                  <span className="font-semibold text-lavender-900">0h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}