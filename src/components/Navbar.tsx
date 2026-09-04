import React from 'react';
import { BookOpen, Calculator, Terminal, Sparkles, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  isRetro: boolean;
  onToggleRetro: () => void;
  onOpenConstants: () => void;
  onOpenScratchpad: () => void;
  inTestSession?: boolean;
  onExitTest?: () => void;
  topicTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isRetro,
  onToggleRetro,
  onOpenConstants,
  onOpenScratchpad,
  inTestSession,
  onExitTest,
  topicTitle,
}) => {
  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
        isRetro
          ? 'bg-slate-950/90 border-emerald-500/40 font-mono text-emerald-400'
          : 'bg-slate-900/80 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Branding or Back button */}
        <div className="flex items-center gap-3">
          {inTestSession && onExitTest && (
            <button
              id="nav-back-to-menu-btn"
              onClick={onExitTest}
              className={`p-2 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                isRetro
                  ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Повернутися до вибору тем"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">До тем</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shadow-sm ${
                isRetro
                  ? 'bg-emerald-500 text-black border border-emerald-300'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
              }`}
            >
              {isRetro ? '>_' : 'Φ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-sm sm:text-base">
                  {isRetro ? 'BASIC PHYSICS TEST // 10×20' : 'Фізичний Практикум'}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isRetro
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  10 тем × 20 задач
                </span>
              </div>
              <p className={`text-[11px] truncate max-w-[200px] sm:max-w-xs ${isRetro ? 'text-emerald-500/80' : 'text-slate-400'}`}>
                {topicTitle ? topicTitle : 'Без варіантів відповідей • Тільки числовий розрахунок'}
              </p>
            </div>
          </div>
        </div>

        {/* Right tools: Constants, Calculator, Retro Switch */}
        <div className="flex items-center gap-2">
          <button
            id="nav-constants-btn"
            onClick={onOpenConstants}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isRetro
                ? 'border-emerald-600/50 bg-black/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/40'
                : 'border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
            title="Таблиця фізичних констант"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Сталі</span>
          </button>

          <button
            id="nav-scratchpad-btn"
            onClick={onOpenScratchpad}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isRetro
                ? 'border-emerald-600/50 bg-black/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/40'
                : 'border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
            title="Швидка чернетка та калькулятор"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Калькулятор</span>
          </button>

          {/* Retro mode toggle */}
          <button
            id="nav-retro-toggle-btn"
            onClick={onToggleRetro}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isRetro
                ? 'border-emerald-400 bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-400/40'
            }`}
            title={isRetro ? 'Перемкнути на сучасний інтерфейс' : 'Увімкнути ретро-режим Бейсік (зелений термінал)'}
          >
            {isRetro ? <Terminal className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isRetro ? 'BASIC Mode' : 'Ретро Бейсік'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
