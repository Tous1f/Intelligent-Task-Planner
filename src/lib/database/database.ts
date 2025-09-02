import { supabase } from './supabaseClient';

// Task Operations
export const taskOperations = {
  async createTask(task: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: number;
    estimated_duration?: number;
    category?: string;
  }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        schedules (*)
      `)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: any) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// AI & Analytics Operations
export const aiOperations = {
  async logUserBehavior(behaviorData: {
    action_type: string;
    context_data: any;
    productivity_score?: number;
  }) {
    const { error } = await supabase
      .from('user_behavior')
      .insert([behaviorData]);
    
    if (error) throw error;
  },

  async getAIInsights() {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getUserProductivityStats() {
    const { data, error } = await supabase
      .rpc('get_user_productivity_stats', { user_uuid: (await supabase.auth.getUser()).data.user?.id });
    
    if (error) throw error;
    return data;
  }
};

// Study Session Operations
export const studyOperations = {
  async startPomodoroSession(taskId: string, plannedDuration: number = 25) {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert([{
        task_id: taskId,
        session_type: 'pomodoro',
        planned_duration: plannedDuration
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async completeSession(sessionId: string, actualDuration: number, rating?: number) {
    const { data, error } = await supabase
      .from('study_sessions')
      .update({
        actual_duration: actualDuration,
        productivity_rating: rating,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Flashcard Operations (SRS)
export const flashcardOperations = {
  async createFlashcard(flashcard: {
    deck_name: string;
    front_content: string;
    back_content: string;
  }) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([flashcard])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFlashcardsForReview(limit: number = 10) {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .lte('next_review', new Date().toISOString())
      .order('next_review')
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};
