import React from 'react';
import { Workout, Exercise } from '../types/index.js';
import {
  X,
  Play,
  Bookmark,
  Sliders,
  Clock,
  Dumbbell,
  CheckCircle,
  ShieldCheck,
  Flame,
  ChevronRight
} from 'lucide-react';

interface WorkoutPreviewModalProps {
  workout: Workout;
  exercises: Exercise[];
  isFavorited?: boolean;
  onClose: () => void;
  onStartWorkout: (workout: Workout) => void;
  onToggleFavorite?: (workoutId: string) => void;
  onCustomize?: (workout: Workout) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const WorkoutPreviewModal: React.FC<WorkoutPreviewModalProps> = ({
  workout,
  exercises,
  isFavorited = false,
  onClose,
  onStartWorkout,
  onToggleFavorite,
  onCustomize,
  onSelectExercise
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">
              {workout.bodyArea.replace(/_/g, ' ')} WORKOUT
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              {workout.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(workout.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isFavorited
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
            <div>
              <div className="text-[11px] text-slate-500">Duration</div>
              <div className="text-xs sm:text-sm font-semibold text-white mt-0.5 font-mono">
                {workout.durationMinutes} min
              </div>
            </div>
            <div className="border-l border-slate-800/80">
              <div className="text-[11px] text-slate-500">Level</div>
              <div className="text-xs sm:text-sm font-semibold text-white capitalize mt-0.5">
                {workout.difficulty}
              </div>
            </div>
            <div className="border-l border-slate-800/80">
              <div className="text-[11px] text-slate-500">Equipment</div>
              <div className="text-xs sm:text-sm font-semibold text-white capitalize mt-0.5 truncate">
                {workout.equipment.join(', ').replace(/_/g, ' ')}
              </div>
            </div>
            <div className="border-l border-slate-800/80">
              <div className="text-[11px] text-slate-500">Exercises</div>
              <div className="text-xs sm:text-sm font-semibold text-white mt-0.5 font-mono">
                {workout.exercises.length}
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {workout.description}
          </p>

          {/* Warmup Section */}
          {workout.warmup && workout.warmup.length > 0 && (
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Warm-Up Preparation (2 Minutes)
              </h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {workout.warmup.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Workout Exercises */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Main Workout ({workout.exercises.length} Exercises)
            </h3>

            <div className="space-y-2.5">
              {workout.exercises.map((item, idx) => {
                const ex = exercises.find((e) => e.id === item.exerciseId);
                return (
                  <div
                    key={idx}
                    onClick={() => ex && onSelectExercise(ex)}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {ex?.name || item.exerciseId}
                        </h4>
                        <div className="text-[11px] text-slate-500 capitalize">
                          {ex?.targetMuscles.slice(0, 2).join(', ')} · Rest: {item.restSeconds}s
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-300">
                        {item.sets} sets × {item.durationSeconds ? `${item.durationSeconds}s` : `${item.reps} reps`}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooldown Section */}
          {workout.cooldown && workout.cooldown.length > 0 && (
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Cool-Down & Recovery (2 Minutes)
              </h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {workout.cooldown.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Principle Reminder */}
          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Targeting this spot stimulates local neuromuscular recruitment and endurance. Exercise cannot guarantee that fat will be lost exclusively from this single area.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          {onCustomize && (
            <button
              onClick={() => {
                onClose();
                onCustomize(workout);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              CUSTOMIZE
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onStartWorkout(workout);
            }}
            className="ml-auto flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            START WORKOUT
          </button>
        </div>
      </div>
    </div>
  );
};
