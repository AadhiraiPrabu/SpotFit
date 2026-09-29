import React, { useState } from 'react';
import { Workout } from '../types/index.js';
import { api } from '../services/api.js';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Play,
  ShieldCheck,
  AlertCircle,
  Dumbbell
} from 'lucide-react';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: (workout: Workout) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  workout?: Workout;
  safetyTips?: string[];
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
  onStartWorkout
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Hello! I am your SpotFit Coach. Tell me what body spot you want to train, how much time you have, or any equipment constraints you're working with. I'll tailor a specific routine grounded in our exercise library!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    'Give me a 10-minute beginner core workout.',
    'I have no equipment for chest.',
    'Low-impact leg workout for bad knees.',
    'I only have 5 minutes for glutes.',
    'Give me a desk worker mobility routine.'
  ];

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.askAICoach(text);

      const coachMsg: Message = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: response.answer,
        workout: response.recommendedWorkout,
        safetyTips: response.safetyTips
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `coach-err-${Date.now()}`,
        sender: 'coach',
        text: "I encountered a slight error connecting to the training database. Please try another query or select from the pre-made workouts."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                SpotFit AI Coach
              </h3>
              <p className="text-[11px] text-slate-400">
                Targeted workouts · Science-based guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close AI Coach"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              {/* Attached Workout Card if AI suggested one */}
              {msg.workout && (
                <div className="mt-3 w-full bg-slate-950/90 border border-amber-500/40 rounded-xl p-3.5 shadow-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      RECOMMENDED WORKOUT
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {msg.workout.durationMinutes} min · {msg.workout.exercises.length} exercises
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">
                    {msg.workout.title}
                  </h4>

                  <div className="space-y-1 mb-3">
                    {msg.workout.exercises.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-slate-300 flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0"
                      >
                        <span className="truncate max-w-[200px]">
                          {idx + 1}. {item.exerciseId.replace('ex-', '').replace(/-/g, ' ')}
                        </span>
                        <span className="font-mono text-slate-400">
                          {item.sets} × {item.durationSeconds ? `${item.durationSeconds}s` : `${item.reps} reps`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onStartWorkout(msg.workout!);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 rounded-lg transition-colors uppercase tracking-wider shadow-md shadow-amber-500/10"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    START THIS WORKOUT NOW
                  </button>
                </div>
              )}

              {/* Safety notice if present */}
              {msg.safetyTips && msg.safetyTips.length > 0 && (
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 px-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{msg.safetyTips[0]}</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-950/60 border border-slate-800 p-3 rounded-xl w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>SpotFit Coach is designing your routine...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5">QUICK INQUIRIES:</div>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-md transition-colors truncate max-w-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about a spot routine or exercise..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 p-2.5 rounded-xl transition-colors font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
