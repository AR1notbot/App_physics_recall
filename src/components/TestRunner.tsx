import React, { useState, useEffect, useRef } from 'react';
import { PhysicsProblem, UserAnswer } from '../types';
import { checkPhysicsAnswer } from '../utils/answerChecker';
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Delete,
  CornerDownLeft,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface TestRunnerProps {
  problems: PhysicsProblem[];
  topicTitle: string;
  onFinishTest: (answers: Record<string, UserAnswer>, timeSpentSec: number) => void;
  onCancel: () => void;
  onOpenScratchpad: () => void;
  isRetro?: boolean;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  problems,
  topicTitle,
  onFinishTest,
  onCancel,
  onOpenScratchpad,
  isRetro,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [inputWarning, setInputWarning] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentProblem = problems[currentIndex];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update input when current problem changes
  useEffect(() => {
    const saved = answers[currentProblem.id];
    setCurrentInput(saved ? saved.userRawInput : '');
    setShowHint(false);
    setInputWarning(null);

    // Focus input field automatically
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [currentIndex, currentProblem.id]);

  // Format elapsed time mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (val: string) => {
    setCurrentInput(val);
    setInputWarning(null);
  };

  const saveCurrentAnswer = () => {
    if (!currentInput.trim()) {
      return false;
    }

    const checkResult = checkPhysicsAnswer(currentInput, currentProblem);
    if (!checkResult.isValidNumber) {
      setInputWarning('Будь ласка, введіть числове значення (наприклад: 24 або 3.5 або 1/3)');
      return false;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentProblem.id]: {
        problemId: currentProblem.id,
        userRawInput: currentInput.trim(),
        parsedValue: checkResult.parsedValue,
        isCorrect: checkResult.isCorrect,
      },
    }));

    return true;
  };

  const handleNext = () => {
    saveCurrentAnswer();
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    saveCurrentAnswer();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpTo = (index: number) => {
    saveCurrentAnswer();
    setCurrentIndex(index);
  };

  const handleSubmitAll = () => {
    // Save current problem if entered
    let finalAnswers = { ...answers };
    if (currentInput.trim()) {
      const checkResult = checkPhysicsAnswer(currentInput, currentProblem);
      if (checkResult.isValidNumber) {
        finalAnswers[currentProblem.id] = {
          problemId: currentProblem.id,
          userRawInput: currentInput.trim(),
          parsedValue: checkResult.parsedValue,
          isCorrect: checkResult.isCorrect,
        };
      }
    }

    // Check if some are unanswered
    const answeredCount = Object.keys(finalAnswers).length;
    if (answeredCount < problems.length) {
      const confirmFinish = window.confirm(
        `Ви відповіли на ${answeredCount} з ${problems.length} задач. Завершити тест та показати результати?`
      );
      if (!confirmFinish) return;
    }

    onFinishTest(finalAnswers, elapsedSeconds);
  };

  // Virtual Keypad handlers
  const handleKeypadPress = (char: string) => {
    setCurrentInput((prev) => prev + char);
    setInputWarning(null);
    inputRef.current?.focus();
  };

  const handleKeypadBackspace = () => {
    setCurrentInput((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleKeypadClear = () => {
    setCurrentInput('');
    inputRef.current?.focus();
  };

  const answeredCount = Object.keys(answers).length + (currentInput.trim() && !answers[currentProblem.id] ? 1 : 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Test Top Bar */}
      <div
        id="test-top-bar"
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
          isRetro
            ? 'bg-slate-950 border-emerald-500/60 font-mono text-emerald-400'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
              isRetro
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}
          >
            {topicTitle}
          </span>
          <span className="text-xs sm:text-sm font-semibold opacity-80">
            Задача {currentIndex + 1} з {problems.length}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-1.5 opacity-80">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={onCancel}
            className={`text-xs underline transition-colors ${
              isRetro ? 'text-emerald-600 hover:text-emerald-400' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Вийти
          </button>
        </div>
      </div>

      {/* Question Selector Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {problems.map((prob, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = Boolean(answers[prob.id]) || (isCurrent && currentInput.trim().length > 0);

            return (
              <button
                key={prob.id}
                id={`pill-question-${idx + 1}`}
                onClick={() => handleJumpTo(idx)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? isRetro
                      ? 'bg-emerald-400 text-black border-2 border-emerald-300 scale-105 shadow-md shadow-emerald-500/30'
                      : 'bg-cyan-500 text-slate-950 border-2 border-cyan-300 scale-105 shadow-md shadow-cyan-500/30'
                    : isAnswered
                    ? isRetro
                      ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-800 border border-emerald-500/40 text-emerald-400'
                    : isRetro
                    ? 'bg-slate-950 border border-emerald-800/60 text-emerald-600 hover:border-emerald-500'
                    : 'bg-slate-850 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Відповідей: <strong className="text-white">{answeredCount}</strong>/{problems.length}
        </div>
      </div>

      {/* Main Problem Card */}
      <div
        id="problem-card"
        className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden transition-all ${
          isRetro
            ? 'bg-slate-950 border-emerald-500/60 font-mono text-emerald-400 shadow-xl'
            : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl'
        }`}
      >
        {/* Retro scanline effect if enabled */}
        {isRetro && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-30" />
        )}

        {/* Problem Header */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={`text-xs font-bold tracking-wider ${
                isRetro ? 'text-emerald-500' : 'text-cyan-400 uppercase'
              }`}
            >
              {isRetro ? `10 REM ЗАДАЧА №${currentProblem.numberInTopic || currentIndex + 1}` : currentProblem.title}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded ${
                currentProblem.difficulty === 'базовий'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : currentProblem.difficulty === 'середній'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}
            >
              Складність: {currentProblem.difficulty}
            </span>
          </div>

          {/* Question text */}
          <p className="text-base sm:text-xl font-medium leading-relaxed">
            {currentProblem.question}
          </p>

          {/* Given block ("Дано") */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isRetro
                ? 'bg-emerald-950/20 border-emerald-600/30'
                : 'bg-slate-950/50 border-slate-800/80'
            }`}
          >
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isRetro ? '20 REM УМОВА ТА ДАНІ:' : 'Дано за умовою:'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm font-mono">
              {currentProblem.given.map((g, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className={isRetro ? 'text-emerald-300' : 'text-cyan-300 font-semibold'}>
                    {g.label} =
                  </span>
                  <span className="text-white font-bold">{g.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold col-span-2 sm:col-span-1">
                <span>Знайти:</span>
                <span className="underline">{currentProblem.find}</span>
                {currentProblem.unit && (
                  <span className="text-xs font-mono opacity-80">[{currentProblem.unit}]</span>
                )}
              </div>
            </div>
          </div>

          {/* Formula Hint Button */}
          {currentProblem.hint && (
            <div className="pt-1">
              {!showHint ? (
                <button
                  id="show-hint-btn"
                  onClick={() => setShowHint(true)}
                  className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isRetro
                      ? 'text-emerald-500 hover:text-emerald-300'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Потрібна підказка до формули?</span>
                </button>
              ) : (
                <div
                  className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-150 ${
                    isRetro
                      ? 'border-emerald-600/50 bg-emerald-950/40 text-emerald-300 font-mono'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Підказка: </span>
                    <span>{currentProblem.hint}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INPUT WINDOW (The Core User Request - No multiple choices!) */}
        <div
          id="answer-input-window"
          className={`mt-6 pt-6 border-t space-y-4 ${
            isRetro ? 'border-emerald-500/40' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="physics-answer-input"
              className={`block text-xs sm:text-sm font-bold uppercase tracking-wider ${
                isRetro ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {isRetro ? '30 INPUT "ВВЕДІТЬ РОЗРАХОВАНЕ ЧИСЛО = "; ANS' : 'Вікно введення числової відповіді:'}
            </label>

            <button
              onClick={onOpenScratchpad}
              className={`text-xs font-semibold underline transition-colors ${
                isRetro ? 'text-emerald-400' : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              Відкрити калькулятор
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="physics-answer-input"
                type="text"
                autoComplete="off"
                placeholder="Введіть число (напр. 2.5 або 420 або 1/3)"
                value={currentInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (currentIndex === problems.length - 1) {
                      handleSubmitAll();
                    } else {
                      handleNext();
                    }
                  }
                }}
                className={`w-full px-4 py-3.5 text-lg sm:text-xl font-bold font-mono rounded-xl border focus:outline-hidden transition-all ${
                  isRetro
                    ? 'bg-black border-emerald-500 text-emerald-300 placeholder-emerald-800 focus:ring-2 focus:ring-emerald-400/50'
                    : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                }`}
              />
            </div>

            {/* Designated unit badge */}
            {currentProblem.unit && (
              <div
                className={`px-4 py-3.5 rounded-xl border font-mono font-bold text-base sm:text-lg min-w-[70px] text-center ${
                  isRetro
                    ? 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-700 bg-slate-800 text-cyan-300'
                }`}
                title={`Одиниця вимірювання: ${currentProblem.unit}`}
              >
                {currentProblem.unit}
              </div>
            )}
          </div>

          {/* Validation warnings */}
          {inputWarning && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{inputWarning}</span>
            </div>
          )}

          {/* Quick Virtual Numeric Keypad for fast touch / click entry */}
          <div className="pt-2">
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Швидка цифрова панель:</span>
              <span className="text-[10px] opacity-70">можна також вводити з клавіатури</span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '-'].map((k) => (
                <button
                  key={k}
                  type="button"
                  id={`keypad-${k}`}
                  onClick={() => handleKeypadPress(k)}
                  className={`py-2 rounded-lg font-mono font-bold text-sm border transition-all ${
                    isRetro
                      ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'border-slate-800 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {k}
                </button>
              ))}
              <button
                type="button"
                id="keypad-fraction"
                onClick={() => handleKeypadPress('/')}
                className={`col-span-2 sm:col-span-3 py-2 rounded-lg font-mono text-xs font-semibold border transition-all ${
                  isRetro
                    ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900'
                    : 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                title="Дріб (наприклад 1/3)"
              >
                Дріб /
              </button>
              <button
                type="button"
                id="keypad-backspace"
                onClick={handleKeypadBackspace}
                className={`col-span-2 sm:col-span-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all ${
                  isRetro
                    ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900'
                    : 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Delete className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Стерти</span>
              </button>
              <button
                type="button"
                id="keypad-clear"
                onClick={handleKeypadClear}
                className={`col-span-2 sm:col-span-6 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  isRetro
                    ? 'border-red-900/50 bg-red-950/30 text-red-400 hover:bg-red-900/40'
                    : 'border-rose-900/40 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40'
                }`}
              >
                Очистити поле
              </button>
            </div>
          </div>
        </div>

        {/* Action navigation buttons */}
        <div
          className={`mt-8 pt-5 border-t flex flex-wrap items-center justify-between gap-3 ${
            isRetro ? 'border-emerald-500/30' : 'border-slate-800'
          }`}
        >
          <button
            id="test-prev-btn"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : isRetro
                ? 'border border-emerald-700 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Попередня</span>
          </button>

          <div className="flex items-center gap-2">
            {currentIndex < problems.length - 1 ? (
              <button
                id="test-next-btn"
                onClick={handleNext}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all ${
                  isRetro
                    ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                }`}
              >
                <span>Наступна задача</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="test-finish-btn"
                onClick={handleSubmitAll}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                  isRetro
                    ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Завершити тест і перевірити</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
