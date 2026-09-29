import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { askSpotFitCoach } from './ai.js';
import { BodyArea, FitnessLevel, EquipmentType, TrainingStyle, IntensityLevel } from '../src/types/index.js';

export const apiRouter = Router();

// Helper to authenticate user from headers (simple token / user-id bearer)
function getAuthUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token && token !== 'undefined' && token !== 'null') {
      return token;
    }
  }
  const customHeader = req.headers['x-user-id'] as string;
  if (customHeader) return customHeader;

  // Default fallback to demo user for frictionless experience if unauthenticated
  return 'usr-demo-001';
}

// ================= AUTH =================
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, name, fitnessLevel } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    const user = db.createUser(email, password, name || 'Athlete', fitnessLevel || 'beginner');
    const { passwordHash, ...safeUser } = user;
    return res.status(201).json({ user: safeUser, token: user.id });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to register user.' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser, token: user.id });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to process login.' });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const user = db.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User session not found.' });
  }
  const { passwordHash, ...safeUser } = user;
  return res.json({ user: safeUser, token: user.id });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const updated = db.updateUserProfile(userId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { passwordHash, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

// ================= EXERCISES =================
apiRouter.get('/exercises', (req: Request, res: Response) => {
  const { bodyArea, difficulty, equipment, search } = req.query;
  const list = db.getExercises({
    bodyArea: bodyArea as string,
    difficulty: difficulty as string,
    equipment: equipment as string,
    search: search as string
  });
  return res.json(list);
});

apiRouter.get('/exercises/:id', (req: Request, res: Response) => {
  const ex = db.getExerciseById(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Exercise not found.' });
  return res.json(ex);
});

// ================= WORKOUTS =================
apiRouter.get('/workouts', (req: Request, res: Response) => {
  const { bodyArea, difficulty, equipment, duration } = req.query;
  const list = db.getWorkouts({
    bodyArea: bodyArea as string,
    difficulty: difficulty as string,
    equipment: equipment as string,
    duration: duration as string
  });
  return res.json(list);
});

apiRouter.get('/workouts/:id', (req: Request, res: Response) => {
  const wo = db.getWorkoutById(req.params.id);
  if (!wo) return res.status(404).json({ error: 'Workout not found.' });
  return res.json(wo);
});

apiRouter.post('/workouts/generate', (req: Request, res: Response) => {
  try {
    const { bodyArea, difficulty, durationMinutes, equipment, trainingStyle, intensity } = req.body;
    const generated = db.generateWorkout({
      bodyArea: (bodyArea || 'abs') as BodyArea,
      difficulty: (difficulty || 'beginner') as FitnessLevel,
      durationMinutes: Number(durationMinutes) || 15,
      equipment: (equipment || 'none') as EquipmentType,
      trainingStyle: (trainingStyle || 'strength') as TrainingStyle,
      intensity: (intensity || 'moderate') as IntensityLevel
    });
    return res.json(generated);
  } catch (err: any) {
    console.error('Generator error:', err);
    return res.status(500).json({ error: 'Failed to generate workout.' });
  }
});

// ================= PROGRESS & COMPLETION =================
apiRouter.post('/workouts/complete', (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const {
      workoutId,
      workoutTitle,
      bodyArea,
      durationSeconds,
      totalSets,
      totalReps,
      caloriesBurned,
      completedExercises,
      notes
    } = req.body;

    const result = db.logCompletedWorkout({
      userId,
      workoutId: workoutId || `wo-custom-${Date.now()}`,
      workoutTitle: workoutTitle || 'SpotFit Workout',
      bodyArea: bodyArea || 'abs',
      durationSeconds: Number(durationSeconds) || 600,
      totalSets: Number(totalSets) || 10,
      totalReps: Number(totalReps) || 100,
      caloriesBurned: Number(caloriesBurned) || 60,
      completedExercises: completedExercises || [],
      completedAt: new Date().toISOString(),
      notes
    });

    return res.status(201).json(result);
  } catch (err: any) {
    console.error('Complete workout error:', err);
    return res.status(500).json({ error: 'Failed to save completed workout.' });
  }
});

apiRouter.get('/history', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const list = db.getCompletedWorkouts(userId);
  return res.json(list);
});

apiRouter.get('/progress', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const summary = db.getProgressSummary(userId);
  return res.json(summary);
});

