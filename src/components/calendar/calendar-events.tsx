'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export function CalendarEvents() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    if (!session) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/calendar/events')
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
      } else {
        setError(data.error || 'Failed to fetch events')
      }
    } catch (err) {
      setError('Network error fetching events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="text-center p-8">
        <div className="animate-spin text-4xl">🔄</div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">🔐 Authentication Required</h2>
        <p className="text-gray-600 mb-6">
          Please sign in with Google to access your calendar and start planning tasks with AI.
        </p>
        <button
          onClick={() => signIn('google')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          🚀 Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {session.user?.name}!</h2>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Sign Out
          </button>
        </div>
        
        <div className="border-t pt-4">
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition duration-200"
          >
            {loading ? '🔄 Loading...' : '📅 Fetch Calendar Events'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {events.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">📅 Upcoming Events</h3>
          <div className="space-y-3">
            {events.map((event: any, index) => (
              <div key={event.id || index} className="border rounded-lg p-4">
                <h4 className="font-semibold">{event.summary || 'Untitled Event'}</h4>
                <p className="text-sm text-gray-600">
                  🕒 {event.start?.dateTime 
                    ? new Date(event.start.dateTime).toLocaleString()
                    : event.start?.date}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-600">📍 {event.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
