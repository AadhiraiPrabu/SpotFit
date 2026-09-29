import React, { useState } from 'react';
import { ProgressSummary, Achievement } from '../types/index.js';
import {
  Trophy,
  Flame,
  Clock,
  Dumbbell,
  CheckCircle,
  Award,
  Sparkles,
  Zap,
  Coffee,
  Heart,
  Calendar,
  Compass,
  Crown
} from 'lucide-react';

interface ProgressDashboardProps {
  summary: ProgressSummary;
  onSelectRestDayMobility: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  summary,
  onSelectRestDayMobility
}) => {
  const [restDayMarked, setRestDayMarked] = useState(false);

  // Map icon strings to Lucide components
  const renderAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}` };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      default:
        return <CheckCircle {...props} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner & Rest Day Logger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Training Progress & Consistency
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real data tracking your spot training volume, frequency, and achievements.
          </p>
        </div>

        {/* Rest Day Button */}
        {!restDayMarked ? (
          <button
            onClick={() => setRestDayMarked(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors shrink-0"
          >
            <Coffee className="w-4 h-4 text-cyan-400" />
            MARK TODAY AS REST DAY
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs px-3.5 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>Rest Day Logged · Recovery in progress</span>
          </div>
        )}
      </div>

      {/* Rest Day Supportive Notice */}
      {restDayMarked && (
        <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/50 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-cyan-300">Active Recovery: </span>
            Muscles grow and repair during rest. Would you like a light 5-minute mobility or breathing routine?
          </div>
          <button
            onClick={onSelectRestDayMobility}
            className="text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 px-3.5 py-1.5 rounded-lg transition-colors shrink-0"
          >
            START 5-MIN MOBILITY
          </button>
        </div>
      )}

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Total Sessions</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {summary.workoutsCompleted}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Targeted sessions finished</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Time Trained</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {summary.totalWorkoutMinutes} <span className="text-sm font-normal text-slate-400">min</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total minutes active</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            {summary.currentStreak} <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Longest: {summary.longestStreak} days</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Sets & Reps</span>
            <Dumbbell className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {summary.setsCompleted}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{summary.repsCompleted} total repetitions</div>
        </div>
      </div>

      {/* Visual Charts: Weekly Activity & Body-Area Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Consistency Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Weekly Training Consistency
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Active minutes logged over the last 7 days</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              7-Day View
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800/80">
            {summary.weeklyActivity.map((day, idx) => {
              const maxMinutes = 45;
              const barHeight = Math.min(100, Math.max(12, (day.minutes / maxMinutes) * 100));
              const isToday = idx === summary.weeklyActivity.length - 1;

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.minutes}m
                  </span>
                  <div
                    style={{ height: `${day.minutes > 0 ? barHeight : 8}%` }}
                    className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                      day.minutes > 0
                        ? isToday
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-amber-500/80 hover:bg-amber-400'
                        : 'bg-slate-800/40'
                    }`}
                  />
                  <span className={`text-[11px] font-semibold mt-1 ${isToday ? 'text-amber-400' : 'text-slate-500'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Area Distribution */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Body-Area Focus Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Muscles targeted across completed workouts</p>
            </div>
          </div>

          {summary.bodyAreaDistribution.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              Complete your first workout to see muscle breakdown.
            </div>
          ) : (
            <div className="space-y-3">
              {summary.bodyAreaDistribution.map((item) => (
                <div key={item.area} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 capitalize">
                      {item.area.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 font-mono">{item.percentage}% ({item.count} sessions)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Consistency & Milestones Badges
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rewarding dedication, habit formation, and movement variety.
            </p>
          </div>
          <span className="text-xs text-amber-400 font-mono">
            {summary.achievements.filter((a) => a.unlockedAt).length} / {summary.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-amber-500/40 text-slate-200'
                    : 'bg-slate-950/30 border-slate-800/60 opacity-60 text-slate-500'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isUnlocked ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {renderAchievementIcon(ach.icon, isUnlocked)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
