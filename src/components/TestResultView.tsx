import React from 'react';
import { PhysicsProblem, UserAnswer } from '../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ListFilter,
  Trophy,
  Clock,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

interface TestResultViewProps {
  problems: PhysicsProblem[];
  answers: Record<string, UserAnswer>;
  topicTitle: string;
  timeSpentSec: number;
  onRetry: () => void;
  onBackToTopics: () => void;
  isRetro?: boolean;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  problems,
  answers,
  topicTitle,
  timeSpentSec,
  onRetry,
  onBackToTopics,
  isRetro,
}) => {
  // Compute score
  const correctCount = problems.filter((p) => answers[p.id]?.isCorrect).length;
  const total = problems.length;
  const percentage = Math.round((correctCount / total) * 100);

  // 12-point scale conversion
  const grade12 = Math.round((correctCount / total) * 12);

  // Time format
  const minutes = Math.floor(timeSpentSec / 60);
  const seconds = timeSpentSec % 60;
  const timeFormatted = `${minutes} хв ${seconds.toString().padStart(2, '0')} с`;

  // Feedback tier
  let feedbackTitle = 'Чудово! Бездоганне знання фізики!';
  let feedbackDesc = 'Ви розв\'язали всі 5 задач без жодної помилки. Фізичні формули та математичний апарат засвоєно ідеально.';

  if (correctCount === 4) {
    feedbackTitle = 'Дуже добре! Високий рівень знань.';
    feedbackDesc = '4 з 5 правильних відповідей. Перегляньте нижче розв\'язок задачі, де виникла помилка, для закріплення.';
  } else if (correctCount === 3) {
    feedbackTitle = 'Добре! Тверда основа знань.';
    feedbackDesc = 'Більшість задач розв\'язано вірно. Зверніть увагу на розмірності та уважність при обчисленнях.';
  } else if (correctCount === 2 || correctCount === 1) {
    feedbackTitle = 'Потрібне додаткове повторення.';
    feedbackDesc = 'Рекомендуємо детально розібрати покрокові розв\'язки та пройти тест ще раз з новими випадковими задачами.';
  } else if (correctCount === 0) {
    feedbackTitle = 'Спробуйте ще раз після перегляду формул.';
    feedbackDesc = 'Уважно ознайомтеся з формулами в покроковому аналізі нижче та спробуйте пройти тему знову.';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Result Score Banner */}
      <div
        id="result-summary-card"
        className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden transition-all ${
          isRetro
            ? 'bg-slate-950 border-emerald-500/60 font-mono text-emerald-400 shadow-xl'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl'
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{topicTitle} • Результат тесту</span>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="text-5xl sm:text-7xl font-extrabold tracking-tight font-mono">
              <span className={correctCount >= 4 ? 'text-emerald-400' : correctCount >= 2 ? 'text-amber-400' : 'text-rose-400'}>
                {correctCount}
              </span>
              <span className="text-slate-500 text-3xl sm:text-4xl"> / {total}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-slate-400 font-mono">
            <span>Успішність: <strong className="text-white">{percentage}%</strong></span>
            <span>•</span>
            <span>Оцінка (12-бальна): <strong className="text-cyan-400">{grade12} балів</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeFormatted}</span>
            </span>
          </div>

          <div className="pt-2">
            <h2 className="text-lg sm:text-xl font-bold">{feedbackTitle}</h2>
            <p className={`mt-1 text-xs sm:text-sm ${isRetro ? 'text-emerald-500' : 'text-slate-400'}`}>
              {feedbackDesc}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              id="retry-test-btn"
              onClick={onRetry}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all ${
                isRetro
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Пройти ще раз (5 нових задач)</span>
            </button>

            <button
              id="back-to-topics-btn"
              onClick={onBackToTopics}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
                isRetro
                  ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>Обрати іншу тему</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Детальний аналіз та покроковий розв&apos;язок задач:</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">5 завдань сесії</span>
        </div>

        <div className="space-y-4">
          {problems.map((prob, idx) => {
            const ans = answers[prob.id];
            const isCorrect = ans?.isCorrect ?? false;
            const entered = ans?.userRawInput || '— (немає відповіді)';

            return (
              <div
                key={prob.id}
                id={`review-problem-${idx + 1}`}
                className={`p-5 sm:p-6 rounded-xl border transition-all ${
                  isRetro
                    ? isCorrect
                      ? 'bg-slate-950 border-emerald-500/50 font-mono text-emerald-400'
                      : 'bg-slate-950 border-rose-900/60 font-mono text-emerald-400'
                    : isCorrect
                    ? 'bg-slate-900/80 border-emerald-500/30 text-slate-100'
                    : 'bg-slate-900/80 border-rose-500/30 text-slate-100'
                }`}
              >
                {/* Header row with status badge */}
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      Задача #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{prob.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Вірно (+1)</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        <span>Помилка (0)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Question */}
                <p className="text-sm sm:text-base font-medium leading-relaxed my-3">
                  {prob.question}
                </p>

                {/* Given row */}
                <div
                  className={`p-3 rounded-lg border text-xs font-mono mb-3 ${
                    isRetro ? 'bg-black/50 border-emerald-600/30' : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {prob.given.map((g, i) => (
                      <span key={i}>
                        <strong className="text-cyan-300">{g.label}:</strong> {g.value}
                      </span>
                    ))}
                    <span className="text-amber-300 font-semibold">
                      Знайти: {prob.find} {prob.unit ? `[${prob.unit}]` : ''}
                    </span>
                  </div>
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg border bg-black/20 border-slate-800 text-xs font-mono mb-3">
                  <div>
                    <span className="opacity-75 block text-[11px]">Ваша введена відповідь:</span>
                    <span
                      className={`text-sm font-bold ${
                        isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {entered} {prob.unit}
                    </span>
                  </div>

                  <div>
                    <span className="opacity-75 block text-[11px]">Правильний результат:</span>
                    <span className="text-sm font-bold text-white">
                      {prob.expectedAnswer} {prob.unit}
                      {prob.acceptableAlternatives && prob.acceptableAlternatives.length > 0 && (
                        <span className="text-xs text-slate-400 font-normal ml-1">
                          (або {prob.acceptableAlternatives.join(', ')})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Step by step solution */}
                <div
                  className={`p-3.5 rounded-lg border text-xs sm:text-sm space-y-1.5 ${
                    isRetro
                      ? 'border-emerald-600/40 bg-emerald-950/20'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-cyan-400 text-xs flex items-center gap-1">
                    <span>Формула: </span>
                    <code className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">
                      {prob.formula}
                    </code>
                  </div>
                  <div className="space-y-1 pt-1">
                    {prob.solutionSteps.map((step, sIdx) => (
                      <p key={sIdx} className="leading-relaxed">
                        • {step}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
