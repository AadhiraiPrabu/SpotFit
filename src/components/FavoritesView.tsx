import React, { useState } from 'react';
import { Exercise, Workout } from '../types/index.js';
import {
  Heart,
  Dumbbell,
  Play,
  Trash2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface FavoritesViewProps {
  favoriteExercises: Exercise[];
  favoriteWorkouts: Workout[];
  onSelectExercise: (exercise: Exercise) => void;
  onSelectWorkout: (workout: Workout) => void;
  onRemoveFavoriteExercise: (id: string) => void;
  onRemoveFavoriteWorkout: (id: string) => void;
  onExploreExercises: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteExercises,
  favoriteWorkouts,
  onSelectExercise,
  onSelectWorkout,
  onRemoveFavoriteExercise,
  onRemoveFavoriteWorkout,
  onExploreExercises
}) => {
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Your Saved Favorites
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Quickly access your preferred workouts and go-to movements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'workouts'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Favorite Workouts ({favoriteWorkouts.length})
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'exercises'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Favorite Exercises ({favoriteExercises.length})
          </button>
        </div>
      </div>

      {/* Workouts Tab */}
      {activeTab === 'workouts' && (
        <div>
          {favoriteWorkouts.length === 0 ? (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No favorite workouts yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Save workouts you love to launch them directly with a single tap.
              </p>
              <button
                onClick={onExploreExercises}
                className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl"
              >
                EXPLORE WORKOUTS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="text-amber-400 font-semibold uppercase tracking-wider">
                        {workout.bodyArea.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono">{workout.durationMinutes} min</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">
                      {workout.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {workout.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onRemoveFavoriteWorkout(workout.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>

                    <button
                      onClick={() => onSelectWorkout(workout)}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      START
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <div>
          {favoriteExercises.length === 0 ? (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <Heart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No favorite exercises yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Favorite exercises you want to come back to or incorporate into custom routines.
              </p>
              <button
                onClick={onExploreExercises}
                className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl"
              >
                EXPLORE EXERCISES
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {favoriteExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="uppercase text-amber-400 font-semibold text-[10px]">
                        {ex.bodyArea.replace(/_/g, ' ')}
                      </span>
                      <span className="capitalize text-[10px] text-slate-500">{ex.difficulty}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{ex.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {ex.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onRemoveFavoriteExercise(ex.id)}
                      className="text-xs text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectExercise(ex)}
                      className="text-xs text-amber-400 font-semibold hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
