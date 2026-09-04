import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TopicSelector } from './components/TopicSelector';
import { TestRunner } from './components/TestRunner';
import { TestResultView } from './components/TestResultView';
import { ConstantsModal } from './components/ConstantsModal';
import { ScratchpadModal } from './components/ScratchpadModal';
import { PHYSICS_TOPICS } from './data/topics';
import { getRandomProblemsForTopic, getRandomMixedProblems } from './data/problems';
import { TopicId, PhysicsProblem, UserAnswer, TopicProgress } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'topics' | 'testing' | 'results'>('topics');
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId | 'mixed' | null>(null);
  const [activeProblems, setActiveProblems] = useState<PhysicsProblem[]>([]);
  const [testAnswers, setTestAnswers] = useState<Record<string, UserAnswer>>({});
  const [testTimeSec, setTestTimeSec] = useState(0);

  // Modals
  const [isConstantsOpen, setIsConstantsOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // Retro BASIC Theme toggle
  const [isRetro, setIsRetro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('physics_test_retro') === 'true';
    } catch {
      return false;
    }
  });

  // Progress records for all 10 topics
  const [progress, setProgress] = useState<Record<TopicId, TopicProgress>>(() => {
    try {
      const saved = localStorage.getItem('physics_test_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const initial: Partial<Record<TopicId, TopicProgress>> = {};
    for (const t of PHYSICS_TOPICS) {
      initial[t.id] = {
        topicId: t.id,
        attempts: 0,
        bestScore: null,
        lastScore: null,
      };
    }
    return initial as Record<TopicId, TopicProgress>;
  });

  // Persist retro setting
  useEffect(() => {
    try {
      localStorage.setItem('physics_test_retro', isRetro ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isRetro]);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem('physics_test_progress', JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Start a test for a single topic (5 random problems out of 20)
  const handleStartTopic = (topicId: TopicId) => {
    const selectedProblems = getRandomProblemsForTopic(topicId, 5);
    setSelectedTopicId(topicId);
    setActiveProblems(selectedProblems);
    setTestAnswers({});
    setCurrentView('testing');
  };

  // Start mixed test (5 random problems from all 200)
  const handleStartMixed = () => {
    const selectedProblems = getRandomMixedProblems(5);
    setSelectedTopicId('mixed');
    setActiveProblems(selectedProblems);
    setTestAnswers({});
    setCurrentView('testing');
  };

  // Complete test handler
  const handleFinishTest = (answers: Record<string, UserAnswer>, timeSpentSec: number) => {
    setTestAnswers(answers);
    setTestTimeSec(timeSpentSec);

    // Calculate score
    const correctCount = activeProblems.filter((p) => answers[p.id]?.isCorrect).length;

    // Update progress if not mixed
    if (selectedTopicId && selectedTopicId !== 'mixed') {
      setProgress((prev) => {
        const currentProg = prev[selectedTopicId] || {
          topicId: selectedTopicId,
          attempts: 0,
          bestScore: null,
          lastScore: null,
        };

        const newBest =
          currentProg.bestScore === null
            ? correctCount
            : Math.max(currentProg.bestScore, correctCount);

        return {
          ...prev,
          [selectedTopicId]: {
            ...currentProg,
            attempts: currentProg.attempts + 1,
            bestScore: newBest,
            lastScore: correctCount,
          },
        };
      });
    }

    setCurrentView('results');
  };

  // Retry same topic with 5 newly randomized problems
  const handleRetry = () => {
    if (selectedTopicId === 'mixed') {
      handleStartMixed();
    } else if (selectedTopicId) {
      handleStartTopic(selectedTopicId);
    }
  };

  // Get current active title
  const currentTopicTitle =
    selectedTopicId === 'mixed'
      ? 'Змішаний тест з усіх 10 тем'
      : selectedTopicId
      ? PHYSICS_TOPICS.find((t) => t.id === selectedTopicId)?.title || 'Тест з фізики'
      : undefined;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isRetro
          ? 'bg-black text-emerald-400 font-mono selection:bg-emerald-500 selection:text-black'
          : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white'
      }`}
    >
      {/* Navigation Header */}
      <Navbar
        isRetro={isRetro}
        onToggleRetro={() => setIsRetro((prev) => !prev)}
        onOpenConstants={() => setIsConstantsOpen(true)}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        inTestSession={currentView !== 'topics'}
        onExitTest={() => setCurrentView('topics')}
        topicTitle={currentTopicTitle}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === 'topics' && (
          <TopicSelector
            onStartTopic={handleStartTopic}
            onStartMixed={handleStartMixed}
            progress={progress}
            isRetro={isRetro}
          />
        )}

        {currentView === 'testing' && activeProblems.length > 0 && (
          <TestRunner
            problems={activeProblems}
            topicTitle={currentTopicTitle || 'Тест з фізики'}
            onFinishTest={handleFinishTest}
            onCancel={() => setCurrentView('topics')}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            isRetro={isRetro}
          />
        )}

        {currentView === 'results' && activeProblems.length > 0 && (
          <TestResultView
            problems={activeProblems}
            answers={testAnswers}
            topicTitle={currentTopicTitle || 'Тест з фізики'}
            timeSpentSec={testTimeSec}
            onRetry={handleRetry}
            onBackToTopics={() => setCurrentView('topics')}
            isRetro={isRetro}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`py-6 px-4 border-t text-center text-xs transition-colors ${
          isRetro
            ? 'border-emerald-500/30 text-emerald-600 bg-black font-mono'
            : 'border-slate-900 text-slate-400 bg-slate-950'
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-1">
          <p className="font-semibold text-slate-300">
            {isRetro ? '1985-2026 RETRO BASIC PHYSICS TESTING SYSTEM' : 'Фізичний практикум • 10 тем по 20 задач (200 авторських завдань)'}
          </p>
          <p className="opacity-75">
            Принцип прямого числового розрахунку без варіантів відповідей для справжнього закріплення знань.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ConstantsModal
        isOpen={isConstantsOpen}
        onClose={() => setIsConstantsOpen(false)}
        isRetro={isRetro}
      />

      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        isRetro={isRetro}
      />
    </div>
  );
}
