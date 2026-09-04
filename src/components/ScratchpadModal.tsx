import React, { useState } from 'react';
import { X, Calculator, Trash2, ArrowRight } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult?: (value: string) => void;
  isRetro?: boolean;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose,
  onApplyResult,
  isRetro,
}) => {
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const evaluateExpression = () => {
    if (!calcInput.trim()) return;
    try {
      // Clean and sanitize mathematical input
      let expr = calcInput
        .replace(/,/g, '.')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Support sqrt(x)
      expr = expr.replace(/sqrt\(([^)]+)\)/gi, 'Math.sqrt($1)');
      expr = expr.replace(/sin\(([^)]+)\)/gi, 'Math.sin($1 * Math.PI / 180)');
      expr = expr.replace(/cos\(([^)]+)\)/gi, 'Math.cos($1 * Math.PI / 180)');

      // Whitelist only safe math characters
      if (!/^[0-9+\-*/(). Mathsqrtpicosin]+$/i.test(expr)) {
        setCalcResult('Помилка: недопустимі символи');
        return;
      }

      // Safe evaluation with Function
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        // Round cleanly to 4 decimal places if float
        const rounded = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(4)).toString();
        setCalcResult(rounded);
      } else {
        setCalcResult('Помилка');
      }
    } catch {
      setCalcResult('Помилка у формулі');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      evaluateExpression();
    }
  };

  return (
    <div
      id="scratchpad-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="scratchpad-modal-content"
        className={`w-full max-w-lg rounded-xl border shadow-2xl flex flex-col overflow-hidden ${
          isRetro
            ? 'bg-slate-950 border-emerald-500/60 font-mono text-emerald-400'
            : 'bg-slate-900 border-slate-700 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b ${
            isRetro ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800 bg-slate-800/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Calculator className={`w-5 h-5 ${isRetro ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <h3 className="font-bold text-sm tracking-wide">
              {isRetro ? 'BASIC CALCULATOR & SCRATCHPAD' : 'Чернетка та швидкий калькулятор'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isRetro ? 'hover:bg-emerald-900/40 text-emerald-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculator Row */}
        <div className={`p-4 border-b space-y-3 ${isRetro ? 'border-emerald-500/30 bg-black/50' : 'border-slate-800 bg-slate-950/40'}`}>
          <label className={`block text-xs font-semibold ${isRetro ? 'text-emerald-500' : 'text-slate-400'}`}>
            Введіть числовий вираз (наприклад: 180 / 2.5 або sqrt(45*2/10)):
          </label>

          <div className="flex gap-2">
            <input
              id="calc-input"
              type="text"
              placeholder="180 / 2.5 або 500 * 0.08"
              value={calcInput}
              onChange={(e) => setCalcInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 px-3 py-2 text-sm rounded-lg border font-mono focus:outline-hidden ${
                isRetro
                  ? 'bg-black border-emerald-600 text-emerald-300 placeholder-emerald-800 focus:border-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
              }`}
            />
            <button
              id="calc-eval-btn"
              onClick={evaluateExpression}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                isRetro
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                  : 'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400'
              }`}
            >
              = Рахувати
            </button>
          </div>

          {/* Quick buttons */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['+', '-', '*', '/', 'sqrt(', '(', ')', '^2', '3.14', '9.8'].map((op) => (
              <button
                key={op}
                onClick={() => setCalcInput((prev) => prev + op)}
                className={`px-2.5 py-1 rounded-md font-mono border transition-colors ${
                  isRetro
                    ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {op}
              </button>
            ))}
            <button
              onClick={() => {
                setCalcInput('');
                setCalcResult(null);
              }}
              className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                isRetro
                  ? 'border-red-900/50 bg-red-950/30 text-red-400 hover:bg-red-900/40'
                  : 'border-rose-900/50 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50'
              }`}
              title="Очистити"
            >
              Скинути
            </button>
          </div>

          {/* Calculation result banner */}
          {calcResult !== null && (
            <div
              className={`p-3 rounded-lg border flex items-center justify-between animate-in fade-in duration-150 ${
                isRetro
                  ? 'border-emerald-500/60 bg-emerald-950/40'
                  : 'border-cyan-500/40 bg-cyan-950/20'
              }`}
            >
              <div className="font-mono">
                <span className="text-xs opacity-75">Результат: </span>
                <span className="text-lg font-bold ml-1">{calcResult}</span>
              </div>
              {onApplyResult && !isNaN(Number(calcResult)) && (
                <button
                  onClick={() => {
                    onApplyResult(calcResult);
                    onClose();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isRetro
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  }`}
                >
                  Вставити у відповідь
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scratchpad Textarea */}
        <div className="p-4 flex-1 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={isRetro ? 'text-emerald-500' : 'text-slate-400'}>
              Текстова чернетка для запису &ldquo;Дано&rdquo; та формул:
            </span>
            <button
              onClick={() => setNotes('')}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Очистити текст
            </button>
          </div>
          <textarea
            id="scratchpad-notes"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Тут можна записувати проміжні кроки, наприклад:
m = 4 кг
a = F / m = 12 / 4 = 3"
            className={`w-full p-3 text-xs sm:text-sm rounded-lg border font-mono resize-none focus:outline-hidden ${
              isRetro
                ? 'bg-black border-emerald-600/60 text-emerald-300 placeholder-emerald-800 focus:border-emerald-400'
                : 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
            }`}
          />
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t text-xs flex justify-end ${
            isRetro ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isRetro ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
