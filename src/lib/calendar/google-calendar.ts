import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getCalendarClient() {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No access token available')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    access_token: session.accessToken as string
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function getUpcomingEvents(maxResults: number = 10) {
  try {
    const calendar = await getCalendarClient()
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })

    return response.data.items || []

  } catch (error) {
    console.error('Error fetching calendar events:', error)
    throw new Error('Failed to fetch calendar events')
  }
}
