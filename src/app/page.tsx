'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎯 Intelligent Task Planner
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered task planning for university students with Google Calendar integration
          </p>
          <Link 
            href="/auth/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  // User is authenticated - show dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🎯 Intelligent Task Planner Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {session.user?.name || session.user?.email}!
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-6 bg-green-100 border border-green-300 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ Authentication Success!</h3>
          <p className="text-green-700 text-sm">
            Your Google OAuth integration is working perfectly. No more redirect loops!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🤖 AI Task Creation</h2>
            <p className="text-gray-600 mb-4">
              Create tasks using natural language processing
            </p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => {
                fetch('/api/ai/parse', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: 'Study calculus for 2 hours tomorrow' })
                })
                .then(res => res.json())
                .then(data => alert(JSON.stringify(data, null, 2)));
              }}
            >
              Test AI Parsing
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📅 Smart Scheduling</h2>
            <p className="text-gray-600 mb-4">
              AI-powered task scheduling with conflict detection
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              View Schedule
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🍅 Pomodoro Timer</h2>
            <p className="text-gray-600 mb-4">
              Productivity tracking with study sessions
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
              Start Session
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📊 AI Insights</h2>
            <p className="text-gray-600 mb-4">
              Personalized productivity recommendations
            </p>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
              onClick={() => {
                fetch('/api/ai/insights')
                .then(res => res.json())
                .then(data => alert(JSON.stringify(data, null, 2)));
              }}
            >
              Generate Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
