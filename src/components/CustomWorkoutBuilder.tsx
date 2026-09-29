import React, { useState } from 'react';
import {
  Exercise,
  Workout,
  CustomWorkout,
  BodyArea,
  FitnessLevel,
  EquipmentType,
  WorkoutExerciseItem
} from '../types/index.js';
import { api } from '../services/api.js';
import {
  X,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Search,
  Check,
  Save,
  Dumbbell
} from 'lucide-react';

interface CustomWorkoutBuilderProps {
  exercises: Exercise[];
  onClose: () => void;
  onSaved: (customWorkout: CustomWorkout) => void;
}

export const CustomWorkoutBuilder: React.FC<CustomWorkoutBuilderProps> = ({
  exercises,
  onClose,
  onSaved
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bodyArea, setBodyArea] = useState<BodyArea>('abs');
  const [difficulty, setDifficulty] = useState<FitnessLevel>('beginner');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredLibrary = exercises.filter((ex) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ex.name.toLowerCase().includes(q) ||
      ex.bodyArea.toLowerCase().includes(q) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(q))
    );
  });

  const handleAddExercise = (exercise: Exercise) => {
    const newItem: WorkoutExerciseItem = {
      exerciseId: exercise.id,
      sets: exercise.defaultSets || 3,
      reps: exercise.exerciseType === 'reps' ? exercise.defaultReps || 12 : 1,
      durationSeconds: exercise.exerciseType === 'time' ? exercise.duration || 30 : undefined,
      restSeconds: exercise.defaultRest || 30,
      order: selectedExercises.length + 1
    };
    setSelectedExercises([...selectedExercises, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    setSelectedExercises(updated.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...selectedExercises];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    setSelectedExercises(copy.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedExercises.length - 1) return;
    const copy = [...selectedExercises];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    setSelectedExercises(copy.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const handleUpdateItem = (index: number, updates: Partial<WorkoutExerciseItem>) => {
    const copy = [...selectedExercises];
    copy[index] = { ...copy[index], ...updates };
    setSelectedExercises(copy);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a workout title.');
      return;
    }
    if (selectedExercises.length === 0) {
      setErrorMsg('Please add at least one exercise to your workout.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const created = await api.createCustomWorkout({
        title: title.trim(),
        description: description.trim() || 'Custom targeted workout created by user.',
        bodyArea,
        difficulty,
        equipment: ['none'],
        exercises: selectedExercises
      });
      onSaved(created);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save custom workout.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Custom Workout Builder
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Assemble, sequence, and customize your targeted training program.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close builder"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Form Details & Selected Exercises */}
          <div className="md:col-span-7 p-5 sm:p-6 overflow-y-auto border-r border-slate-800/80 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Title & Body Area */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  WORKOUT TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning Oblique & Lower Core Focus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    PRIMARY SPOT
                  </label>
                  <select
                    value={bodyArea}
                    onChange={(e) => setBodyArea(e.target.value as BodyArea)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 capitalize"
                  >
                    <option value="abs">Abs & Core</option>
                    <option value="chest">Chest</option>
                    <option value="back">Back & Lats</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="glutes">Glutes</option>
                    <option value="thighs">Thighs / Quads</option>
                    <option value="hamstrings">Hamstrings</option>
                    <option value="calves">Calves</option>
                    <option value="mobility">Mobility</option>
                    <option value="full_body">Full Body</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    DIFFICULTY LEVEL
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as FitnessLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 capitalize"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Exercises Stack */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selected Exercises ({selectedExercises.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Drag or use arrows to reorder
                </span>
              </div>

              {selectedExercises.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center">
                  <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No exercises added yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select exercises from the library on the right to build your routine.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedExercises.map((item, idx) => {
                    const ex = exercises.find((e) => e.id === item.exerciseId);
                    return (
                      <div
                        key={idx}
                        className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-semibold text-white">
                              {ex?.name || item.exerciseId}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveUp(idx)}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(idx)}
                              disabled={idx === selectedExercises.length - 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Sets / Reps / Duration / Rest inputs */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Sets</span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={item.sets}
                              onChange={(e) => handleUpdateItem(idx, { sets: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">
                              {ex?.exerciseType === 'time' ? 'Duration (sec)' : 'Reps'}
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={300}
                              value={ex?.exerciseType === 'time' ? item.durationSeconds || 30 : item.reps}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (ex?.exerciseType === 'time') {
                                  handleUpdateItem(idx, { durationSeconds: val });
                                } else {
                                  handleUpdateItem(idx, { reps: val });
                                }
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Rest (sec)</span>
                            <input
                              type="number"
                              min={0}
                              max={180}
                              value={item.restSeconds}
                              onChange={(e) => handleUpdateItem(idx, { restSeconds: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Exercise Picker Library */}
          <div className="md:col-span-5 p-5 sm:p-6 overflow-y-auto flex flex-col bg-slate-950/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Exercise Library
            </h3>

            {/* Search filter */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search exercise or muscle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredLibrary.slice(0, 30).map((ex) => {
                const isAdded = selectedExercises.some((s) => s.exerciseId === ex.id);
                return (
                  <div
                    key={ex.id}
                    className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{ex.name}</div>
                      <div className="text-[11px] text-slate-500 capitalize">
                        {ex.bodyArea.replace(/_/g, ' ')} · {ex.difficulty}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddExercise(ex)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                      title={isAdded ? 'Add another set' : 'Add to workout'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
          >
            CANCEL
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 uppercase tracking-wider"
          >
            <Save className="w-4 h-4 fill-slate-950" />
            {isSaving ? 'SAVING WORKOUT...' : 'SAVE TO MY WORKOUTS'}
          </button>
        </div>
      </div>
    </div>
  );
};
