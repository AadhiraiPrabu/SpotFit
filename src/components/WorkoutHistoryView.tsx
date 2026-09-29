import React from 'react';
import { CompletedWorkout } from '../types/index.js';
import {
  Calendar,
  Clock,
  Flame,
  CheckCircle,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface WorkoutHistoryViewProps {
  history: CompletedWorkout[];
  onRepeatWorkout: (completed: CompletedWorkout) => void;
  onStartNewWorkout: () => void;
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({
  history,
  onRepeatWorkout,
  onStartNewWorkout
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Workout History & Activity Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Chronological record of every session trained with SpotFit.
          </p>
        </div>

        <button
          onClick={onStartNewWorkout}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0 shadow-sm"
        >
          START A WORKOUT
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No workouts completed yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Your first workout is waiting. Complete a session to see your timeline and personal records here.
          </p>
          <button
            onClick={onStartNewWorkout}
            className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20"
          >
            START FIRST WORKOUT
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const dateObj = new Date(item.completedAt);
            const dateFormatted = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const timeFormatted = dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-amber-400 uppercase tracking-wider">
                      {item.bodyArea.replace(/_/g, ' ')}
                    </span>
                    <span>·</span>
                    <span>{dateFormatted} at {timeFormatted}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {item.workoutTitle}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {Math.round(item.durationSeconds / 60)} min
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                      {item.completedExercises?.length || 4} exercises ({item.totalSets} sets)
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {item.caloriesBurned} kcal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onRepeatWorkout(item)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    REPEAT WORKOUT
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
