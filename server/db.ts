import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  Exercise,
  Workout,
  CompletedWorkout,
  UserProfile,
  Achievement,
  CustomWorkout,
  ProgressSummary,
  BodyArea,
  FitnessLevel,
  EquipmentType,
  TrainingStyle,
  IntensityLevel
} from '../src/types/index.js';
import { allExercises } from './data/all-exercises.js';
import { initialWorkouts } from './data/workouts.js';
import { initialAchievements } from './data/achievements.js';

interface UserRecord extends UserProfile {
  passwordHash: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  exercises: Exercise[];
  workouts: Workout[];
  completedWorkouts: CompletedWorkout[];
  achievements: Achievement[];
  userAchievements: { userId: string; achievementId: string; unlockedAt: string }[];
  favoriteExercises: { userId: string; exerciseId: string; createdAt: string }[];
  favoriteWorkouts: { userId: string; workoutId: string; createdAt: string }[];
  customWorkouts: CustomWorkout[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'spotfit-db.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    this.ensureDirectory();

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent) as DatabaseSchema;
        // Ensure exercise library is always up to date with full library
        if (parsed.exercises && parsed.exercises.length < allExercises.length) {
          parsed.exercises = allExercises;
        }
        return parsed;
      } catch (err) {
        console.error('Error reading spotfit-db.json, re-initializing database:', err);
      }
    }

    const initial = this.seedDatabase();
    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(state: DatabaseSchema = this.data) {
    try {
      this.ensureDirectory();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private seedDatabase(): DatabaseSchema {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('password123', salt);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);

    const demoUser: UserRecord = {
      id: 'usr-demo-001',
      email: 'demo@spotfit.app',
      name: 'Alex Taylor',
      role: 'user',
      fitnessLevel: 'intermediate',
      preferredDuration: 15,
      preferredEquipment: ['none', 'dumbbells'],
      favoriteSpots: ['abs', 'chest', 'glutes'],
      weeklyGoal: 4,
      soundEnabled: true,
      restTimerSound: true,
      notificationsEnabled: true,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      passwordHash: demoPasswordHash
    };

    const adminUser: UserRecord = {
      id: 'usr-admin-001',
      email: 'admin@spotfit.app',
      name: 'Coach Admin',
      role: 'admin',
      fitnessLevel: 'advanced',
      preferredDuration: 30,
      preferredEquipment: ['none', 'dumbbells', 'resistance_band', 'gym_equipment'],
      favoriteSpots: ['full_body', 'chest', 'back'],
      weeklyGoal: 5,
      soundEnabled: true,
      restTimerSound: true,
      notificationsEnabled: true,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      passwordHash: adminPasswordHash
    };

    // Pre-populate some completed workouts for demoUser to show real progress & streaks
    const sampleCompleted: CompletedWorkout[] = [
      {
        id: 'comp-001',
        userId: demoUser.id,
        workoutId: 'wo-core-15m-solid',
        workoutTitle: 'Bulletproof Core Foundation',
        bodyArea: 'abs',
        durationSeconds: 920,
        totalSets: 14,
        totalReps: 160,
        caloriesBurned: 75,
        completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        completedExercises: [
          { exerciseId: 'ex-core-deadbug', exerciseName: 'Dead Bug', setsCompleted: 3, repsCompleted: 36, durationSeconds: 150 },
          { exerciseId: 'ex-core-plank', exerciseName: 'Standard Forearm Plank', setsCompleted: 3, repsCompleted: 3, durationSeconds: 105 },
          { exerciseId: 'ex-core-sideplank', exerciseName: 'Side Plank', setsCompleted: 2, repsCompleted: 2, durationSeconds: 60 }
        ]
      },
      {
        id: 'comp-002',
        userId: demoUser.id,
        workoutId: 'wo-chest-15m-builder',
        workoutTitle: 'Upper Chest & Triceps Architect',
        bodyArea: 'chest',
        durationSeconds: 880,
        totalSets: 11,
        totalReps: 120,
        caloriesBurned: 85,
        completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        completedExercises: [
          { exerciseId: 'ex-chest-pushup', exerciseName: 'Standard Push-Up', setsCompleted: 3, repsCompleted: 36, durationSeconds: 120 },
          { exerciseId: 'ex-chest-diamondpushup', exerciseName: 'Diamond Push-Up', setsCompleted: 2, repsCompleted: 16, durationSeconds: 80 }
        ]
      },
      {
        id: 'comp-003',
        userId: demoUser.id,
        workoutId: 'wo-quick-5min-glutes',
        workoutTitle: '5-Minute Glute Awakening',
        bodyArea: 'glutes',
        durationSeconds: 320,
        totalSets: 4,
        totalReps: 64,
        caloriesBurned: 35,
        completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        completedExercises: [
          { exerciseId: 'ex-glutes-bridge', exerciseName: 'Glute Bridge', setsCompleted: 1, repsCompleted: 15, durationSeconds: 45 },
          { exerciseId: 'ex-glutes-donkeykick', exerciseName: 'Quadruped Donkey Kick', setsCompleted: 1, repsCompleted: 12, durationSeconds: 40 }
        ]
      }
    ];

    const sampleUserAchievements = [
      { userId: demoUser.id, achievementId: 'ach-first-workout', unlockedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
      { userId: demoUser.id, achievementId: 'ach-variety-10', unlockedAt: new Date(Date.now() - 1 * 86400000).toISOString() }
    ];

    const sampleFavExercises = [
      { userId: demoUser.id, exerciseId: 'ex-core-plank', createdAt: new Date().toISOString() },
      { userId: demoUser.id, exerciseId: 'ex-chest-pushup', createdAt: new Date().toISOString() },
      { userId: demoUser.id, exerciseId: 'ex-glutes-bridge', createdAt: new Date().toISOString() }
    ];

    const sampleFavWorkouts = [
      { userId: demoUser.id, workoutId: 'wo-core-15m-solid', createdAt: new Date().toISOString() },
      { userId: demoUser.id, workoutId: 'wo-quick-5min-abs', createdAt: new Date().toISOString() }
    ];

    return {
      users: [demoUser, adminUser],
      exercises: allExercises,
      workouts: initialWorkouts,
      completedWorkouts: sampleCompleted,
      achievements: initialAchievements,
      userAchievements: sampleUserAchievements,
      favoriteExercises: sampleFavExercises,
      favoriteWorkouts: sampleFavWorkouts,
      customWorkouts: []
    };
  }

  // --- User Operations ---
  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(email: string, passwordPlain: string, name: string, fitnessLevel: FitnessLevel = 'beginner'): UserRecord {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordPlain, salt);
    const newUser: UserRecord = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: email.toLowerCase(),
      name: name || 'Athlete',
      role: 'user',
      fitnessLevel,
      preferredDuration: 15,
      preferredEquipment: ['none'],
      favoriteSpots: ['abs'],
      weeklyGoal: 3,
      soundEnabled: true,
      restTimerSound: true,
      notificationsEnabled: true,
      createdAt: new Date().toISOString(),
      passwordHash
    };

    this.data.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  public updateUserProfile(id: string, updates: Partial<UserProfile>): UserRecord | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;

    Object.assign(user, {
      name: updates.name ?? user.name,
      fitnessLevel: updates.fitnessLevel ?? user.fitnessLevel,
      preferredDuration: updates.preferredDuration ?? user.preferredDuration,
      preferredEquipment: updates.preferredEquipment ?? user.preferredEquipment,
      favoriteSpots: updates.favoriteSpots ?? user.favoriteSpots,
      weeklyGoal: updates.weeklyGoal ?? user.weeklyGoal,
      soundEnabled: updates.soundEnabled ?? user.soundEnabled,
      restTimerSound: updates.restTimerSound ?? user.restTimerSound,
      notificationsEnabled: updates.notificationsEnabled ?? user.notificationsEnabled
    });

    this.saveDatabase();
    return user;
  }

  // --- Exercises Operations ---
  public getExercises(filters?: {
    bodyArea?: string;
    difficulty?: string;
    equipment?: string;
    search?: string;
  }): Exercise[] {
    let list = this.data.exercises;

    if (filters?.bodyArea && filters.bodyArea !== 'all') {
      const area = filters.bodyArea.toLowerCase();
      list = list.filter(
        (ex) =>
          ex.bodyArea.toLowerCase() === area ||
          (area === 'abs' && (ex.bodyArea === 'upper_abs' || ex.bodyArea === 'lower_abs' || ex.bodyArea === 'obliques' || ex.bodyArea === 'waist_core')) ||
          (area === 'legs' && (ex.bodyArea === 'thighs' || ex.bodyArea === 'hamstrings' || ex.bodyArea === 'calves' || ex.bodyArea === 'glutes' || ex.bodyArea === 'hips')) ||
          (area === 'arms' && (ex.bodyArea === 'biceps' || ex.bodyArea === 'triceps'))
      );
    }

    if (filters?.difficulty && filters.difficulty !== 'all') {
      list = list.filter((ex) => ex.difficulty === filters.difficulty);
    }

    if (filters?.equipment && filters.equipment !== 'all') {
      list = list.filter((ex) => ex.equipment === filters.equipment);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.description.toLowerCase().includes(q) ||
          ex.targetMuscles.some((m) => m.toLowerCase().includes(q)) ||
          ex.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public getExerciseById(id: string): Exercise | undefined {
    return this.data.exercises.find((ex) => ex.id === id);
  }

  public createExercise(exerciseData: Omit<Exercise, 'id' | 'slug'>): Exercise {
    const slug = exerciseData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newEx: Exercise = {
      ...exerciseData,
      id: `ex-custom-${Date.now()}`,
      slug
    };
    this.data.exercises.push(newEx);
    this.saveDatabase();
    return newEx;
  }

  public updateExercise(id: string, updates: Partial<Exercise>): Exercise | undefined {
    const ex = this.getExerciseById(id);
    if (!ex) return undefined;
    Object.assign(ex, updates);
    this.saveDatabase();
    return ex;
  }

  public deleteExercise(id: string): boolean {
    const index = this.data.exercises.findIndex((ex) => ex.id === id);
    if (index === -1) return false;
    this.data.exercises.splice(index, 1);
    this.saveDatabase();
    return true;
  }

  // --- Workouts Operations ---
  public getWorkouts(filters?: {
    bodyArea?: string;
    difficulty?: string;
    equipment?: string;
    duration?: string;
  }): Workout[] {
    let list = this.data.workouts;

    if (filters?.bodyArea && filters.bodyArea !== 'all') {
      const area = filters.bodyArea.toLowerCase();
      list = list.filter(
        (wo) =>
          wo.bodyArea.toLowerCase() === area ||
          wo.secondaryAreas.some((s) => s.toLowerCase() === area) ||
          (area === 'abs' && (wo.bodyArea === 'abs' || wo.bodyArea === 'waist_core')) ||
          (area === 'legs' && (wo.bodyArea === 'thighs' || wo.bodyArea === 'glutes'))
      );
    }

    if (filters?.difficulty && filters.difficulty !== 'all') {
      list = list.filter((wo) => wo.difficulty === filters.difficulty);
    }

    if (filters?.equipment && filters.equipment !== 'all') {
      const eq = filters.equipment as EquipmentType;
      list = list.filter((wo) => wo.equipment.includes(eq));
    }

    if (filters?.duration && filters.duration !== 'all') {
      if (filters.duration === '5') list = list.filter((wo) => wo.durationMinutes <= 5);
      else if (filters.duration === '10') list = list.filter((wo) => wo.durationMinutes > 5 && wo.durationMinutes <= 10);
      else if (filters.duration === '15') list = list.filter((wo) => wo.durationMinutes > 10 && wo.durationMinutes <= 15);
      else if (filters.duration === '20') list = list.filter((wo) => wo.durationMinutes > 15 && wo.durationMinutes <= 20);
      else if (filters.duration === '30') list = list.filter((wo) => wo.durationMinutes > 20);
    }

    return list;
  }

  public getWorkoutById(id: string): Workout | undefined {
    return this.data.workouts.find((wo) => wo.id === id) || this.data.customWorkouts.find((c) => c.id === id) as unknown as Workout | undefined;
  }

  public createWorkout(workoutData: Omit<Workout, 'id'>): Workout {
    const newWorkout: Workout = {
      ...workoutData,
      id: `wo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.workouts.push(newWorkout);
    this.saveDatabase();
    return newWorkout;
  }

  public updateWorkout(id: string, updates: Partial<Workout>): Workout | undefined {
    const wo = this.data.workouts.find((w) => w.id === id);
    if (!wo) return undefined;
    Object.assign(wo, updates);
    this.saveDatabase();
    return wo;
  }

  public deleteWorkout(id: string): boolean {
    const index = this.data.workouts.findIndex((w) => w.id === id);
    if (index === -1) return false;
    this.data.workouts.splice(index, 1);
    this.saveDatabase();
    return true;
  }

  // --- Intelligent Workout Generator ---
  public generateWorkout(params: {
    bodyArea: BodyArea;
    difficulty: FitnessLevel;
    durationMinutes: number;
    equipment: EquipmentType;
    trainingStyle: TrainingStyle;
    intensity: IntensityLevel;
  }): Workout {
    // Filter matching exercises
    let candidates = this.data.exercises.filter((ex) => {
      // Body area match
      const areaMatch =
        ex.bodyArea === params.bodyArea ||
        (params.bodyArea === 'abs' && ['upper_abs', 'lower_abs', 'obliques', 'waist_core'].includes(ex.bodyArea)) ||
        (params.bodyArea === 'arms' && ['biceps', 'triceps'].includes(ex.bodyArea)) ||
        (params.bodyArea === 'thighs' && ['hamstrings', 'calves', 'glutes'].includes(ex.bodyArea)) ||
        (params.bodyArea === 'full_body');

      // Equipment match: if user chooses 'none', only none. If 'dumbbells', allow 'none' and 'dumbbells', etc.
      let eqMatch = false;
      if (params.equipment === 'none') {
        eqMatch = ex.equipment === 'none';
      } else {
        eqMatch = ex.equipment === params.equipment || ex.equipment === 'none';
      }

      return areaMatch && eqMatch;
    });

    if (candidates.length < 3) {
      // Fallback to all matching body area exercises
      candidates = this.data.exercises.filter((ex) => ex.bodyArea === params.bodyArea || params.bodyArea === 'full_body');
    }

    // Determine exercise count based on duration
    let exerciseCount = 4;
    if (params.durationMinutes <= 5) exerciseCount = 4;
    else if (params.durationMinutes <= 10) exerciseCount = 5;
    else if (params.durationMinutes <= 15) exerciseCount = 6;
    else if (params.durationMinutes <= 20) exerciseCount = 7;
    else exerciseCount = 8;

    // Shuffle and pick
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(exerciseCount, shuffled.length));

    // Construct exercises with appropriate sets/reps
    const sets = params.durationMinutes <= 5 ? 1 : params.durationMinutes <= 15 ? 3 : 4;
    const rest = params.intensity === 'challenging' ? 25 : params.intensity === 'easy' ? 45 : 30;

    const workoutExercises = selected.map((ex, idx) => ({
      exerciseId: ex.id,
      sets,
      reps: ex.exerciseType === 'reps' ? (params.difficulty === 'beginner' ? ex.defaultReps : ex.defaultReps + 4) : 1,
      durationSeconds: ex.exerciseType === 'time' ? (ex.duration || 30) : undefined,
      restSeconds: rest,
      order: idx + 1
    }));

    const titleArea = params.bodyArea.replace(/_/g, ' ').toUpperCase();
    const styleTitle = params.trainingStyle.charAt(0).toUpperCase() + params.trainingStyle.slice(1);

    const generatedWorkout: Workout = {
      id: `wo-gen-${Date.now()}`,
      title: `${titleArea} ${styleTitle} Protocol`,
      description: `Targeted ${params.durationMinutes}-minute ${params.difficulty} workout specifically isolating ${params.bodyArea.replace(/_/g, ' ')} muscles with ${params.trainingStyle} emphasis.`,
      bodyArea: params.bodyArea,
      secondaryAreas: [],
      difficulty: params.difficulty,
      durationMinutes: params.durationMinutes,
      equipment: [params.equipment],
      trainingStyle: params.trainingStyle,
      intensity: params.intensity,
      tags: ['generated', params.bodyArea, `${params.durationMinutes}-min`],
      warmup: ['Joint rotations & light cardio activation (60s)', 'Muscle-specific dynamic priming (60s)'],
      cooldown: ['Static muscle lengthening stretch (60s)', 'Parasympathetic breathing reset (60s)'],
      exercises: workoutExercises,
      createdAt: new Date().toISOString()
    };

    return generatedWorkout;
  }

  // --- Completed Workouts & Streaks ---
  public getCompletedWorkouts(userId: string): CompletedWorkout[] {
    return this.data.completedWorkouts
      .filter((cw) => cw.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  public logCompletedWorkout(completedData: Omit<CompletedWorkout, 'id'>): {
    completedWorkout: CompletedWorkout;
    newAchievements: Achievement[];
    streak: { current: number; longest: number };
  } {
    const id = `comp-${Date.now()}`;
    const newEntry: CompletedWorkout = {
      ...completedData,
      id
    };

    this.data.completedWorkouts.push(newEntry);

    // Calculate streaks
    const streak = this.calculateStreaks(completedData.userId);

    // Check achievements
    const newAchievements = this.checkAchievements(completedData.userId, streak);

    this.saveDatabase();

    return {
      completedWorkout: newEntry,
      newAchievements,
      streak
    };
  }

  private calculateStreaks(userId: string): { current: number; longest: number } {
    const userWorkouts = this.data.completedWorkouts
      .filter((w) => w.userId === userId)
      .map((w) => new Date(w.completedAt).toISOString().split('T')[0])
      .sort();

    const uniqueDates = Array.from(new Set(userWorkouts));
    if (uniqueDates.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if user worked out today or yesterday to continue current streak
    const lastWorkoutDate = uniqueDates[uniqueDates.length - 1];
    const isStreakActive = lastWorkoutDate === today || lastWorkoutDate === yesterday;

    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    currentStreak = isStreakActive ? tempStreak : 0;

    return {
      current: currentStreak,
      longest: Math.max(longestStreak, currentStreak)
    };
  }

  private checkAchievements(userId: string, streak: { current: number; longest: number }): Achievement[] {
    const userWorkouts = this.data.completedWorkouts.filter((w) => w.userId === userId);
    const existing = new Set(
      this.data.userAchievements.filter((ua) => ua.userId === userId).map((ua) => ua.achievementId)
    );

    const newlyUnlocked: Achievement[] = [];

    const totalWorkouts = userWorkouts.length;
    let totalExercises = 0;
    const uniqueExerciseIds = new Set<string>();

    for (const wo of userWorkouts) {
      for (const ex of wo.completedExercises || []) {
        totalExercises += ex.setsCompleted || 1;
        uniqueExerciseIds.add(ex.exerciseId);
      }
    }

    const customCount = this.data.customWorkouts.filter((cw) => cw.userId === userId).length;

    for (const ach of this.data.achievements) {
      if (existing.has(ach.id)) continue;

      let meets = false;
      if (ach.requirementType === 'workouts_count') {
        meets = totalWorkouts >= ach.threshold;
      } else if (ach.requirementType === 'streak_days') {
        meets = streak.longest >= ach.threshold;
      } else if (ach.requirementType === 'exercises_count') {
        meets = totalExercises >= ach.threshold;
      } else if (ach.requirementType === 'variety') {
        meets = uniqueExerciseIds.size >= ach.threshold;
      } else if (ach.requirementType === 'custom_workout') {
        meets = customCount >= ach.threshold;
      }

      if (meets) {
        this.data.userAchievements.push({
          userId,
          achievementId: ach.id,
          unlockedAt: new Date().toISOString()
        });
        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }

  public getProgressSummary(userId: string): ProgressSummary {
    const userWorkouts = this.getCompletedWorkouts(userId);
    const streak = this.calculateStreaks(userId);

    let totalMinutes = 0;
    let totalSets = 0;
    let totalReps = 0;
    let totalExercises = 0;

    const areaCountMap: Record<string, number> = {};

    for (const w of userWorkouts) {
      totalMinutes += Math.round(w.durationSeconds / 60);
      totalSets += w.totalSets || 0;
      totalReps += w.totalReps || 0;
      totalExercises += w.completedExercises ? w.completedExercises.length : 0;

      const area = w.bodyArea || 'full_body';
      areaCountMap[area] = (areaCountMap[area] || 0) + 1;
    }

    const totalLogged = userWorkouts.length || 1;
    const bodyAreaDistribution = Object.entries(areaCountMap).map(([area, count]) => ({
      area: area as BodyArea,
      count,
      percentage: Math.round((count / totalLogged) * 100)
    }));

    // Weekly activity (last 7 days)
    const weeklyActivity = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];

      const dayWorkouts = userWorkouts.filter((w) => w.completedAt.startsWith(dateStr));
      const minutes = dayWorkouts.reduce((acc, curr) => acc + Math.round(curr.durationSeconds / 60), 0);

      weeklyActivity.push({
        day: dayName,
        date: dateStr,
        minutes,
        count: dayWorkouts.length
      });
    }

    // Achievements with unlocked status
    const unlockedIds = new Map(
      this.data.userAchievements.filter((ua) => ua.userId === userId).map((ua) => [ua.achievementId, ua.unlockedAt])
    );

    const achievementsWithStatus = this.data.achievements.map((a) => ({
      ...a,
      unlockedAt: unlockedIds.get(a.id)
    }));

    return {
      workoutsCompleted: userWorkouts.length,
      totalWorkoutMinutes: totalMinutes,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      exercisesCompleted: totalExercises,
      setsCompleted: totalSets,
      repsCompleted: totalReps,
      bodyAreaDistribution,
      weeklyActivity,
      recentWorkouts: userWorkouts.slice(0, 10),
      achievements: achievementsWithStatus
    };
  }

  // --- Favorites ---
  public getFavorites(userId: string) {
    const exerciseIds = this.data.favoriteExercises.filter((f) => f.userId === userId).map((f) => f.exerciseId);
    const workoutIds = this.data.favoriteWorkouts.filter((f) => f.userId === userId).map((f) => f.workoutId);

    const favoriteExercises = this.data.exercises.filter((ex) => exerciseIds.includes(ex.id));
    const favoriteWorkouts = this.data.workouts.filter((w) => workoutIds.includes(w.id));

    return { favoriteExercises, favoriteWorkouts };
  }

  public toggleFavoriteExercise(userId: string, exerciseId: string): boolean {
    const idx = this.data.favoriteExercises.findIndex((f) => f.userId === userId && f.exerciseId === exerciseId);
    if (idx > -1) {
      this.data.favoriteExercises.splice(idx, 1);
      this.saveDatabase();
      return false; // un-favorited
    } else {
      this.data.favoriteExercises.push({ userId, exerciseId, createdAt: new Date().toISOString() });
      this.saveDatabase();
      return true; // favorited
    }
  }

  public toggleFavoriteWorkout(userId: string, workoutId: string): boolean {
    const idx = this.data.favoriteWorkouts.findIndex((f) => f.userId === userId && f.workoutId === workoutId);
    if (idx > -1) {
      this.data.favoriteWorkouts.splice(idx, 1);
      this.saveDatabase();
      return false;
    } else {
      this.data.favoriteWorkouts.push({ userId, workoutId, createdAt: new Date().toISOString() });
      this.saveDatabase();
      return true;
    }
  }

  // --- Custom Workouts ---
  public getCustomWorkouts(userId: string): CustomWorkout[] {
    return this.data.customWorkouts.filter((cw) => cw.userId === userId);
  }

  public createCustomWorkout(userId: string, workoutData: Omit<CustomWorkout, 'id' | 'userId' | 'createdAt'>): CustomWorkout {
    const newCw: CustomWorkout = {
      ...workoutData,
      id: `cw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString()
    };
    this.data.customWorkouts.push(newCw);

    // Also check achievements for custom workout creation
    const streak = this.calculateStreaks(userId);
    this.checkAchievements(userId, streak);

    this.saveDatabase();
    return newCw;
  }

  public updateCustomWorkout(userId: string, id: string, updates: Partial<CustomWorkout>): CustomWorkout | undefined {
    const cw = this.data.customWorkouts.find((w) => w.id === id && w.userId === userId);
    if (!cw) return undefined;
    Object.assign(cw, updates);
    this.saveDatabase();
    return cw;
  }

  public deleteCustomWorkout(userId: string, id: string): boolean {
    const idx = this.data.customWorkouts.findIndex((w) => w.id === id && w.userId === userId);
    if (idx === -1) return false;
    this.data.customWorkouts.splice(idx, 1);
    this.saveDatabase();
    return true;
  }
}

export const db = new DatabaseStore();
