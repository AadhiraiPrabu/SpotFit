import { Achievement } from '../../src/types/index.js';

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-first-workout',
    code: 'first_workout',
    title: 'First Step',
    description: 'Completed your very first SpotFit workout session.',
    icon: 'Sparkles',
    requirementType: 'workouts_count',
    threshold: 1
  },
  {
    id: 'ach-5-workouts',
    code: '5_workouts',
    title: 'Building Momentum',
    description: 'Completed 5 targeted workout sessions.',
    icon: 'Flame',
    requirementType: 'workouts_count',
    threshold: 5
  },
  {
    id: 'ach-10-workouts',
    code: '10_workouts',
    title: 'Consistent Mover',
    description: 'Completed 10 workouts. Your routine is taking shape.',
    icon: 'Trophy',
    requirementType: 'workouts_count',
    threshold: 10
  },
  {
    id: 'ach-25-workouts',
    code: '25_workouts',
    title: 'Dedicated Athlete',
    description: 'Completed 25 workouts. Proven commitment to purpose-driven training.',
    icon: 'Crown',
    requirementType: 'workouts_count',
    threshold: 25
  },
  {
    id: 'ach-streak-7',
    code: '7_day_consistency',
    title: '7-Day Champion',
    description: 'Maintained a 7-day workout streak or weekly consistency.',
    icon: 'Zap',
    requirementType: 'streak_days',
    threshold: 7
  },
  {
    id: 'ach-streak-30',
    code: '30_day_consistency',
    title: 'Iron Discipline',
    description: 'Logged workouts or planned active recovery for 30 consecutive days.',
    icon: 'Award',
    requirementType: 'streak_days',
    threshold: 30
  },
  {
    id: 'ach-first-custom',
    code: 'first_custom_workout',
    title: 'Workout Architect',
    description: 'Created and saved your first custom tailored workout routine.',
    icon: 'Wrench',
    requirementType: 'custom_workout',
    threshold: 1
  },
  {
    id: 'ach-variety-10',
    code: 'tried_10_exercises',
    title: 'Movement Explorer',
    description: 'Performed at least 10 distinct exercises from the exercise library.',
    icon: 'Compass',
    requirementType: 'variety',
    threshold: 10
  },
  {
    id: 'ach-100-exercises',
    code: '100_exercises',
    title: 'Centurion Volume',
    description: 'Completed over 100 total sets/exercises across your training history.',
    icon: 'ShieldCheck',
    requirementType: 'exercises_count',
    threshold: 100
  }
];
