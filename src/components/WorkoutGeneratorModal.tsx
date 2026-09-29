import React, { useState } from 'react';
import {
  BodyArea,
  FitnessLevel,
  EquipmentType,
  TrainingStyle,
  IntensityLevel,
  Workout
} from '../types/index.js';
import { api } from '../services/api.js';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Play,
  Bookmark,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface WorkoutGeneratorModalProps {
  initialSpot?: BodyArea;
  onClose: () => void;
  onWorkoutGenerated: (workout: Workout) => void;
  onStartWorkout: (workout: Workout) => void;
}

export const WorkoutGeneratorModal: React.FC<WorkoutGeneratorModalProps> = ({
  initialSpot = 'abs',
  onClose,
  onWorkoutGenerated,
  onStartWorkout
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);

  // Form states
  const [selectedArea, setSelectedArea] = useState<BodyArea>(initialSpot);
  const [selectedDifficulty, setSelectedDifficulty] = useState<FitnessLevel>('beginner');
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType>('none');
  const [selectedStyle, setSelectedStyle] = useState<TrainingStyle>('strength');
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>('moderate');

  const areas: { id: BodyArea; label: string; desc: string }[] = [
    { id: 'abs', label: 'Abs & Core', desc: 'Anterior & rotational abdominal wall' },
    { id: 'chest', label: 'Chest (Pecs)', desc: 'Upper and lower push power' },
    { id: 'back', label: 'Back & Lats', desc: 'Posterior chain and posture support' },
    { id: 'shoulders', label: 'Shoulders (Delts)', desc: '3D deltoids and stability' },
    { id: 'arms', label: 'Arms (Biceps & Triceps)', desc: 'Full arm isolation' },
    { id: 'glutes', label: 'Glutes & Hips', desc: 'Gluteus maximus and hip abduction' },
    { id: 'thighs', label: 'Thighs & Quads', desc: 'Knee extension and athletic drive' },
    { id: 'hamstrings', label: 'Hamstrings & Calves', desc: 'Knee flexors and posterior hinge' },
    { id: 'full_body', label: 'Full Body Circuit', desc: 'Total systemic muscular activation' },
    { id: 'mobility', label: 'Mobility & Recovery', desc: 'Joint capsules and fascia release' }
  ];

  const difficulties: { id: FitnessLevel; label: string; desc: string }[] = [
    { id: 'beginner', label: 'Beginner', desc: 'Foundation movements with moderate volume' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Higher intensity and complex movements' },
    { id: 'advanced', label: 'Advanced', desc: 'High mechanical demand and peak loading' }
  ];

  const durations = [
    { value: 5, label: '5 Minutes', desc: 'Rapid express burst' },
    { value: 10, label: '10 Minutes', desc: 'High density spot routine' },
    { value: 15, label: '15 Minutes', desc: 'Recommended standard session' },
    { value: 20, label: '20 Minutes', desc: 'Thorough muscular overload' },
    { value: 30, label: '30 Minutes', desc: 'Full workout volume' }
  ];

  const equipmentOptions: { id: EquipmentType; label: string }[] = [
    { id: 'none', label: 'No Equipment (Bodyweight)' },
    { id: 'dumbbells', label: 'Dumbbells' },
    { id: 'resistance_band', label: 'Resistance Bands' },
    { id: 'gym_equipment', label: 'Gym Equipment' }
  ];

  const styles: { id: TrainingStyle; label: string; desc: string }[] = [
    { id: 'strength', label: 'Strength', desc: 'Focus on muscle tension & form' },
    { id: 'endurance', label: 'Endurance', desc: 'Higher reps with shorter rests' },
    { id: 'mobility', label: 'Mobility', desc: 'Range of motion & joint health' },
    { id: 'stability', label: 'Stability', desc: 'Isometric control & core anti-movement' },
    { id: 'hiit', label: 'HIIT / Dynamic', desc: 'High energy metabolic pace' },
    { id: 'low_impact', label: 'Low Impact', desc: 'Gentle on knees and spine' }
  ];

  const intensities: { id: IntensityLevel; label: string; desc: string }[] = [
    { id: 'easy', label: 'Easy / Recovery', desc: 'Light effort, restorative pace' },
    { id: 'moderate', label: 'Moderate / Balanced', desc: 'Solid working effort' },
    { id: 'challenging', label: 'Challenging / Pushed', desc: 'High perceived exertion' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const workout = await api.generateWorkout({
        bodyArea: selectedArea,
        difficulty: selectedDifficulty,
        durationMinutes: selectedDuration,
        equipment: selectedEquipment,
        trainingStyle: selectedStyle,
        intensity: selectedIntensity
      });
      setGeneratedWorkout(workout);
      onWorkoutGenerated(workout);
      setStep(7); // Result preview step
    } catch (err) {
      console.error('Failed to generate workout:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Spot Workout Generator
              </h2>
              <p className="text-xs text-slate-400">
                {step < 7 ? `Step ${step} of 6` : 'Your Generated Workout'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close generator"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Step 1: What do you want to train today?
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Select the primary spot you want to focus your session on.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(area.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedArea === area.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold capitalize">{area.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{area.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Step 2: Select your fitness level
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Tailors exercise volume, complexity, and tempo.
              </p>

              <div className="space-y-2.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedDifficulty === diff.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold capitalize">{diff.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{diff.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Step 3: Workout duration
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Choose how many minutes you have available.
              </p>

              <div className="space-y-2.5">
                {durations.map((dur) => (
                  <button
                    key={dur.value}
                    onClick={() => setSelectedDuration(dur.value)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedDuration === dur.value
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{dur.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{dur.desc}</div>
                    </div>
                    {selectedDuration === dur.value && (
                      <Check className="w-5 h-5 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Step 4: Available equipment
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                We will only choose exercises matching what you have right now.
              </p>

              <div className="space-y-2.5">
                {equipmentOptions.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => setSelectedEquipment(eq.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedEquipment === eq.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{eq.label}</span>
                    {selectedEquipment === eq.id && (
                      <Check className="w-5 h-5 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Step 5: Training style
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                What style of training do you want today?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedStyle === style.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold capitalize">{style.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Step 6: Intensity level
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Sets the rest intervals and work pace.
              </p>

              <div className="space-y-2.5">
                {intensities.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIntensity(item.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedIntensity === item.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold capitalize">{item.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Generated Workout Preview */}
          {step === 7 && generatedWorkout && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">
                  {generatedWorkout.durationMinutes} MIN · {generatedWorkout.difficulty.toUpperCase()} · {generatedWorkout.equipment.join(', ')}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {generatedWorkout.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {generatedWorkout.description}
                </p>
              </div>

              {/* Workout Structure */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Workout Exercises ({generatedWorkout.exercises.length})
                </h4>
                <div className="space-y-2">
                  {generatedWorkout.exercises.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-200">
                          {item.exerciseId.replace('ex-', '').replace(/-/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono">
                        {item.sets} sets × {item.durationSeconds ? `${item.durationSeconds}s` : `${item.reps} reps`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific principle reminder */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                <span className="text-amber-400 font-semibold">SpotFit Principle: </span>
                This session targets and strengthens your {generatedWorkout.bodyArea.replace(/_/g, ' ')} musculature. Fat loss occurs across the body systemically through ongoing energy balance.
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          {step > 1 && step < 7 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>
          )}

          {step < 6 && (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              NEXT
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 6 && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="ml-auto flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              {isGenerating ? 'GENERATING WORKOUT...' : 'GENERATE WORKOUT'}
            </button>
          )}

          {step === 7 && generatedWorkout && (
            <div className="w-full flex items-center justify-between gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                CHANGE
              </button>

              <button
                onClick={() => {
                  onClose();
                  onStartWorkout(generatedWorkout);
                }}
                className="flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                START WORKOUT NOW
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
