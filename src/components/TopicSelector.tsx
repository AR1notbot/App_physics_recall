import React from 'react';
import { PHYSICS_TOPICS } from '../data/topics';
import { ALL_PROBLEMS } from '../data/problems';
import { TopicId, TopicProgress } from '../types';
import {
  Play,
  Shuffle,
  Trophy,
  CheckCircle2,
  Brain,
  Hash,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface TopicSelectorProps {
  onStartTopic: (topicId: TopicId) => void;
  onStartMixed: () => void;
  progress: Record<TopicId, TopicProgress>;
  isRetro?: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onStartTopic,
  onStartMixed,
  progress,
  isRetro,
}) => {
  // Calculate aggregate stats
  const progressList = Object.values(progress) as TopicProgress[];
  const totalAttempts = progressList.reduce((acc, p) => acc + (p?.attempts || 0), 0);
  const masteredTopics = progressList.filter((p) => p?.bestScore === 5).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero / Introduction banner */}
      <div
        id="hero-banner"
        className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden transition-all ${
          isRetro
            ? 'bg-slate-950 border-emerald-500/60 font-mono text-emerald-400'
            : 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border-slate-800 text-slate-100 shadow-xl'
        }`}
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Brain className="w-3.5 h-3.5" />
            <span>Класичний підхід до перевірки знань</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Тестування знань з фізики
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${isRetro ? 'text-emerald-500' : 'text-slate-300'}`}>
            <strong>10 тем по 20 задач у базі.</strong> Для кожного сеансу тестування система випадковим чином обирає{' '}
            <span className="underline decoration-cyan-500 font-semibold">5 задач</span>.
            Головна відмінність: <strong>жодних готових варіантів відповідей!</strong> Ви самостійно розраховуєте шукану фізичну величину та вводите числове значення через вікно введення.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span><strong>{ALL_PROBLEMS.length}</strong> задач у базі</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span><strong>{masteredTopics} / 10</strong> тем на 5/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Пройдено спроб: <strong>{totalAttempts}</strong></span>
            </div>
          </div>

          {/* Mixed test action */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              id="start-mixed-test-btn"
              onClick={onStartMixed}
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 ${
                isRetro
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              <span>Змішаний експрес-тест (5 задач з усіх 10 тем)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none select-none font-mono text-9xl font-black">
          E=mc²
        </div>
      </div>

      {/* Grid of 10 topics */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isRetro ? '10 КАТЕГОРІЙ ФІЗИКИ:' : 'Оберіть тему для тестування:'}
            </h2>
            <p className={`text-xs sm:text-sm ${isRetro ? 'text-emerald-500/80' : 'text-slate-400'}`}>
              Кожна тема містить 20 авторських задач. Оберіть тему, щоб розпочати вибірку 5 завдань.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
          {PHYSICS_TOPICS.map((topic) => {
            const topicProg = progress[topic.id] || {
              topicId: topic.id,
              attempts: 0,
              bestScore: null,
              lastScore: null,
            };
            const hasBest = topicProg.bestScore !== null;
            const isPerfect = topicProg.bestScore === 5;

            return (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between group ${
                  isRetro
                    ? 'bg-slate-950 border-emerald-600/40 hover:border-emerald-400 font-mono text-emerald-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-100 shadow-md'
                }`}
              >
                <div>
                  {/* Card top badge & index */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isRetro
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 text-cyan-300 border border-slate-700'
                      }`}
                    >
                      Тема #{topic.index}
                    </span>

                    {hasBest && (
                      <div
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isPerfect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <Trophy className="w-3 h-3" />
                        <span>Кращий: {topicProg.bestScore} / 5</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold group-hover:text-cyan-400 transition-colors">
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`mt-1.5 text-xs sm:text-sm line-clamp-2 ${
                      isRetro ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  >
                    {topic.description}
                  </p>
                </div>

                {/* Card footer info & start button */}
                <div
                  className={`mt-5 pt-3.5 border-t flex items-center justify-between gap-3 ${
                    isRetro ? 'border-emerald-500/30' : 'border-slate-800'
                  }`}
                >
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">20 задач у базі</span>
                    <span className="mx-1.5">•</span>
                    <span>5 у тесті</span>
                  </div>

                  <button
                    id={`start-topic-${topic.id}-btn`}
                    onClick={() => onStartTopic(topic.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                      isRetro
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Почати тест</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
