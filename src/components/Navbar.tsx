import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Flame,
  User,
  Sparkles,
  Bot,
  PlusCircle,
  Shield,
  Dumbbell
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  streakCount: number;
  onOpenGenerator: () => void;
  onOpenAICoach: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  streakCount,
  onOpenGenerator,
  onOpenAICoach,
  onOpenProfile,
  onOpenAuth
}) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'bodymap', label: 'Body Map' },
    { id: 'progress', label: 'Progress' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'history', label: 'History' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">
                Spot<span className="text-amber-400">Fit</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block tracking-wide font-medium">
              Target the spot. Train with purpose.
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`text-xs font-semibold tracking-wide transition-colors relative py-1 ${
                  active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Streak Indicator */}
          <div
            title={`Current Streak: ${streakCount} consecutive days`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono font-bold text-amber-400"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{streakCount}</span>
          </div>

          {/* Quick Generator Button */}
          <button
            onClick={onOpenGenerator}
            className="hidden sm:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Generate</span>
          </button>

          {/* AI Coach Drawer Toggle */}
          <button
            onClick={onOpenAICoach}
            aria-label="Open AI Coach"
            className="p-2 text-slate-300 hover:text-amber-400 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
            title="Ask SpotFit Coach"
          >
            <Bot className="w-4 h-4" />
          </button>

          {/* User Account Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              aria-label="Open user profile"
              className="flex items-center gap-2 p-1 pl-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-slate-300 hidden lg:inline max-w-[100px] truncate">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
