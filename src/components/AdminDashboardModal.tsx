import React, { useState } from 'react';
import { Exercise, Workout, BodyArea, FitnessLevel, EquipmentType } from '../types/index.js';
import { api } from '../services/api.js';
import {
  X,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  Database
} from 'lucide-react';

interface AdminDashboardModalProps {
  exercises: Exercise[];
  workouts: Workout[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  exercises,
  workouts,
  onClose,
  onRefreshData
}) => {
  const [tab, setTab] = useState<'exercises' | 'workouts'>('exercises');
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states for new/edited exercise
  const [name, setName] = useState('');
  const [bodyArea, setBodyArea] = useState<BodyArea>('abs');
  const [difficulty, setDifficulty] = useState<FitnessLevel>('beginner');
  const [equipment, setEquipment] = useState<EquipmentType>('none');
  const [description, setDescription] = useState('');
  const [instructionsStr, setInstructionsStr] = useState('');
  const [targetMusclesStr, setTargetMusclesStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEdit = (ex: Exercise) => {
    setEditingEx(ex);
    setIsCreating(false);
    setName(ex.name);
    setBodyArea(ex.bodyArea);
    setDifficulty(ex.difficulty);
    setEquipment(ex.equipment);
    setDescription(ex.description);
    setInstructionsStr(ex.instructions.join('\n'));
    setTargetMusclesStr(ex.targetMuscles.join(', '));
  };

  const startCreate = () => {
    setEditingEx(null);
    setIsCreating(true);
    setName('');
    setBodyArea('abs');
    setDifficulty('beginner');
    setEquipment('none');
    setDescription('');
    setInstructionsStr('Step 1...\nStep 2...');
    setTargetMusclesStr('Rectus Abdominis, Obliques');
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        bodyArea,
        difficulty,
        equipment,
        description,
        instructions: instructionsStr.split('\n').filter((s) => s.trim()),
        targetMuscles: targetMusclesStr.split(',').map((s) => s.trim()),
        secondaryMuscles: [],
        exerciseType: 'reps' as const,
        defaultSets: 3,
        defaultReps: 12,
        defaultRest: 30,
        calorieEstimate: 4.5,
        safetyNotes: ['Maintain proper alignment.'],
        commonMistakes: ['Rushing through reps'],
        beginnerModification: 'Perform with lower volume or assistance.',
        progression: 'Add weight or slow eccentric tempo.',
        tags: [bodyArea, difficulty]
      };

      if (editingEx) {
        await api.updateAdminExercise(editingEx.id, payload);
      } else {
        await api.createAdminExercise(payload);
      }

      onRefreshData();
      setIsCreating(false);
      setEditingEx(null);
    } catch (err) {
      console.error('Failed to save exercise:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise from the database?')) return;
    try {
      await api.deleteAdminExercise(id);
      onRefreshData();
    } catch (err) {
      console.error('Failed to delete exercise:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                SpotFit Database Admin Console
              </h2>
              <p className="text-xs text-slate-400">
                Manage {exercises.length} exercises & {workouts.length} workout templates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Exercise List */}
          <div className="md:col-span-6 p-4 sm:p-5 overflow-y-auto border-r border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exercise Database ({exercises.length})
              </h3>
              <button
                onClick={startCreate}
                className="flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                ADD EXERCISE
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-white truncate">{ex.name}</div>
                    <div className="text-[11px] text-slate-500 capitalize">
                      {ex.bodyArea.replace(/_/g, ' ')} · {ex.difficulty}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(ex)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(ex.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Editor */}
          <div className="md:col-span-6 p-4 sm:p-5 overflow-y-auto bg-slate-950/40">
            {isCreating || editingEx ? (
              <form onSubmit={handleSaveExercise} className="space-y-3">
                <h3 className="text-sm font-bold text-white mb-2">
                  {editingEx ? `Edit: ${editingEx.name}` : 'Add New Exercise'}
                </h3>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    EXERCISE NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      BODY AREA
                    </label>
                    <select
                      value={bodyArea}
                      onChange={(e) => setBodyArea(e.target.value as BodyArea)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white capitalize"
                    >
                      <option value="abs">Abs</option>
                      <option value="upper_abs">Upper Abs</option>
                      <option value="lower_abs">Lower Abs</option>
                      <option value="obliques">Obliques</option>
                      <option value="chest">Chest</option>
                      <option value="back">Back</option>
                      <option value="shoulders">Shoulders</option>
                      <option value="biceps">Biceps</option>
                      <option value="triceps">Triceps</option>
                      <option value="glutes">Glutes</option>
                      <option value="thighs">Thighs</option>
                      <option value="hamstrings">Hamstrings</option>
                      <option value="calves">Calves</option>
                      <option value="mobility">Mobility</option>
                      <option value="full_body">Full Body</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      DIFFICULTY
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as FitnessLevel)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white capitalize"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    TARGET MUSCLES (comma separated)
                  </label>
                  <input
                    type="text"
                    value={targetMusclesStr}
                    onChange={(e) => setTargetMusclesStr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    INSTRUCTIONS (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={instructionsStr}
                    onChange={(e) => setInstructionsStr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingEx(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Saving...' : 'Save Exercise'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-20 text-xs text-slate-500">
                Select an exercise from the left to edit or click "Add Exercise".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
