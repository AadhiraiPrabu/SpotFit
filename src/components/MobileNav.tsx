import React from 'react';
import {
  Home,
  Dumbbell,
  Compass,
  Trophy,
  Sparkles,
  Bot
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenGenerator: () => void;
  onOpenAICoach: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onTabChange,
  onOpenGenerator,
  onOpenAICoach
}) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'bodymap', label: 'Body Map', icon: Compass },
    { id: 'progress', label: 'Progress', icon: Trophy }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const active = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
              active ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Generator Mobile Trigger */}
      <button
        onClick={onOpenGenerator}
        className="flex flex-col items-center justify-center p-1.5 text-amber-500 hover:text-amber-400 transition-colors"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">Generate</span>
      </button>
    </div>
  );
};
