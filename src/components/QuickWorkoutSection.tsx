import React, { useState } from 'react';
import { Workout } from '../types/index.js';
import {
  Zap,
  Clock,
  Play,
  Flame,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface QuickWorkoutSectionProps {
  workouts: Workout[];
  onStartWorkout: (workout: Workout) => void;
}

export const QuickWorkoutSection: React.FC<QuickWorkoutSectionProps> = ({
  workouts,
  onStartWorkout
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(5);

  const durationOptions = [5, 10, 15, 20, 30];

  const filteredWorkouts = workouts.filter((w) => {
    if (selectedTab === 5) return w.durationMinutes <= 5;
    if (selectedTab === 10) return w.durationMinutes > 5 && w.durationMinutes <= 10;
    if (selectedTab === 15) return w.durationMinutes > 10 && w.durationMinutes <= 15;
    if (selectedTab === 20) return w.durationMinutes > 15 && w.durationMinutes <= 20;
    return w.durationMinutes > 20;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {selectedTab === 5 ? '“I only have 5 minutes”' : `Express ${selectedTab}-Minute Routines`}
            </h2>
            <p className="text-xs text-slate-400">
              No prep needed. Targeted high-density sessions to keep your consistency alive.
            </p>
          </div>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
          {durationOptions.map((mins) => (
            <button
              key={mins}
              onClick={() => setSelectedTab(mins)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedTab === mins
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredWorkouts.slice(0, 6).map((wo) => (
          <div
            key={wo.id}
            className="group bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="uppercase font-semibold text-amber-400 tracking-wider">
                  {wo.bodyArea.replace(/_/g, ' ')}
                </span>
                <span className="font-mono text-slate-400">{wo.durationMinutes} min</span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                {wo.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {wo.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 capitalize">
                {wo.exercises.length} exercises · {wo.difficulty}
              </span>

              <button
                onClick={() => onStartWorkout(wo)}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                START
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
