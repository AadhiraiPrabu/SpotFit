import React, { useState, useEffect, useRef } from 'react';
import { Workout, Exercise, CompletedWorkout } from '../types/index.js';
import { soundFx } from '../utils/audio.js';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  CheckCircle,
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface LiveWorkoutModalProps {
  workout: Workout;
  exercises: Exercise[];
  onClose: () => void;
  onSaveCompleted: (completedLog: Partial<CompletedWorkout>) => Promise<void>;
  onViewProgress: () => void;
}

type WorkoutPhase = 'ready' | 'work' | 'rest' | 'finished';

export const LiveWorkoutModal: React.FC<LiveWorkoutModalProps> = ({
  workout,
  exercises,
  onClose,
  onSaveCompleted,
  onViewProgress
}) => {
  const [phase, setPhase] = useState<WorkoutPhase>('ready');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5); // ready countdown
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Track completed exercise logs
  const completedLogsRef = useRef<
    { exerciseId: string; exerciseName: string; setsCompleted: number; repsCompleted: number; durationSeconds: number }[]
  >([]);

  const workoutExerciseItems = workout.exercises || [];
  const currentItem = workoutExerciseItems[currentExerciseIndex];
  const currentExercise = exercises.find((e) => e.id === currentItem?.exerciseId) || exercises[0];

  const totalSetsForCurrent = currentItem?.sets || 3;
  const isTimedExercise = currentExercise?.exerciseType === 'time';
  const defaultDuration = currentItem?.durationSeconds || currentExercise?.duration || 30;
  const restDuration = currentItem?.restSeconds || 30;

  // Toggle sound
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  // Main Timer Tick Effect
  useEffect(() => {
    if (phase === 'finished' || isPaused) return;

    const timer = setInterval(() => {
      setTotalElapsedTime((prev) => prev + 1);

      setTimeLeft((prev) => {
        // Sound countdown for last 3 seconds
        if (prev <= 4 && prev > 1) {
          soundFx.playBeep(440, 0.1);
        } else if (prev === 1) {
          if (phase === 'ready' || phase === 'rest') {
            soundFx.playGo();
          } else if (phase === 'work') {
            soundFx.playRest();
          }
        }

        if (prev <= 1) {
          handleTimerExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, currentExerciseIndex, currentSet]);

  const handleTimerExpiry = () => {
    if (phase === 'ready') {
      // Transition from ready 5-sec countdown to first work set
      setPhase('work');
      setTimeLeft(isTimedExercise ? defaultDuration : 40);
    } else if (phase === 'work') {
      // Record completed set
      recordCurrentSet();

      // Check if more sets remain for this exercise
      if (currentSet < totalSetsForCurrent) {
        setPhase('rest');
        setTimeLeft(restDuration);
      } else {
        // Move to next exercise or finish
        if (currentExerciseIndex < workoutExerciseItems.length - 1) {
          setPhase('rest');
          setTimeLeft(restDuration);
        } else {
          // Workout finished!
          finishWorkout();
        }
      }
    } else if (phase === 'rest') {
      // Transition from rest back to work
      if (currentSet < totalSetsForCurrent) {
        setCurrentSet((prev) => prev + 1);
        setPhase('work');
        setTimeLeft(isTimedExercise ? defaultDuration : 40);
      } else {
        // Next exercise
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        setPhase('work');
        const nextItem = workoutExerciseItems[currentExerciseIndex + 1];
        const nextEx = exercises.find((e) => e.id === nextItem?.exerciseId);
        setTimeLeft(nextEx?.exerciseType === 'time' ? nextEx?.duration || 30 : 40);
      }
    }
  };

  const recordCurrentSet = () => {
    const existing = completedLogsRef.current.find((l) => l.exerciseId === currentExercise.id);
    const setReps = currentExercise.exerciseType === 'reps' ? currentItem?.reps || currentExercise.defaultReps : 1;
    const setSecs = isTimedExercise ? defaultDuration : 30;

    if (existing) {
      existing.setsCompleted += 1;
      existing.repsCompleted += setReps;
      existing.durationSeconds += setSecs;
    } else {
      completedLogsRef.current.push({
        exerciseId: currentExercise.id,
        exerciseName: currentExercise.name,
        setsCompleted: 1,
        repsCompleted: setReps,
        durationSeconds: setSecs
      });
    }
  };

  const finishWorkout = () => {
    setPhase('finished');
    soundFx.playVictory();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore in non-canvas environment
    }
  };

  const handleNext = () => {
    if (phase === 'work') {
      recordCurrentSet();
    }
    if (currentSet < totalSetsForCurrent) {
      setCurrentSet((s) => s + 1);
      setPhase('work');
      setTimeLeft(isTimedExercise ? defaultDuration : 40);
    } else if (currentExerciseIndex < workoutExerciseItems.length - 1) {
      setCurrentExerciseIndex((i) => i + 1);
      setCurrentSet(1);
      setPhase('work');
      const nextItem = workoutExerciseItems[currentExerciseIndex + 1];
      const nextEx = exercises.find((e) => e.id === nextItem?.exerciseId);
      setTimeLeft(nextEx?.exerciseType === 'time' ? nextEx?.duration || 30 : 40);
    } else {
      finishWorkout();
    }
  };

  const handlePrev = () => {
    if (currentSet > 1) {
      setCurrentSet((s) => s - 1);
      setPhase('work');
      setTimeLeft(isTimedExercise ? defaultDuration : 40);
    } else if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((i) => i - 1);
      const prevItem = workoutExerciseItems[currentExerciseIndex - 1];
      setCurrentSet(prevItem.sets);
      setPhase('work');
      const prevEx = exercises.find((e) => e.id === prevItem.exerciseId);
      setTimeLeft(prevEx?.exerciseType === 'time' ? prevEx?.duration || 30 : 40);
    }
  };

  // Calculate workout summary statistics
  const totalSetsDone = completedLogsRef.current.reduce((sum, item) => sum + item.setsCompleted, 0);
  const totalRepsDone = completedLogsRef.current.reduce((sum, item) => sum + item.repsCompleted, 0);
  const totalCalories = Math.round((totalElapsedTime / 60) * (currentExercise.calorieEstimate || 6));

  const handleSaveResult = async () => {
    if (isSaving || isSaved) return;
    setIsSaving(true);
    try {
      await onSaveCompleted({
        workoutId: workout.id,
        workoutTitle: workout.title,
        bodyArea: workout.bodyArea,
        durationSeconds: totalElapsedTime,
        totalSets: totalSetsDone || 1,
        totalReps: totalRepsDone || 1,
        caloriesBurned: totalCalories,
        completedExercises: completedLogsRef.current
      });
      setIsSaved(true);
    } catch (e) {
      console.error('Failed to save workout completion:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Circular progress calculations
  const maxTimer = phase === 'work' ? (isTimedExercise ? defaultDuration : 40) : phase === 'rest' ? restDuration : 5;
  const progressPercent = Math.max(0, Math.min(100, ((maxTimer - timeLeft) / maxTimer) * 100));
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 max-w-5xl mx-auto w-full">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">
            {workout.bodyArea.replace(/_/g, ' ')} TARGET TRAINING
          </span>
          <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
            {workout.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            aria-label="Close workout session"
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-3xl mx-auto w-full">
        {phase === 'finished' ? (
          // ================= FINISHED SCREEN =================
          <div className="w-full text-center py-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/20">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Workout Complete! 🎉
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Outstanding consistency. Your targeted muscle fibers were trained with purpose.
            </p>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-center text-amber-400 mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {Math.floor(totalElapsedTime / 60)}:{(totalElapsedTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-500 mt-1">Duration</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-center text-amber-400 mb-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {completedLogsRef.current.length}
                </div>
                <div className="text-xs text-slate-500 mt-1">Exercises</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-center text-amber-400 mb-1">
                  <Sparkles className="w-4 h-4 mr-1" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalSetsDone}
                </div>
                <div className="text-xs text-slate-500 mt-1">Sets Completed</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-center text-amber-400 mb-1">
                  <Flame className="w-4 h-4 mr-1" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalCalories}
                </div>
                <div className="text-xs text-slate-500 mt-1">Est. Calories</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              {!isSaved ? (
                <button
                  onClick={handleSaveResult}
                  disabled={isSaving}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  {isSaving ? 'SAVING PROGRESS...' : 'SAVE RESULT'}
                </button>
              ) : (
                <button
                  onClick={onViewProgress}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all"
                >
                  VIEW IN PROGRESS DASHBOARD
                </button>
              )}

              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl border border-slate-700 transition-colors"
              >
                BACK TO DASHBOARD
              </button>
            </div>
          </div>
        ) : phase === 'ready' ? (
          // ================= READY COUNTDOWN =================
          <div className="text-center py-10 animate-fade-in">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">GET READY</span>
            <div className="text-7xl sm:text-8xl font-black text-white my-6 font-mono">
              {timeLeft}
            </div>
            <div className="text-lg font-bold text-slate-200">
              First up: {currentExercise.name}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Target: {currentExercise.targetMuscles.join(', ')}
            </p>
          </div>
        ) : (
          // ================= ACTIVE WORKOUT / REST SCREEN =================
          <div className="w-full flex flex-col items-center">
            {/* Phase Banner */}
            <div className="flex items-center gap-2 mb-3">
              {phase === 'work' ? (
                <span className="bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  SET {currentSet} OF {totalSetsForCurrent}
                </span>
              ) : (
                <span className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  REST INTERVAL
                </span>
              )}
              <span className="text-xs text-slate-400">
                Exercise {currentExerciseIndex + 1} of {workoutExerciseItems.length}
              </span>
            </div>

            {/* Exercise Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight mb-1">
              {phase === 'work' ? currentExercise.name : `Rest Before Set ${currentSet + 1 > totalSetsForCurrent ? 1 : currentSet + 1}`}
            </h2>
            <p className="text-xs text-slate-400 text-center mb-6">
              {phase === 'work'
                ? `Targets ${currentExercise.targetMuscles.join(', ')}`
                : 'Take deep breaths. Your next set is coming up.'}
            </p>

            {/* Large Circular Countdown Timer */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-slate-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className={`${phase === 'work' ? 'stroke-amber-500' : 'stroke-cyan-400'} transition-all duration-1000 ease-linear`}
                  strokeWidth="6"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tighter">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                  {phase === 'work' ? (isTimedExercise ? 'REMAINING' : `${currentItem?.reps || 12} REPS`) : 'RECOVER'}
                </span>
              </div>
            </div>

            {/* Safety & Form Tip */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 max-w-md w-full mt-4 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">
                {currentExercise.safetyNotes[0] || 'Maintain neutral spine and controlled breathing.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      {phase !== 'finished' && phase !== 'ready' && (
        <div className="p-4 sm:p-6 border-t border-slate-800/80 max-w-2xl mx-auto w-full flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            aria-label="Previous set or exercise"
            className="p-3 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 text-sm uppercase tracking-wider"
          >
            {isPaused ? <Play className="w-5 h-5 fill-slate-950" /> : <Pause className="w-5 h-5 fill-slate-950" />}
            {isPaused ? 'RESUME WORKOUT' : 'PAUSE'}
          </button>

          <button
            onClick={handleNext}
            aria-label="Skip to next set or exercise"
            className="p-3 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
