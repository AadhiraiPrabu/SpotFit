export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type BodyArea =
  | 'abs'
  | 'upper_abs'
  | 'lower_abs'
  | 'obliques'
  | 'waist_core'
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'biceps'
  | 'triceps'
  | 'glutes'
  | 'hips'
  | 'thighs'
  | 'hamstrings'
  | 'calves'
  | 'full_body'
  | 'mobility'
  | 'posture';

export type EquipmentType =
  | 'none'
  | 'dumbbells'
  | 'resistance_band'
  | 'kettlebell'
  | 'pullup_bar'
  | 'bench'
  | 'gym_equipment';

export type TrainingStyle =
  | 'strength'
  | 'endurance'
  | 'mobility'
  | 'stability'
  | 'hiit'
  | 'low_impact'
  | 'stretching'
  | 'mixed';

export type IntensityLevel = 'easy' | 'moderate' | 'challenging';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  description: string;
  instructions: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  bodyArea: BodyArea;
  difficulty: FitnessLevel;
  equipment: EquipmentType;
  exerciseType: 'time' | 'reps';
  duration?: number; // seconds if timed
  defaultSets: number;
  defaultReps: number;
  defaultRest: number; // seconds
  calorieEstimate: number; // estimated kcal per minute
  safetyNotes: string[];
  contraindications?: string[];
  commonMistakes: string[];
  beginnerModification: string;
  progression: string;
  videoUrl?: string;
  imageUrl?: string;
  animationKey?: string;
  tags: string[];
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  sets: number;
  reps: number;
  durationSeconds?: number;
  restSeconds: number;
  order: number;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  bodyArea: BodyArea;
  secondaryAreas: BodyArea[];
  difficulty: FitnessLevel;
  durationMinutes: number;
  equipment: EquipmentType[];
  trainingStyle: TrainingStyle;
  intensity: IntensityLevel;
  tags: string[];
  warmup?: string[];
  cooldown?: string[];
  exercises: WorkoutExerciseItem[];
  isCustom?: boolean;
  userId?: string;
  createdAt?: string;
}

export interface CompletedExerciseLog {
  exerciseId: string;
  exerciseName: string;
  setsCompleted: number;
  repsCompleted: number;
  durationSeconds: number;
}

export interface CompletedWorkout {
  id: string;
  userId: string;
  workoutId: string;
  workoutTitle: string;
  bodyArea: BodyArea;
  secondaryAreas?: BodyArea[];
  durationSeconds: number;
  totalSets: number;
  totalReps: number;
  caloriesBurned: number;
  completedExercises: CompletedExerciseLog[];
  completedAt: string; // ISO date
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  fitnessLevel: FitnessLevel;
  preferredDuration: number;
  preferredEquipment: EquipmentType[];
  favoriteSpots: BodyArea[];
  weeklyGoal: number; // e.g. 3, 4, 5 workouts per week
  soundEnabled: boolean;
  restTimerSound: boolean;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  requirementType: 'workouts_count' | 'streak_days' | 'exercises_count' | 'custom_workout' | 'variety';
  threshold: number;
  unlockedAt?: string;
}

export interface CustomWorkout {
  id: string;
  userId: string;
  title: string;
  description: string;
  bodyArea: BodyArea;
  difficulty: FitnessLevel;
  equipment: EquipmentType[];
  exercises: WorkoutExerciseItem[];
  createdAt: string;
}

export interface ProgressSummary {
  workoutsCompleted: number;
  totalWorkoutMinutes: number;
  currentStreak: number;
  longestStreak: number;
  exercisesCompleted: number;
  setsCompleted: number;
  repsCompleted: number;
  bodyAreaDistribution: { area: BodyArea; count: number; percentage: number }[];
  weeklyActivity: { day: string; date: string; minutes: number; count: number }[];
  recentWorkouts: CompletedWorkout[];
  achievements: Achievement[];
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedWorkout?: Workout;
}
