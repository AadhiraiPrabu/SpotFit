import { Workout } from '../../src/types/index.js';

export const initialWorkouts: Workout[] = [
  // --- 5-MINUTE QUICK WORKOUTS ---
  {
    id: 'wo-quick-5min-abs',
    title: '5-Minute Express Abs',
    description: 'High-density abdominal circuit designed to train the core in just 5 focused minutes.',
    bodyArea: 'abs',
    secondaryAreas: ['waist_core', 'lower_abs'],
    difficulty: 'beginner',
    durationMinutes: 5,
    equipment: ['none'],
    trainingStyle: 'endurance',
    intensity: 'moderate',
    tags: ['quick', '5-min', 'abs', 'no-equipment'],
    warmup: ['Deep diaphragmatic breathing (30s)', 'Torso twists (30s)'],
    cooldown: ['Cobra / Sphynx stretch (30s)'],
    exercises: [
      { exerciseId: 'ex-core-deadbug', sets: 1, reps: 12, restSeconds: 15, order: 1 },
      { exerciseId: 'ex-core-plank', sets: 1, reps: 1, durationSeconds: 35, restSeconds: 15, order: 2 },
      { exerciseId: 'ex-core-reversecrunch', sets: 1, reps: 15, restSeconds: 15, order: 3 },
      { exerciseId: 'ex-core-bicyclecrunch', sets: 1, reps: 20, restSeconds: 15, order: 4 },
      { exerciseId: 'ex-core-heeltaps', sets: 1, reps: 24, restSeconds: 0, order: 5 }
    ]
  },
  {
    id: 'wo-quick-5min-arms',
    title: '5-Minute Upper Arm Finisher',
    description: 'Quick biceps and triceps burn that pumps the arms without needing gym machines.',
    bodyArea: 'arms',
    secondaryAreas: ['biceps', 'triceps'],
    difficulty: 'intermediate',
    durationMinutes: 5,
    equipment: ['none'],
    trainingStyle: 'strength',
    intensity: 'moderate',
    tags: ['quick', '5-min', 'arms', 'triceps', 'biceps'],
    warmup: ['Arm circles forward and backward (30s)'],
    cooldown: ['Overhead triceps and wrist forearm stretch (30s)'],
    exercises: [
      { exerciseId: 'ex-chest-closepushup', sets: 1, reps: 12, restSeconds: 20, order: 1 },
      { exerciseId: 'ex-arms-tricepdip', sets: 1, reps: 15, restSeconds: 20, order: 2 },
      { exerciseId: 'ex-arms-diamondbench', sets: 1, reps: 12, restSeconds: 20, order: 3 },
      { exerciseId: 'ex-chest-diamondpushup', sets: 1, reps: 10, restSeconds: 0, order: 4 }
    ]
  },
  {
    id: 'wo-quick-5min-legs',
    title: '5-Minute Quad & Thigh Burner',
    description: 'Rapid lower body activation focusing on quad endurance and knee stability.',
    bodyArea: 'thighs',
    secondaryAreas: ['calves', 'glutes'],
    difficulty: 'beginner',
    durationMinutes: 5,
    equipment: ['none'],
    trainingStyle: 'endurance',
    intensity: 'moderate',
    tags: ['quick', '5-min', 'legs', 'quads', 'bodyweight'],
    warmup: ['High knees march (30s)', 'Leg swings (30s)'],
    cooldown: ['Standing quad stretch (30s)'],
    exercises: [
      { exerciseId: 'ex-legs-bodyweightsquat', sets: 1, reps: 20, restSeconds: 15, order: 1 },
      { exerciseId: 'ex-legs-reverselunge', sets: 1, reps: 16, restSeconds: 15, order: 2 },
      { exerciseId: 'ex-legs-wallsit', sets: 1, reps: 1, durationSeconds: 40, restSeconds: 15, order: 3 },
      { exerciseId: 'ex-legs-calfraises', sets: 1, reps: 25, restSeconds: 0, order: 4 }
    ]
  },
  {
    id: 'wo-quick-5min-glutes',
    title: '5-Minute Glute Awakening',
    description: 'Targeted hip and glute activation routine to turn on dormant glutes and alleviate low back stress.',
    bodyArea: 'glutes',
    secondaryAreas: ['hips'],
    difficulty: 'beginner',
    durationMinutes: 5,
    equipment: ['none'],
    trainingStyle: 'stability',
    intensity: 'easy',
    tags: ['quick', '5-min', 'glutes', 'hips', 'posture'],
    warmup: ['Cat-Cow flow (30s)'],
    cooldown: ['Figure-4 glute stretch (30s)'],
    exercises: [
      { exerciseId: 'ex-glutes-bridge', sets: 1, reps: 15, restSeconds: 15, order: 1 },
      { exerciseId: 'ex-glutes-donkeykick', sets: 1, reps: 12, restSeconds: 15, order: 2 },
      { exerciseId: 'ex-glutes-firehydrant', sets: 1, reps: 12, restSeconds: 15, order: 3 },
      { exerciseId: 'ex-glutes-frogpumps', sets: 1, reps: 25, restSeconds: 0, order: 4 }
    ]
  },
  {
    id: 'wo-quick-5min-fullbody',
    title: '5-Minute Full-Body Spark',
    description: 'Full-body functional energizer that gets the heart pumping and coordinates all major muscle groups.',
    bodyArea: 'full_body',
    secondaryAreas: ['chest', 'thighs', 'waist_core'],
    difficulty: 'intermediate',
    durationMinutes: 5,
    equipment: ['none'],
    trainingStyle: 'hiit',
    intensity: 'challenging',
    tags: ['quick', '5-min', 'full-body', 'hiit'],
    warmup: ['Jumping jacks (30s)', 'Arm sweeps (30s)'],
    cooldown: ['Deep breathing forward fold (30s)'],
    exercises: [
      { exerciseId: 'ex-legs-bodyweightsquat', sets: 1, reps: 15, restSeconds: 15, order: 1 },
      { exerciseId: 'ex-chest-pushup', sets: 1, reps: 10, restSeconds: 15, order: 2 },
      { exerciseId: 'ex-core-mountainclimber', sets: 1, reps: 1, durationSeconds: 30, restSeconds: 15, order: 3 },
      { exerciseId: 'ex-full-burpee', sets: 1, reps: 8, restSeconds: 0, order: 4 }
    ]
  },
  {
    id: 'wo-quick-5min-mobility',
    title: '5-Minute Desk Reset & Mobility',
    description: 'Relieve neck tension, open hips, and decompress the spine after hours of sitting.',
    bodyArea: 'mobility',
    secondaryAreas: ['posture', 'back'],
    difficulty: 'beginner',
    durationMinutes: 5,
    equipment: ['none'],
    trainingStyle: 'mobility',
    intensity: 'easy',
    tags: ['quick', '5-min', 'mobility', 'desk-reset', 'posture'],
    warmup: ['Shoulder rolls and neck rolls (30s)'],
    cooldown: ['Deep diaphragmatic breaths in Child’s Pose (30s)'],
    exercises: [
      { exerciseId: 'ex-mob-chin-tuck', sets: 1, reps: 10, restSeconds: 10, order: 1 },
      { exerciseId: 'ex-mob-catcow', sets: 1, reps: 8, restSeconds: 15, order: 2 },
      { exerciseId: 'ex-mob-threadneedle', sets: 1, reps: 6, restSeconds: 15, order: 3 },
      { exerciseId: 'ex-mob-doorwaychest', sets: 1, reps: 1, durationSeconds: 40, restSeconds: 0, order: 4 }
    ]
  },

  // --- 10 & 15-MINUTE TARGETED SPOT WORKOUTS ---
  {
    id: 'wo-core-15m-solid',
    title: 'Bulletproof Core Foundation',
    description: 'A scientifically structured anterior, lateral, and rotational core stability session.',
    bodyArea: 'abs',
    secondaryAreas: ['obliques', 'waist_core', 'lower_abs'],
    difficulty: 'beginner',
    durationMinutes: 15,
    equipment: ['none'],
    trainingStyle: 'stability',
    intensity: 'moderate',
    tags: ['core', 'abs', '15-min', 'stability', 'spine-safe'],
    warmup: ['Cat-Cow (60s)', 'Bird Dog practice (60s)'],
    cooldown: ['Cobra pose (45s)', "Child's pose (45s)"],
    exercises: [
      { exerciseId: 'ex-core-deadbug', sets: 3, reps: 12, restSeconds: 30, order: 1 },
      { exerciseId: 'ex-core-birddog', sets: 3, reps: 10, restSeconds: 30, order: 2 },
      { exerciseId: 'ex-core-plank', sets: 3, reps: 1, durationSeconds: 35, restSeconds: 30, order: 3 },
      { exerciseId: 'ex-core-reversecrunch', sets: 3, reps: 12, restSeconds: 30, order: 4 },
      { exerciseId: 'ex-core-sideplank', sets: 2, reps: 1, durationSeconds: 25, restSeconds: 30, order: 5 }
    ]
  },
  {
    id: 'wo-chest-15m-builder',
    title: 'Upper Chest & Triceps Architect',
    description: 'Multi-angle push routine stimulating upper, middle, and lower chest fibers.',
    bodyArea: 'chest',
    secondaryAreas: ['triceps', 'shoulders'],
    difficulty: 'intermediate',
    durationMinutes: 15,
    equipment: ['none'],
    trainingStyle: 'strength',
    intensity: 'moderate',
    tags: ['chest', 'push', 'bodyweight', '15-min'],
    warmup: ['Arm swings (60s)', 'Scapular push-up warmup (60s)'],
    cooldown: ['Doorway chest stretch (60s)', 'Triceps overhead stretch (60s)'],
    exercises: [
      { exerciseId: 'ex-chest-pushup', sets: 3, reps: 12, restSeconds: 45, order: 1 },
      { exerciseId: 'ex-chest-declinepushup', sets: 3, reps: 10, restSeconds: 45, order: 2 },
      { exerciseId: 'ex-chest-widepushup', sets: 3, reps: 12, restSeconds: 45, order: 3 },
      { exerciseId: 'ex-chest-diamondpushup', sets: 2, reps: 8, restSeconds: 45, order: 4 }
    ]
  },
  {
    id: 'wo-back-15m-posture',
    title: 'Back Thickness & Posture Realignment',
    description: 'Reinforces the posterior chain, mid-traps, and lats to counteract forward slumping.',
    bodyArea: 'back',
    secondaryAreas: ['posture', 'shoulders'],
    difficulty: 'beginner',
    durationMinutes: 15,
    equipment: ['dumbbells'],
    trainingStyle: 'strength',
    intensity: 'moderate',
    tags: ['back', 'posture', 'dumbbells', '15-min', 'lats'],
    warmup: ['Wall angels (60s)', 'Prone swimmer flutter (60s)'],
    cooldown: ['Cat-Cow stretch (45s)', 'Lats doorway stretch (45s)'],
    exercises: [
      { exerciseId: 'ex-back-dbrow', sets: 3, reps: 12, restSeconds: 45, order: 1 },
      { exerciseId: 'ex-back-singlearmrow', sets: 3, reps: 10, restSeconds: 45, order: 2 },
      { exerciseId: 'ex-back-reversefly', sets: 3, reps: 12, restSeconds: 30, order: 3 },
      { exerciseId: 'ex-back-superman', sets: 3, reps: 12, restSeconds: 30, order: 4 }
    ]
  },
  {
    id: 'wo-glutes-20m-sculpt',
    title: 'Glute Strength & Hip Stability',
    description: 'Comprehensive glute hypertrophy and hip abduction routine emphasizing peak hip extension.',
    bodyArea: 'glutes',
    secondaryAreas: ['hips', 'hamstrings'],
    difficulty: 'intermediate',
    durationMinutes: 20,
    equipment: ['none'],
    trainingStyle: 'strength',
    intensity: 'challenging',
    tags: ['glutes', 'hips', '20-min', 'bodyweight', 'booty'],
    warmup: ['Glute bridge holds (60s)', 'Standing hip openers (60s)'],
    cooldown: ['Pigeon stretch (60s each side)', 'Seated hamstring stretch (60s)'],
    exercises: [
      { exerciseId: 'ex-glutes-hipthrust', sets: 3, reps: 15, restSeconds: 45, order: 1 },
      { exerciseId: 'ex-glutes-bulgarian', sets: 3, reps: 10, restSeconds: 45, order: 2 },
      { exerciseId: 'ex-glutes-singlelegbridge', sets: 3, reps: 10, restSeconds: 30, order: 3 },
      { exerciseId: 'ex-glutes-firehydrant', sets: 3, reps: 15, restSeconds: 30, order: 4 },
      { exerciseId: 'ex-glutes-frogpumps', sets: 2, reps: 25, restSeconds: 30, order: 5 }
    ]
  },
  {
    id: 'wo-shoulders-15m-delts',
    title: '3D Deltoids & Shoulder Armor',
    description: 'Target anterior, lateral, and posterior deltoids for balanced shoulder development and rotator cuff resilience.',
    bodyArea: 'shoulders',
    secondaryAreas: ['back', 'arms'],
    difficulty: 'intermediate',
    durationMinutes: 15,
    equipment: ['dumbbells'],
    trainingStyle: 'strength',
    intensity: 'moderate',
    tags: ['shoulders', 'delts', 'dumbbells', '15-min'],
    warmup: ['Arm circles (45s)', 'Scapular wall slides (60s)'],
    cooldown: ['Cross-body shoulder stretch (45s each side)'],
    exercises: [
      { exerciseId: 'ex-shoulders-overheadpress', sets: 3, reps: 10, restSeconds: 45, order: 1 },
      { exerciseId: 'ex-shoulders-lateralraise', sets: 3, reps: 14, restSeconds: 30, order: 2 },
      { exerciseId: 'ex-shoulders-frontraise', sets: 3, reps: 12, restSeconds: 30, order: 3 },
      { exerciseId: 'ex-back-reversefly', sets: 3, reps: 12, restSeconds: 30, order: 4 }
    ]
  },
  {
    id: 'wo-legs-20m-power',
    title: 'Lower Body Strength & Quad Endurance',
    description: 'Compound leg workout hitting quads, hamstrings, and calves through full range of motion.',
    bodyArea: 'thighs',
    secondaryAreas: ['hamstrings', 'calves', 'glutes'],
    difficulty: 'intermediate',
    durationMinutes: 20,
    equipment: ['none'],
    trainingStyle: 'strength',
    intensity: 'challenging',
    tags: ['legs', 'quads', 'hamstrings', '20-min', 'bodyweight'],
    warmup: ['Bodyweight squat holds (60s)', 'Leg swings (60s)'],
    cooldown: ['Standing quad stretch (45s)', 'Seated forward fold (60s)'],
    exercises: [
      { exerciseId: 'ex-legs-bodyweightsquat', sets: 3, reps: 15, restSeconds: 45, order: 1 },
      { exerciseId: 'ex-legs-reverselunge', sets: 3, reps: 12, restSeconds: 45, order: 2 },
      { exerciseId: 'ex-legs-sumosquat', sets: 3, reps: 15, restSeconds: 45, order: 3 },
      { exerciseId: 'ex-legs-wallsit', sets: 3, reps: 1, durationSeconds: 40, restSeconds: 45, order: 4 },
      { exerciseId: 'ex-legs-calfraises', sets: 3, reps: 20, restSeconds: 30, order: 5 }
    ]
  },
  {
    id: 'wo-mobility-15m-spinehip',
    title: 'Complete Hip & Spine Restoration',
    description: 'Deep mobility work to unlock restricted hips, increase thoracic rotation, and ease lower back stiffness.',
    bodyArea: 'mobility',
    secondaryAreas: ['posture', 'waist_core'],
    difficulty: 'beginner',
    durationMinutes: 15,
    equipment: ['none'],
    trainingStyle: 'mobility',
    intensity: 'easy',
    tags: ['mobility', 'hips', 'spine', 'recovery', '15-min'],
    warmup: ['Deep belly breathing (60s)'],
    cooldown: ["Child's pose side reach (60s)"],
    exercises: [
      { exerciseId: 'ex-mob-catcow', sets: 2, reps: 10, restSeconds: 15, order: 1 },
      { exerciseId: 'ex-mob-worldsgreatest', sets: 2, reps: 6, restSeconds: 20, order: 2 },
      { exerciseId: 'ex-mob-9090', sets: 2, reps: 8, restSeconds: 20, order: 3 },
      { exerciseId: 'ex-mob-pigeon', sets: 2, reps: 1, durationSeconds: 45, restSeconds: 15, order: 4 },
      { exerciseId: 'ex-mob-hipflexor', sets: 2, reps: 1, durationSeconds: 40, restSeconds: 15, order: 5 }
    ]
  },
  {
    id: 'wo-fullbody-30m-hiit',
    title: '30-Minute Total Body Athletic Circuit',
    description: 'High energy full body training session combining pushing, pulling, core bracing, and leg drive.',
    bodyArea: 'full_body',
    secondaryAreas: ['chest', 'thighs', 'abs', 'shoulders'],
    difficulty: 'advanced',
    durationMinutes: 30,
    equipment: ['none'],
    trainingStyle: 'hiit',
    intensity: 'challenging',
    tags: ['full-body', '30-min', 'hiit', 'conditioning'],
    warmup: ['Jumping jacks (60s)', 'Arm circles (60s)', 'Bodyweight squats (60s)'],
    cooldown: ['Full body stretch and cooldown breathing (120s)'],
    exercises: [
      { exerciseId: 'ex-legs-bodyweightsquat', sets: 4, reps: 15, restSeconds: 30, order: 1 },
      { exerciseId: 'ex-chest-pushup', sets: 4, reps: 12, restSeconds: 30, order: 2 },
      { exerciseId: 'ex-core-mountainclimber', sets: 4, reps: 1, durationSeconds: 35, restSeconds: 30, order: 3 },
      { exerciseId: 'ex-glutes-bridge', sets: 3, reps: 15, restSeconds: 30, order: 4 },
      { exerciseId: 'ex-full-burpee', sets: 3, reps: 10, restSeconds: 45, order: 5 },
      { exerciseId: 'ex-core-plank', sets: 3, reps: 1, durationSeconds: 45, restSeconds: 30, order: 6 }
    ]
  }
];
