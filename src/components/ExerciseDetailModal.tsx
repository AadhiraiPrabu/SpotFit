import React, { useState } from 'react';
import { Exercise } from '../types/index.js';
import {
  X,
  Heart,
  Play,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isFavorited?: boolean;
  onClose: () => void;
  onToggleFavorite?: (exerciseId: string) => void;
  onStartSingleExerciseWorkout?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isFavorited = false,
  onClose,
  onToggleFavorite,
  onStartSingleExerciseWorkout
}) => {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavoriteClick = () => {
    setFavorited(!favorited);
    if (onToggleFavorite) {
      onToggleFavorite(exercise.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">
              {exercise.bodyArea.replace(/_/g, ' ')} · {exercise.difficulty}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              {exercise.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              aria-label="Toggle favorite"
              className={`p-2 rounded-xl border transition-all ${
                favorited
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
            <div>
              <div className="text-xs text-slate-500">Equipment</div>
              <div className="text-sm font-semibold text-white capitalize mt-0.5">
                {exercise.equipment.replace(/_/g, ' ')}
              </div>
            </div>
            <div className="border-x border-slate-800/80">
              <div className="text-xs text-slate-500">Recommended</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {exercise.defaultSets} × {exercise.exerciseType === 'reps' ? `${exercise.defaultReps} reps` : `${exercise.duration}s`}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Rest</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {exercise.defaultRest}s
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Target Muscles */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Muscles Involved
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Primary:</span>
                <span className="text-white font-medium">{exercise.targetMuscles.join(', ')}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Secondary:</span>
                <span className="text-slate-300">{exercise.secondaryMuscles.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* How to Perform */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              How to Perform
            </h3>
            <ol className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-mono text-xs shrink-0 font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Common Mistakes */}
          <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              Common Mistakes to Avoid
            </div>
            <ul className="space-y-1.5 text-xs text-rose-200/90 list-disc list-inside">
              {exercise.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </div>

          {/* Modifications & Progression */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Beginner Modification
              </div>
              <p className="text-xs text-slate-300">
                {exercise.beginnerModification}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <TrendingUp className="w-4 h-4" />
                Progression
              </div>
              <p className="text-xs text-slate-300">
                {exercise.progression}
              </p>
            </div>
          </div>

          {/* Safety Notes */}
          {exercise.safetyNotes?.length > 0 && (
            <div className="text-xs text-slate-400 flex items-start gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>{exercise.safetyNotes[0]}</p>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        {onStartSingleExerciseWorkout && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
            <button
              onClick={() => onStartSingleExerciseWorkout(exercise)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 text-xs sm:text-sm uppercase tracking-wider"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              START QUICK EXERCISE SESSION
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
