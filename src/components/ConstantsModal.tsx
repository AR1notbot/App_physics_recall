import React, { useState } from 'react';
import { PHYSICAL_CONSTANTS } from '../data/constants';
import { PhysicalConstant } from '../types';
import { X, Search, Copy, Check, BookOpen } from 'lucide-react';

interface ConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRetro?: boolean;
}

export const ConstantsModal: React.FC<ConstantsModalProps> = ({ isOpen, onClose, isRetro }) => {
  const [search, setSearch] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = PHYSICAL_CONSTANTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.unit.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (c: PhysicalConstant) => {
    const pureVal = c.value.replace(/[^0-9.eE+-]/g, '').trim() || c.value;
    navigator.clipboard.writeText(pureVal);
    setCopiedSymbol(c.symbol);
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

  return (
    <div
      id="constants-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="constants-modal-content"
        className={`w-full max-w-3xl rounded-xl border max-h-[85vh] flex flex-col shadow-2xl overflow-hidden ${
          isRetro
            ? 'bg-slate-950 border-emerald-500/60 font-mono text-emerald-400'
            : 'bg-slate-900 border-slate-700 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          id="constants-modal-header"
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isRetro ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800 bg-slate-800/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <BookOpen className={`w-5 h-5 ${isRetro ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <div>
              <h2 className="text-lg font-bold tracking-wide">
                {isRetro ? 'REM: ФІЗИЧНІ СТАЛІ ТА ДОВІДНИК' : 'Довідник фізичних констант'}
              </h2>
              <p className={`text-xs ${isRetro ? 'text-emerald-500/80' : 'text-slate-400'}`}>
                Стандартні значення для обчислень у системі СІ
              </p>
            </div>
          </div>
          <button
            id="close-constants-btn"
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isRetro ? 'hover:bg-emerald-900/40 text-emerald-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Закрити"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className={`p-4 border-b flex flex-wrap items-center gap-3 ${isRetro ? 'border-emerald-500/30' : 'border-slate-800'}`}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              id="search-constants-input"
              type="text"
              placeholder="Шукати сталу (напр. g, питома, 4200, швидкість)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-hidden transition-all ${
                isRetro
                  ? 'bg-black border-emerald-600/60 text-emerald-300 placeholder-emerald-700 focus:border-emerald-400'
                  : 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-500'
              }`}
            />
          </div>

          <div className="flex gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Усі' },
              { id: 'mechanics', label: 'Механіка' },
              { id: 'thermodynamics', label: 'Теплота' },
              { id: 'electrodynamics', label: 'Електрика' },
              { id: 'quantum_astro', label: 'Квантова' },
            ].map((cat) => (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? isRetro
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : isRetro
                    ? 'text-emerald-600 hover:text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Нічого не знайдено за запитом &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((item) => (
                <div
                  key={item.symbol + item.name}
                  className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                    isRetro
                      ? 'border-emerald-600/30 bg-black/40 hover:border-emerald-500/60'
                      : 'border-slate-800 bg-slate-850 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className={`text-base font-bold font-mono px-1.5 py-0.5 rounded ${
                          isRetro ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-cyan-300'
                        }`}
                      >
                        {item.symbol}
                      </span>
                      <span className="text-sm font-semibold truncate">{item.name}</span>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono text-sm">
                      <span className="font-bold text-white tracking-wide">{item.value}</span>
                      <span className={`text-xs ${isRetro ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {item.unit}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    className={`p-1.5 rounded-md transition-colors ${
                      isRetro
                        ? 'hover:bg-emerald-900/50 text-emerald-400'
                        : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Копіювати число"
                  >
                    {copiedSymbol === item.symbol ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          className={`px-6 py-3 border-t text-xs flex justify-between items-center ${
            isRetro ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-500' : 'border-slate-800 bg-slate-900 text-slate-400'
          }`}
        >
          <span>У задачах допускається як g = 9.8 м/с², так і g = 10 м/с²</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-colors ${
              isRetro
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
};
