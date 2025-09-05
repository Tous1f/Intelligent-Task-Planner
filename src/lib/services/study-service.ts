import { StudySessionUI } from '@/types/study';

interface StudyStats {
  totalStudyTime: number; // in minutes
  averageDailyStudyTime: number; // in minutes
  studyStreak: number; // in days
  completionRate: number; // percentage
  subjectBreakdown: {
    subject: string;
    timeSpent: number; // in minutes
  }[];
}

const API_BASE_URL = '/api';

export const studyService = {
  async startSession(): Promise<StudySessionUI> {
    const response = await fetch(`${API_BASE_URL}/study/session/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Failed to start study session');
    }
    return response.json();
  },

  async endSession(sessionId: string, duration: number): Promise<StudySessionUI> {
    const response = await fetch(`${API_BASE_URL}/study/session/${sessionId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ duration })
    });
    if (!response.ok) {
      throw new Error('Failed to end study session');
    }
    return response.json();
  },

  async getStats(): Promise<StudyStats> {
    const response = await fetch(`${API_BASE_URL}/study/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch study stats');
    }
    return response.json();
  },

  async getRecentSessions(): Promise<StudySessionUI[]> {
    const response = await fetch(`${API_BASE_URL}/study/sessions/recent`);
    if (!response.ok) {
      throw new Error('Failed to fetch recent study sessions');
    }
    return response.json();
  }
};
