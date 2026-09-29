import React, { useState, useEffect } from 'react';
import {
  Exercise,
  Workout,
  CompletedWorkout,
  ProgressSummary,
  BodyArea,
  CustomWorkout
} from './types/index.js';
import { api } from './services/api.js';
import { useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { MobileNav } from './components/MobileNav.js';
import { BodyMap } from './components/BodyMap.js';
import { SpotTrainingGrid } from './components/SpotTrainingGrid.js';
import { QuickWorkoutSection } from './components/QuickWorkoutSection.js';
import { SafetyNoticeBanner } from './components/SafetyNoticeBanner.js';
import { LiveWorkoutModal } from './components/LiveWorkoutModal.js';
import { WorkoutGeneratorModal } from './components/WorkoutGeneratorModal.js';
import { WorkoutPreviewModal } from './components/WorkoutPreviewModal.js';
import { ExerciseDetailModal } from './components/ExerciseDetailModal.js';
import { CustomWorkoutBuilder } from './components/CustomWorkoutBuilder.js';
import { ProgressDashboard } from './components/ProgressDashboard.js';
import { WorkoutHistoryView } from './components/WorkoutHistoryView.js';
import { FavoritesView } from './components/FavoritesView.js';
import { AICoachDrawer } from './components/AICoachDrawer.js';
import { UserProfileModal } from './components/UserProfileModal.js';
import { AdminDashboardModal } from './components/AdminDashboardModal.js';
import { AuthModal } from './components/AuthModal.js';
import {
  Flame,
  Sparkles,
  Play,
  Dumbbell,
  Compass,
  Trophy,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const { user } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'workouts' | 'bodymap' | 'progress' | 'favorites' | 'history'>('home');

  // Core Data
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [history, setHistory] = useState<CompletedWorkout[]>([]);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([]);
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<Workout[]>([]);
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Selected Interactive State
  const [selectedSpot, setSelectedSpot] = useState<BodyArea>('abs');
  const [activePreviewWorkout, setActivePreviewWorkout] = useState<Workout | null>(null);
  const [activeLiveWorkout, setActiveLiveWorkout] = useState<Workout | null>(null);
  const [activeDetailExercise, setActiveDetailExercise] = useState<Exercise | null>(null);

  // Modals Visibility
  const [showGenerator, setShowGenerator] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Search in exercise/workout explorer
  const [globalSearch, setGlobalSearch] = useState('');

  // Load Initial Data from Backend
  const loadAppData = async () => {
    try {
      const [exList, woList, histList, progData, favData, custData] = await Promise.all([
        api.getExercises(),
        api.getWorkouts(),
        api.getHistory().catch(() => []),
        api.getProgress().catch(() => null),
        api.getFavorites().catch(() => ({ favoriteExercises: [], favoriteWorkouts: [] })),
        api.getCustomWorkouts().catch(() => [])
      ]);

      setExercises(exList);
      setWorkouts(woList);
      setHistory(histList);
      setProgressSummary(progData);
      setFavoriteExercises(favData.favoriteExercises || []);
      setFavoriteWorkouts(favData.favoriteWorkouts || []);
      setCustomWorkouts(custData || []);
    } catch (err) {
      console.error('Error loading SpotFit app data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, [user]);

  // Quick Start Single Spot Workout
  const handleQuickStartSpot = async (spot: BodyArea) => {
    try {
      const matching = workouts.filter((w) => w.bodyArea === spot);
      if (matching.length > 0) {
        setActivePreviewWorkout(matching[0]);
      } else {
        const generated = await api.generateWorkout({
          bodyArea: spot,
          difficulty: user?.fitnessLevel || 'beginner',
          durationMinutes: user?.preferredDuration || 15,
          equipment: 'none',
          trainingStyle: 'strength',
          intensity: 'moderate'
        });
        setActivePreviewWorkout(generated);
      }
    } catch (e) {
      console.error('Failed to quick start spot:', e);
    }
  };

  // Toggle Favorite
  const handleToggleFavoriteExercise = async (exerciseId: string) => {
    try {
      const res = await api.toggleFavoriteExercise(exerciseId);
      if (res.isFavorited) {
        const ex = exercises.find((e) => e.id === exerciseId);
        if (ex) setFavoriteExercises((prev) => [...prev, ex]);
      } else {
        setFavoriteExercises((prev) => prev.filter((e) => e.id !== exerciseId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFavoriteWorkout = async (workoutId: string) => {
    try {
      const res = await api.toggleFavoriteWorkout(workoutId);
      if (res.isFavorited) {
        const wo = workouts.find((w) => w.id === workoutId);
        if (wo) setFavoriteWorkouts((prev) => [...prev, wo]);
      } else {
        setFavoriteWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Log Completed Workout in Live Mode
  const handleSaveCompletedWorkout = async (logData: Partial<CompletedWorkout>) => {
    try {
      const res = await api.completeWorkout(logData);
      setHistory((prev) => [res.completedWorkout, ...prev]);
      // Refresh progress summary
      const updatedProg = await api.getProgress();
      setProgressSummary(updatedProg);
    } catch (e) {
      console.error('Failed to log completed workout:', e);
    }
  };

  // Today's Spot Recommendation (defaults to user's favorite spot or core)
  const todaysSpot: BodyArea = user?.favoriteSpots?.[0] || 'abs';
  const todaysWorkout = workouts.find((w) => w.bodyArea === todaysSpot) || workouts[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-8 selection:bg-amber-500 selection:text-slate-950">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
        streakCount={progressSummary?.currentStreak || 0}
        onOpenGenerator={() => setShowGenerator(true)}
        onOpenAICoach={() => setShowAICoach(true)}
        onOpenProfile={() => (user ? setShowProfile(true) : setShowAuth(true))}
        onOpenAuth={() => setShowAuth(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-8">
        {/* Safety Disclaimer Banner */}
        <SafetyNoticeBanner />

        {/* ================= TAB 1: HOME ================= */}
        {currentTab === 'home' && (
          <div className="space-y-10 animate-fade-in">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">
                  PRECISION TARGETED TRAINING
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
                  What do you want to train today?
                </h1>
                <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
                  Select your target muscle on the anatomical body map, choose your available minutes, and train with strict purpose.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowGenerator(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 text-xs sm:text-sm uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  GENERATE CUSTOM ROUTINE
                </button>
              </div>
            </div>

            {/* Interactive Anatomical Body Map */}
            <BodyMap
              selectedSpot={selectedSpot}
              onSelectSpot={(spot) => setSelectedSpot(spot)}
              onQuickStart={(spot) => handleQuickStartSpot(spot)}
            />

            {/* Today's Spot Recommendation Card */}
            {todaysWorkout && (
              <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      TODAY'S SPOT: {todaysSpot.toUpperCase().replace(/_/g, ' ')}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {todaysWorkout.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                      {todaysWorkout.durationMinutes} minutes · {todaysWorkout.difficulty} · {todaysWorkout.equipment.join(', ')} · {todaysWorkout.exercises.length} structured exercises
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActivePreviewWorkout(todaysWorkout)}
                      className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 transition-colors"
                    >
                      PREVIEW
                    </button>
                    <button
                      onClick={() => setActiveLiveWorkout(todaysWorkout)}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      START TODAY'S SPOT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick 5-Minute & Express Workouts Section */}
            <QuickWorkoutSection
              workouts={workouts}
              onStartWorkout={(w) => setActiveLiveWorkout(w)}
            />

            {/* Spot Training Categories Highlights */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Explore All Body Spots
                  </h2>
                  <p className="text-xs text-slate-400">
                    Targeted exercise collections for every muscle group
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('workouts')}
                  className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  View all workouts <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <SpotTrainingGrid
                workouts={workouts}
                onSelectSpot={(spot) => {
                  setSelectedSpot(spot);
                  setCurrentTab('bodymap');
                }}
                onSelectWorkout={(w) => setActivePreviewWorkout(w)}
              />
            </div>
          </div>
        )}

        {/* ================= TAB 2: WORKOUTS ================= */}
        {currentTab === 'workouts' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Spot-Training Workout Library
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Browse {workouts.length} targeted routines filtered by level, equipment, and duration.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowBuilder(true)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  CREATE CUSTOM WORKOUT
                </button>

                <button
                  onClick={() => setShowGenerator(true)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  GENERATE
                </button>
              </div>
            </div>

            {/* Custom Workouts Section if any exist */}
            {customWorkouts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  MY CUSTOM WORKOUTS ({customWorkouts.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {customWorkouts.map((cw) => (
                    <div
                      key={cw.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[11px] text-amber-400 uppercase font-semibold">
                          {cw.bodyArea} · {cw.difficulty}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{cw.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cw.description}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">{cw.exercises.length} exercises</span>
                        <button
                          onClick={() => {
                            const asWorkout: Workout = {
                              id: cw.id,
                              title: cw.title,
                              description: cw.description,
                              bodyArea: cw.bodyArea,
                              secondaryAreas: [],
                              difficulty: cw.difficulty,
                              durationMinutes: 15,
                              equipment: cw.equipment,
                              trainingStyle: 'strength',
                              intensity: 'moderate',
                              tags: ['custom'],
                              exercises: cw.exercises
                            };
                            setActiveLiveWorkout(asWorkout);
                          }}
                          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                        >
                          <Play className="w-3 h-3 fill-slate-950" /> START
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <SpotTrainingGrid
              workouts={workouts}
              onSelectSpot={(spot) => setSelectedSpot(spot)}
              onSelectWorkout={(w) => setActivePreviewWorkout(w)}
            />
          </div>
        )}

        {/* ================= TAB 3: BODY MAP EXPLORER ================= */}
        {currentTab === 'bodymap' && (
          <div className="space-y-6 animate-fade-in">
            <BodyMap
              selectedSpot={selectedSpot}
              onSelectSpot={(spot) => setSelectedSpot(spot)}
              onQuickStart={(spot) => handleQuickStartSpot(spot)}
            />

            {/* Exercises for Currently Selected Spot */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight capitalize">
                    {selectedSpot.replace(/_/g, ' ')} Exercises & Drills
                  </h3>
                  <p className="text-xs text-slate-400">
                    Step-by-step instructions and muscle targets for {selectedSpot.replace(/_/g, ' ')}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {exercises
                  .filter((e) => {
                    if (selectedSpot === 'abs') {
                      return ['abs', 'upper_abs', 'lower_abs', 'obliques', 'waist_core'].includes(e.bodyArea);
                    }
                    if (selectedSpot === 'arms') {
                      return ['arms', 'biceps', 'triceps'].includes(e.bodyArea);
                    }
                    if (selectedSpot === 'thighs') {
                      return ['thighs', 'hamstrings', 'calves'].includes(e.bodyArea);
                    }
                    return e.bodyArea === selectedSpot;
                  })
                  .slice(0, 12)
                  .map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => setActiveDetailExercise(ex)}
                      className="bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="uppercase text-amber-400 font-semibold">{ex.bodyArea}</span>
                          <span className="capitalize">{ex.difficulty}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {ex.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {ex.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                        <span className="capitalize">{ex.equipment.replace(/_/g, ' ')}</span>
                        <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                          Details →
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PROGRESS ================= */}
        {currentTab === 'progress' && progressSummary && (
          <ProgressDashboard
            summary={progressSummary}
            onSelectRestDayMobility={() => {
              const mobWorkout = workouts.find((w) => w.bodyArea === 'mobility') || workouts[0];
              setActiveLiveWorkout(mobWorkout);
            }}
          />
        )}

        {/* ================= TAB 5: FAVORITES ================= */}
        {currentTab === 'favorites' && (
          <FavoritesView
            favoriteExercises={favoriteExercises}
            favoriteWorkouts={favoriteWorkouts}
            onSelectExercise={(ex) => setActiveDetailExercise(ex)}
            onSelectWorkout={(w) => setActivePreviewWorkout(w)}
            onRemoveFavoriteExercise={handleToggleFavoriteExercise}
            onRemoveFavoriteWorkout={handleToggleFavoriteWorkout}
            onExploreExercises={() => setCurrentTab('bodymap')}
          />
        )}

        {/* ================= TAB 6: HISTORY ================= */}
        {currentTab === 'history' && (
          <WorkoutHistoryView
            history={history}
            onRepeatWorkout={(item) => {
              const matching = workouts.find((w) => w.id === item.workoutId) || {
                id: item.workoutId,
                title: item.workoutTitle,
                description: 'Repeat session from workout history.',
                bodyArea: item.bodyArea,
                secondaryAreas: [],
                difficulty: 'intermediate',
                durationMinutes: Math.round(item.durationSeconds / 60) || 15,
                equipment: ['none'],
                trainingStyle: 'strength',
                intensity: 'moderate',
                tags: ['repeat'],
                exercises: item.completedExercises.map((e, idx) => ({
                  exerciseId: e.exerciseId,
                  sets: e.setsCompleted || 3,
                  reps: e.repsCompleted || 12,
                  durationSeconds: e.durationSeconds || 30,
                  restSeconds: 30,
                  order: idx + 1
                }))
              };
              setActiveLiveWorkout(matching);
            }}
            onStartNewWorkout={() => setShowGenerator(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
        onOpenGenerator={() => setShowGenerator(true)}
        onOpenAICoach={() => setShowAICoach(true)}
      />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Live Interactive Workout Player */}
      {activeLiveWorkout && (
        <LiveWorkoutModal
          workout={activeLiveWorkout}
          exercises={exercises}
          onClose={() => setActiveLiveWorkout(null)}
          onSaveCompleted={handleSaveCompletedWorkout}
          onViewProgress={() => {
            setActiveLiveWorkout(null);
            setCurrentTab('progress');
          }}
        />
      )}

      {/* Workout Preview Modal */}
      {activePreviewWorkout && (
        <WorkoutPreviewModal
          workout={activePreviewWorkout}
          exercises={exercises}
          isFavorited={favoriteWorkouts.some((w) => w.id === activePreviewWorkout.id)}
          onClose={() => setActivePreviewWorkout(null)}
          onStartWorkout={(w) => {
            setActivePreviewWorkout(null);
            setActiveLiveWorkout(w);
          }}
          onToggleFavorite={handleToggleFavoriteWorkout}
          onSelectExercise={(ex) => setActiveDetailExercise(ex)}
          onCustomize={(w) => {
            setActivePreviewWorkout(null);
            setShowBuilder(true);
          }}
        />
      )}

      {/* Exercise Detail Modal */}
      {activeDetailExercise && (
        <ExerciseDetailModal
          exercise={activeDetailExercise}
          isFavorited={favoriteExercises.some((e) => e.id === activeDetailExercise.id)}
          onClose={() => setActiveDetailExercise(null)}
          onToggleFavorite={handleToggleFavoriteExercise}
          onStartSingleExerciseWorkout={(ex) => {
            const singleWorkout: Workout = {
              id: `wo-single-${Date.now()}`,
              title: `${ex.name} Focus`,
              description: ex.description,
              bodyArea: ex.bodyArea,
              secondaryAreas: [],
              difficulty: ex.difficulty,
              durationMinutes: 5,
              equipment: [ex.equipment],
              trainingStyle: 'strength',
              intensity: 'moderate',
              tags: ['single-exercise'],
              exercises: [
                {
                  exerciseId: ex.id,
                  sets: ex.defaultSets,
                  reps: ex.defaultReps,
                  durationSeconds: ex.duration,
                  restSeconds: ex.defaultRest,
                  order: 1
                }
              ]
            };
            setActiveDetailExercise(null);
            setActiveLiveWorkout(singleWorkout);
          }}
        />
      )}

      {/* Workout Generator Modal */}
      {showGenerator && (
        <WorkoutGeneratorModal
          initialSpot={selectedSpot}
          onClose={() => setShowGenerator(false)}
          onWorkoutGenerated={(wo) => {
            setWorkouts((prev) => [wo, ...prev]);
          }}
          onStartWorkout={(wo) => {
            setShowGenerator(false);
            setActiveLiveWorkout(wo);
          }}
        />
      )}

      {/* Custom Workout Builder Modal */}
      {showBuilder && (
        <CustomWorkoutBuilder
          exercises={exercises}
          onClose={() => setShowBuilder(false)}
          onSaved={(newCustom) => {
            setCustomWorkouts((prev) => [newCustom, ...prev]);
          }}
        />
      )}

      {/* AI Coach Drawer */}
      <AICoachDrawer
        isOpen={showAICoach}
        onClose={() => setShowAICoach(false)}
        onStartWorkout={(wo) => {
          setShowAICoach(false);
          setActiveLiveWorkout(wo);
        }}
      />

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfileModal
          onClose={() => setShowProfile(false)}
          onOpenAdmin={() => setShowAdmin(true)}
        />
      )}

      {/* Admin Dashboard Console Modal */}
      {showAdmin && (
        <AdminDashboardModal
          exercises={exercises}
          workouts={workouts}
          onClose={() => setShowAdmin(false)}
          onRefreshData={loadAppData}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
