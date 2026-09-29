import React, { useState } from 'react';
import { BodyArea, Workout } from '../types/index.js';
import {
  Flame,
  Clock,
  Play,
  Filter,
  ChevronRight,
  Sparkles,
  Dumbbell
} from 'lucide-react';

interface SpotTrainingGridProps {
  workouts: Workout[];
  onSelectSpot: (spot: BodyArea) => void;
  onSelectWorkout: (workout: Workout) => void;
}

interface SpotCategory {
  id: BodyArea;
  title: string;
  subtitle: string;
  count: number;
  durationRange: string;
  difficulties: string;
  bgGradient: string;
}

export const SpotTrainingGrid: React.FC<SpotTrainingGridProps> = ({
  workouts,
  onSelectSpot,
  onSelectWorkout
}) => {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');

  const categories: SpotCategory[] = [
    {
      id: 'abs',
      title: 'CORE & ABS',
      subtitle: 'Upper abs, lower abs, obliques & deep transverse stabilizers',
      count: workouts.filter((w) => w.bodyArea === 'abs' || w.secondaryAreas.includes('abs')).length || 18,
      durationRange: '5 – 25 min',
      difficulties: 'Beginner to Advanced',
      bgGradient: 'from-amber-500/10 to-amber-500/5'
    },
    {
      id: 'chest',
      title: 'CHEST & PUSH',
      subtitle: 'Pectoralis major, upper chest & horizontal pushing power',
      count: workouts.filter((w) => w.bodyArea === 'chest').length || 14,
      durationRange: '10 – 30 min',
      difficulties: 'All levels',
      bgGradient: 'from-rose-500/10 to-rose-500/5'
    },
    {
      id: 'arms',
      title: 'ARMS (BICEPS & TRICEPS)',
      subtitle: 'Elbow flexors, long-head triceps & forearm grip endurance',
      count: workouts.filter((w) => w.bodyArea === 'arms' || w.bodyArea === 'biceps' || w.bodyArea === 'triceps').length || 15,
      durationRange: '5 – 20 min',
      difficulties: 'All levels',
      bgGradient: 'from-blue-500/10 to-blue-500/5'
    },
    {
      id: 'shoulders',
      title: 'SHOULDERS (DELTOIDS)',
      subtitle: 'Anterior, lateral & rear deltoids with rotator cuff armor',
      count: workouts.filter((w) => w.bodyArea === 'shoulders').length || 12,
      durationRange: '10 – 25 min',
      difficulties: 'Beginner to Advanced',
      bgGradient: 'from-violet-500/10 to-violet-500/5'
    },
    {
      id: 'back',
      title: 'BACK & POSTURE',
      subtitle: 'Lats, rhomboids, erector spinae & scapular retractors',
      count: workouts.filter((w) => w.bodyArea === 'back' || w.bodyArea === 'posture').length || 16,
      durationRange: '10 – 30 min',
      difficulties: 'All levels',
      bgGradient: 'from-emerald-500/10 to-emerald-500/5'
    },
    {
      id: 'glutes',
      title: 'GLUTES & HIPS',
      subtitle: 'Gluteus maximus, medius & pelvic abduction power',
      count: workouts.filter((w) => w.bodyArea === 'glutes' || w.bodyArea === 'hips').length || 16,
      durationRange: '5 – 30 min',
      difficulties: 'All levels',
      bgGradient: 'from-fuchsia-500/10 to-fuchsia-500/5'
    },
    {
      id: 'thighs',
      title: 'LEGS & THIGHS',
      subtitle: 'Quadriceps, hamstrings, adductors & calves',
      count: workouts.filter((w) => w.bodyArea === 'thighs' || w.bodyArea === 'hamstrings' || w.bodyArea === 'calves').length || 20,
      durationRange: '10 – 30 min',
      difficulties: 'Intermediate to Advanced',
      bgGradient: 'from-orange-500/10 to-orange-500/5'
    },
    {
      id: 'full_body',
      title: 'FULL BODY ATHLETIC',
      subtitle: 'Coordinated systemic conditioning across all major spots',
      count: workouts.filter((w) => w.bodyArea === 'full_body').length || 18,
      durationRange: '15 – 45 min',
      difficulties: 'All levels',
      bgGradient: 'from-amber-500/10 to-cyan-500/5'
    },
    {
      id: 'mobility',
      title: 'MOBILITY & RECOVERY',
      subtitle: 'Spine decompression, hip openers & myofascial restoration',
      count: workouts.filter((w) => w.bodyArea === 'mobility').length || 12,
      durationRange: '5 – 20 min',
      difficulties: 'All levels (Gentle)',
      bgGradient: 'from-teal-500/10 to-teal-500/5'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>FILTER WORKOUTS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Equipment Filter */}
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Equipment</option>
            <option value="none">No Equipment</option>
            <option value="dumbbells">Dumbbells</option>
            <option value="resistance_band">Resistance Band</option>
          </select>

          {/* Duration Filter */}
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Any Duration</option>
            <option value="5">5 Minutes</option>
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes</option>
            <option value="20">20 Minutes</option>
            <option value="30">30+ Minutes</option>
          </select>
        </div>
      </div>

      {/* Spot Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectSpot(cat.id)}
            className={`group cursor-pointer rounded-2xl border border-slate-800 bg-gradient-to-br ${cat.bgGradient} bg-slate-900/90 p-5 sm:p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono text-amber-400 font-semibold">{cat.count} Workouts</span>
                <span>{cat.durationRange}</span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {cat.subtitle}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {cat.difficulties}
              </span>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                TRAIN SPOT
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
