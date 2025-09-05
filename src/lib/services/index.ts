import { Task } from '@/types/task';

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data.tasks;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }

  async getTaskAnalytics(): Promise<any> {
    const response = await fetch('/api/tasks/analytics');
    if (!response.ok) {
      throw new Error('Failed to fetch task analytics');
    }
    return response.json();
  }
}

class CalendarService {
  async getEvents(start: Date, end: Date): Promise<any[]> {
    const response = await fetch(`/api/calendar/events?start=${start.toISOString()}&end=${end.toISOString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }
    const data = await response.json();
    return data.events;
  }

  async syncWithGoogleCalendar(): Promise<void> {
    const response = await fetch('/api/calendar/sync', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to sync with Google Calendar');
    }
  }
}

class StudyService {
  async getStudySessions(): Promise<any[]> {
    const response = await fetch('/api/study/sessions');
    if (!response.ok) {
      throw new Error('Failed to fetch study sessions');
    }
    const data = await response.json();
    return data.sessions;
  }

  async createStudySession(session: any): Promise<any> {
    const response = await fetch('/api/study/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    if (!response.ok) {
      throw new Error('Failed to create study session');
    }
    return response.json();
  }

  async getProgress(): Promise<any> {
    const response = await fetch('/api/study/progress');
    if (!response.ok) {
      throw new Error('Failed to fetch study progress');
    }
    return response.json();
  }
}

class ProfileService {
  async getProfile(): Promise<any> {
    const response = await fetch('/api/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  }

  async updateProfile(data: any): Promise<any> {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return response.json();
  }

  async updatePreferences(preferences: any): Promise<void> {
    const response = await fetch('/api/profile/preferences', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }
  }
}

class AIService {
  async getTaskInsights(taskId: string): Promise<any> {
    const response = await fetch(`/api/ai/insights/${taskId}`);
    if (!response.ok) {
      throw new Error('Failed to get task insights');
    }
    return response.json();
  }

  async parseNaturalLanguage(text: string): Promise<any> {
    const response = await fetch('/api/ai/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Failed to parse text');
    }
    return response.json();
  }
}

export const taskService = new TaskService();
export const calendarService = new CalendarService();
export const studyService = new StudyService();
export const profileService = new ProfileService();
export const aiService = new AIService();