// ================= FAVORITES =================
apiRouter.get('/favorites', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const favs = db.getFavorites(userId);
  return res.json(favs);
});

apiRouter.post('/favorites/exercise/:id', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const isFavorited = db.toggleFavoriteExercise(userId, req.params.id);
  return res.json({ exerciseId: req.params.id, isFavorited });
});

apiRouter.post('/favorites/workout/:id', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const isFavorited = db.toggleFavoriteWorkout(userId, req.params.id);
  return res.json({ workoutId: req.params.id, isFavorited });
});

// ================= CUSTOM WORKOUTS =================
apiRouter.get('/custom-workouts', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const list = db.getCustomWorkouts(userId);
  return res.json(list);
});

apiRouter.post('/custom-workouts', (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    const { title, description, bodyArea, difficulty, equipment, exercises } = req.body;
    if (!title) return res.status(400).json({ error: 'Workout title is required.' });

    const created = db.createCustomWorkout(userId, {
      title,
      description: description || 'Personal customized spot workout.',
      bodyArea: bodyArea || 'abs',
      difficulty: difficulty || 'beginner',
      equipment: equipment || ['none'],
      exercises: exercises || []
    });

    return res.status(201).json(created);
  } catch (err: any) {
    console.error('Custom workout create error:', err);
    return res.status(500).json({ error: 'Failed to create custom workout.' });
  }
});

apiRouter.put('/custom-workouts/:id', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const updated = db.updateCustomWorkout(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Custom workout not found.' });
  return res.json(updated);
});

apiRouter.delete('/custom-workouts/:id', (req: Request, res: Response) => {
  const userId = getAuthUserId(req);
  const ok = db.deleteCustomWorkout(userId, req.params.id);
  if (!ok) return res.status(404).json({ error: 'Custom workout not found.' });
  return res.json({ success: true });
});

// ================= AI COACH =================
apiRouter.post('/ai/coach', async (req: Request, res: Response) => {
  try {
    const { query, context } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const response = await askSpotFitCoach(query, context);
    return res.json(response);
  } catch (err: any) {
    console.error('AI Coach route error:', err);
    return res.status(500).json({ error: 'Failed to get coach response.' });
  }
});

// ================= ADMIN DASHBOARD =================
apiRouter.post('/admin/exercises', (req: Request, res: Response) => {
  try {
    const created = db.createExercise(req.body);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create exercise.' });
  }
});

apiRouter.put('/admin/exercises/:id', (req: Request, res: Response) => {
  const updated = db.updateExercise(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Exercise not found.' });
  return res.json(updated);
});

apiRouter.delete('/admin/exercises/:id', (req: Request, res: Response) => {
  const deleted = db.deleteExercise(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Exercise not found.' });
  return res.json({ success: true });
});

apiRouter.post('/admin/workouts', (req: Request, res: Response) => {
  try {
    const created = db.createWorkout(req.body);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create workout.' });
  }
});

apiRouter.put('/admin/workouts/:id', (req: Request, res: Response) => {
  const updated = db.updateWorkout(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Workout not found.' });
  return res.json(updated);
});

apiRouter.delete('/admin/workouts/:id', (req: Request, res: Response) => {
  const deleted = db.deleteWorkout(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Workout not found.' });
  return res.json({ success: true });
});

apiRouter.get('/admin/stats', (req: Request, res: Response) => {
  const exercises = db.getExercises();
  const workouts = db.getWorkouts();
  return res.json({
    totalExercises: exercises.length,
    totalWorkouts: workouts.length,
    serverTime: new Date().toISOString()
  });
});
