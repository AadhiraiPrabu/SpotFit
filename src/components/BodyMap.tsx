import React, { useState } from 'react';
import { BodyArea } from '../types/index.js';
import { Flame, Dumbbell, Play, ChevronRight, Info } from 'lucide-react';

interface BodyMapProps {
  selectedSpot: BodyArea | null;
  onSelectSpot: (spot: BodyArea) => void;
  onQuickStart: (spot: BodyArea) => void;
}

interface MuscleRegion {
  id: string;
  name: string;
  spot: BodyArea;
  side: 'front' | 'back' | 'both';
  path: string;
  count: number;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedSpot,
  onSelectSpot,
  onQuickStart
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hovered, setHovered] = useState<string | null>(null);

  // Anatomical SVG regions designed for clear interactive tap targets
  const frontRegions: MuscleRegion[] = [
    // Chest
    {
      id: 'm-chest-left',
      name: 'Pectorals (Chest)',
      spot: 'chest',
      side: 'front',
      path: 'M 118 100 C 132 98, 142 108, 146 122 C 138 128, 122 130, 114 122 C 112 112, 114 104, 118 100 Z',
      count: 14
    },
    {
      id: 'm-chest-right',
      name: 'Pectorals (Chest)',
      spot: 'chest',
      side: 'front',
      path: 'M 162 100 C 148 98, 138 108, 134 122 C 142 128, 158 130, 166 122 C 168 112, 166 104, 162 100 Z',
      count: 14
    },
    // Shoulders
    {
      id: 'm-shoulder-left',
      name: 'Deltoids (Shoulders)',
      spot: 'shoulders',
      side: 'front',
      path: 'M 104 96 C 114 96, 118 106, 114 118 C 104 124, 96 112, 100 102 Z',
      count: 12
    },
    {
      id: 'm-shoulder-right',
      name: 'Deltoids (Shoulders)',
      spot: 'shoulders',
      side: 'front',
      path: 'M 176 96 C 166 96, 162 106, 166 118 C 176 124, 184 112, 180 102 Z',
      count: 12
    },
    // Biceps / Arms
    {
      id: 'm-bicep-left',
      name: 'Biceps & Upper Arm',
      spot: 'biceps',
      side: 'front',
      path: 'M 98 122 C 108 124, 108 144, 98 152 C 92 144, 92 128, 98 122 Z',
      count: 10
    },
    {
      id: 'm-bicep-right',
      name: 'Biceps & Upper Arm',
      spot: 'biceps',
      side: 'front',
      path: 'M 182 122 C 172 124, 172 144, 182 152 C 188 144, 188 128, 182 122 Z',
      count: 10
    },
    // Abs / Core
    {
      id: 'm-abs-upper',
      name: 'Upper Abs',
      spot: 'upper_abs',
      side: 'front',
      path: 'M 132 126 C 138 126, 142 126, 148 126 C 148 142, 132 142, 132 126 Z',
      count: 12
    },
    {
      id: 'm-abs-lower',
      name: 'Lower Abs',
      spot: 'lower_abs',
      side: 'front',
      path: 'M 132 144 C 148 144, 148 164, 140 172 C 132 164, 132 144, 132 144 Z',
      count: 14
    },
    // Obliques
    {
      id: 'm-obliques-left',
      name: 'External Obliques',
      spot: 'obliques',
      side: 'front',
      path: 'M 120 132 C 130 132, 130 162, 124 168 C 118 158, 116 142, 120 132 Z',
      count: 15
    },
    {
      id: 'm-obliques-right',
      name: 'External Obliques',
      spot: 'obliques',
      side: 'front',
      path: 'M 160 132 C 150 132, 150 162, 156 168 C 162 158, 164 142, 160 132 Z',
      count: 15
    },
    // Quads / Thighs
    {
      id: 'm-quad-left',
      name: 'Quadriceps (Thighs)',
      spot: 'thighs',
      side: 'front',
      path: 'M 122 178 C 136 178, 134 230, 126 238 C 116 230, 114 186, 122 178 Z',
      count: 18
    },
    {
      id: 'm-quad-right',
      name: 'Quadriceps (Thighs)',
      spot: 'thighs',
      side: 'front',
      path: 'M 158 178 C 144 178, 146 230, 154 238 C 164 230, 166 186, 158 178 Z',
      count: 18
    },
    // Calves
    {
      id: 'm-calves-front-left',
      name: 'Calves & Shins',
      spot: 'calves',
      side: 'front',
      path: 'M 124 250 C 132 250, 130 292, 124 300 C 118 292, 118 258, 124 250 Z',
      count: 8
    },
    {
      id: 'm-calves-front-right',
      name: 'Calves & Shins',
      spot: 'calves',
      side: 'front',
      path: 'M 156 250 C 148 250, 150 292, 156 300 C 162 292, 162 258, 156 250 Z',
      count: 8
    }
  ];

  const backRegions: MuscleRegion[] = [
    // Trapezius / Neck
    {
      id: 'm-traps',
      name: 'Trapezius & Upper Back',
      spot: 'back',
      side: 'back',
      path: 'M 124 82 C 140 76, 156 82, 166 94 C 150 102, 130 102, 114 94 Z',
      count: 14
    },
    // Rear Deltoids
    {
      id: 'm-back-shoulders-l',
      name: 'Rear Deltoids',
      spot: 'shoulders',
      side: 'back',
      path: 'M 104 96 C 114 96, 118 106, 114 118 C 104 124, 96 112, 100 102 Z',
      count: 12
    },
    {
      id: 'm-back-shoulders-r',
      name: 'Rear Deltoids',
      spot: 'shoulders',
      side: 'back',
      path: 'M 176 96 C 166 96, 162 106, 166 118 C 176 124, 184 112, 180 102 Z',
      count: 12
    },
    // Triceps
    {
      id: 'm-tricep-left',
      name: 'Triceps',
      spot: 'triceps',
      side: 'back',
      path: 'M 96 122 C 106 124, 106 148, 96 154 C 90 146, 90 128, 96 122 Z',
      count: 10
    },
    {
      id: 'm-tricep-right',
      name: 'Triceps',
      spot: 'triceps',
      side: 'back',
      path: 'M 184 122 C 174 124, 174 148, 184 154 C 190 146, 190 128, 184 122 Z',
      count: 10
    },
    // Upper / Middle Back & Lats
    {
      id: 'm-lats-left',
      name: 'Latissimus Dorsi (Lats)',
      spot: 'back',
      side: 'back',
      path: 'M 116 108 C 132 104, 136 142, 122 152 C 114 138, 112 122, 116 108 Z',
      count: 14
    },
    {
      id: 'm-lats-right',
      name: 'Latissimus Dorsi (Lats)',
      spot: 'back',
      side: 'back',
      path: 'M 164 108 C 148 104, 144 142, 158 152 C 166 138, 168 122, 164 108 Z',
      count: 14
    },
    // Glutes
    {
      id: 'm-glute-left',
      name: 'Gluteus Maximus (Glutes)',
      spot: 'glutes',
      side: 'back',
      path: 'M 122 168 C 138 168, 138 198, 124 204 C 114 196, 114 176, 122 168 Z',
      count: 16
    },
    {
      id: 'm-glute-right',
      name: 'Gluteus Maximus (Glutes)',
      spot: 'glutes',
      side: 'back',
      path: 'M 158 168 C 142 168, 142 198, 156 204 C 166 196, 166 176, 158 168 Z',
      count: 16
    },
    // Hamstrings
    {
      id: 'm-hamstrings-left',
      name: 'Hamstrings',
      spot: 'hamstrings',
      side: 'back',
      path: 'M 124 208 C 136 208, 134 240, 126 244 C 118 238, 116 216, 124 208 Z',
      count: 12
    },
    {
      id: 'm-hamstrings-right',
      name: 'Hamstrings',
      spot: 'hamstrings',
      side: 'back',
      path: 'M 156 208 C 144 208, 146 240, 154 244 C 162 238, 164 216, 156 208 Z',
      count: 12
    },
    // Calves
    {
      id: 'm-calves-left',
      name: 'Gastrocnemius (Calves)',
      spot: 'calves',
      side: 'back',
      path: 'M 124 252 C 134 252, 132 292, 124 298 C 116 290, 116 260, 124 252 Z',
      count: 8
    },
    {
      id: 'm-calves-right',
      name: 'Gastrocnemius (Calves)',
      spot: 'calves',
      side: 'back',
      path: 'M 156 252 C 146 252, 148 292, 156 298 C 164 290, 164 260, 156 252 Z',
      count: 8
    }
  ];

  const currentRegions = view === 'front' ? frontRegions : backRegions;
  const activeSpotData = currentRegions.find((r) => r.spot === selectedSpot) || frontRegions[0];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Interactive Body Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tap any muscle area to immediately preview targeted exercises and launch a workout.
          </p>
        </div>

        {/* View Switcher: Front / Back */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setView('front')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              view === 'front'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FRONT VIEW
          </button>
          <button
            onClick={() => setView('back')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              view === 'back'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BACK VIEW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Body Graphic */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[360px] bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          <div className="absolute top-3 left-3 text-xs text-slate-500 font-mono tracking-wide">
            {view === 'front' ? 'ANTERIOR VIEW' : 'POSTERIOR VIEW'}
          </div>

          {hovered && (
            <div className="absolute top-3 right-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md animate-fade-in font-medium">
              {hovered}
            </div>
          )}

          <svg
            viewBox="70 40 140 280"
            className="w-full max-w-[280px] h-[340px] drop-shadow-2xl select-none"
          >
            {/* Body Base Silhouette (Subtle dark contour) */}
            <g opacity="0.3" fill="#1e293b" stroke="#334155" strokeWidth="0.8">
              {/* Head */}
              <ellipse cx="140" cy="58" rx="14" ry="18" />
              {/* Neck */}
              <path d="M 134 74 L 146 74 L 148 86 L 132 86 Z" />
              {/* Torso Base */}
              <path d="M 112 86 L 168 86 L 160 174 L 120 174 Z" />
              {/* Arms */}
              <path d="M 108 92 L 86 160 L 96 164 L 114 104 Z" />
              <path d="M 172 92 L 194 160 L 184 164 L 166 104 Z" />
              {/* Legs */}
              <path d="M 120 174 L 114 308 L 132 308 L 138 236 L 140 236 L 142 174 Z" />
              <path d="M 160 174 L 166 308 L 148 308 L 142 236 L 140 236 L 138 174 Z" />
            </g>

            {/* Clickable Active Muscle Patches */}
            {currentRegions.map((region) => {
              const isSelected = selectedSpot === region.spot;
              return (
                <path
                  key={region.id}
                  d={region.path}
                  onClick={() => onSelectSpot(region.spot)}
                  onMouseEnter={() => setHovered(region.name)}
                  onMouseLeave={() => setHovered(null)}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'fill-amber-500 stroke-amber-300 stroke-1 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                      : 'fill-slate-800/80 stroke-slate-700 hover:fill-amber-500/50 hover:stroke-amber-400/80'
                  }`}
                />
              );
            })}
          </svg>

          {/* Quick Muscle Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-md">
            {currentRegions
              .filter((r, idx, arr) => arr.findIndex((x) => x.spot === r.spot) === idx)
              .map((r) => {
                const active = selectedSpot === r.spot;
                return (
                  <button
                    key={r.spot}
                    onClick={() => onSelectSpot(r.spot)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                      active
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-medium'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {r.spot.replace(/_/g, ' ')}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Selected Muscle Deep-Dive Info Box */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-slate-950/80 border border-slate-800 rounded-xl p-5">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span className="uppercase tracking-wider font-semibold text-amber-500">TARGET SPOT SELECTED</span>
              <span>{activeSpotData?.count || 12} exercises available</span>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-white capitalize tracking-tight">
                {selectedSpot ? selectedSpot.replace(/_/g, ' ') : 'Select a Spot'}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {getSpotDescription(selectedSpot || 'abs')}
              </p>
            </div>

            {/* Scientific Reality Note */}
            <div className="mt-4 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-slate-400">
                <span className="text-slate-200 font-medium">Training Principle: </span>
                Targeting this spot stimulates muscle hypertrophy and local endurance. It strengthens the underlying fibers, but does not isolate fat burning to this single location.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => onQuickStart(selectedSpot || 'abs')}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              START {selectedSpot ? selectedSpot.toUpperCase().replace(/_/g, ' ') : 'CORE'} WORKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function getSpotDescription(spot: BodyArea): string {
  switch (spot) {
    case 'abs':
    case 'upper_abs':
    case 'lower_abs':
    case 'obliques':
    case 'waist_core':
      return 'The abdominal wall stabilizes the lumbar spine, facilitates rotational torque, and transfers power between lower and upper extremities.';
    case 'chest':
      return 'Pectoralis major and minor handle horizontal adduction and pushing power, protecting the glenohumeral joint and building upper body push capacity.';
    case 'back':
      return 'The latissimus dorsi, rhomboids, and erector spinae counteract hunched postures, stabilize the shoulder blades, and provide pulling strength.';
    case 'shoulders':
      return 'Deltoids provide multi-planar arm elevation and rotational control for healthy overhead mechanics.';
    case 'arms':
    case 'biceps':
    case 'triceps':
      return 'Elbow flexors (biceps, brachialis) and extensors (triceps) govern pushing, pulling, and grip execution.';
    case 'glutes':
    case 'hips':
      return 'The gluteus complex is the primary engine for hip extension, pelvis stability, and athletic propulsion.';
    case 'thighs':
      return 'Quadriceps and inner adductors control knee extension and decelerate impacts during running, squatting, and jumping.';
    case 'hamstrings':
      return 'Hamstrings handle knee flexion and hip extension, shielding the anterior cruciate ligament (ACL) and powering sprints.';
    case 'calves':
      return 'Gastrocnemius and soleus govern ankle plantar flexion, Achilles spring mechanics, and lower extremity shock absorption.';
    case 'mobility':
    case 'posture':
      return 'Targeted joint capsules and myofascial chains restore full range of motion, reducing stiffness and joint friction.';
    default:
      return 'Targeted muscular conditioning with precise progressive overload.';
  }
}
