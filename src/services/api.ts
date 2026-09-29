import {
  Exercise,
  Workout,
  CompletedWorkout,
  UserProfile,
  CustomWorkout,
  ProgressSummary,
  AICoachMessage,
  FitnessLevel,
  BodyArea,
  EquipmentType,
  TrainingStyle,
  IntensityLevel
} from '../types/index.js';

const TOKEN_KEY = 'spotfit_auth_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Network error occurred.' }));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }

    return res.json();
  },

  // Auth
  async login(email: string, password: string) {
    const res = await this.request<{ user: UserProfile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.token);
    return res;
  },

  async register(email: string, password: string, name: string, fitnessLevel?: FitnessLevel) {
    const res = await this.request<{ user: UserProfile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, fitnessLevel })
    });
    this.setToken(res.token);
    return res;
  },

  async getMe() {
    return this.request<{ user: UserProfile; token: string }>('/auth/me');
  },

  async updateProfile(updates: Partial<UserProfile>) {
    return this.request<{ user: UserProfile }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  // Exercises
  async getExercises(filters?: { bodyArea?: string; difficulty?: string; equipment?: string; search?: string }) {
    const query = new URLSearchParams();
    if (filters?.bodyArea) query.set('bodyArea', filters.bodyArea);
    if (filters?.difficulty) query.set('difficulty', filters.difficulty);
    if (filters?.equipment) query.set('equipment', filters.equipment);
    if (filters?.search) query.set('search', filters.search);
    return this.request<Exercise[]>(`/exercises?${query.toString()}`);
  },

  async getExercise(id: string) {
    return this.request<Exercise>(`/exercises/${id}`);
  },

  // Workouts
  async getWorkouts(filters?: { bodyArea?: string; difficulty?: string; equipment?: string; duration?: string }) {
    const query = new URLSearchParams();
    if (filters?.bodyArea) query.set('bodyArea', filters.bodyArea);
    if (filters?.difficulty) query.set('difficulty', filters.difficulty);
    if (filters?.equipment) query.set('equipment', filters.equipment);
    if (filters?.duration) query.set('duration', filters.duration);
    return this.request<Workout[]>(`/workouts?${query.toString()}`);
  },

  async getWorkout(id: string) {
    return this.request<Workout>(`/workouts/${id}`);
  },

  async generateWorkout(params: {
    bodyArea: BodyArea;
    difficulty: FitnessLevel;
    durationMinutes: number;
    equipment: EquipmentType;
    trainingStyle: TrainingStyle;
    intensity: IntensityLevel;
  }) {
    return this.request<Workout>('/workouts/generate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Completion & Progress
  async completeWorkout(workoutLog: Partial<CompletedWorkout>) {
    return this.request<{
      completedWorkout: CompletedWorkout;
      newAchievements: any[];
      streak: { current: number; longest: number };
    }>('/workouts/complete', {
      method: 'POST',
      body: JSON.stringify(workoutLog)
    });
  },

  async getHistory() {
    return this.request<CompletedWorkout[]>('/history');
  },

  async getProgress() {
    return this.request<ProgressSummary>('/progress');
  },

  // Favorites
  async getFavorites() {
    return this.request<{ favoriteExercises: Exercise[]; favoriteWorkouts: Workout[] }>('/favorites');
  },

  async toggleFavoriteExercise(exerciseId: string) {
    return this.request<{ exerciseId: string; isFavorited: boolean }>(`/favorites/exercise/${exerciseId}`, {
      method: 'POST'
    });
  },

  async toggleFavoriteWorkout(workoutId: string) {
    return this.request<{ workoutId: string; isFavorited: boolean }>(`/favorites/workout/${workoutId}`, {
      method: 'POST'
    });
  },

  // Custom Workouts
  async getCustomWorkouts() {
    return this.request<CustomWorkout[]>('/custom-workouts');
  },

  async createCustomWorkout(workout: Omit<CustomWorkout, 'id' | 'userId' | 'createdAt'>) {
    return this.request<CustomWorkout>('/custom-workouts', {
      method: 'POST',
      body: JSON.stringify(workout)
    });
  },

  async updateCustomWorkout(id: string, updates: Partial<CustomWorkout>) {
    return this.request<CustomWorkout>(`/custom-workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteCustomWorkout(id: string) {
    return this.request<{ success: boolean }>(`/custom-workouts/${id}`, {
      method: 'DELETE'
    });
  },

  // AI Coach
  async askAICoach(query: string, context?: any) {
    return this.request<{
      answer: string;
      recommendedWorkout?: Workout;
      recommendedExercises?: Exercise[];
      safetyTips?: string[];
    }>('/ai/coach', {
      method: 'POST',
      body: JSON.stringify({ query, context })
    });
  },

  // Admin
  async createAdminExercise(exerciseData: any) {
    return this.request<Exercise>('/admin/exercises', {
      method: 'POST',
      body: JSON.stringify(exerciseData)
    });
  },

  async updateAdminExercise(id: string, exerciseData: any) {
    return this.request<Exercise>(`/admin/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exerciseData)
    });
  },

  async deleteAdminExercise(id: string) {
    return this.request<{ success: boolean }>(`/admin/exercises/${id}`, {
      method: 'DELETE'
    });
  }
};
