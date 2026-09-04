export type TopicId =
  | 'kinematics'
  | 'dynamics'
  | 'conservation'
  | 'hydrostatics'
  | 'thermodynamics'
  | 'electrostatics'
  | 'circuits'
  | 'magnetism'
  | 'oscillations'
  | 'optics_quantum';

export interface Topic {
  id: TopicId;
  index: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
}

export interface PhysicsProblem {
  id: string;
  topicId: TopicId;
  numberInTopic: number;
  title: string;
  question: string;
  given: { label: string; value: string }[];
  find: string;
  unit: string;
  expectedAnswer: number;
  tolerancePercent?: number; // e.g. 2.5 means +/- 2.5%
  acceptableAlternatives?: number[];
  formula: string;
  solutionSteps: string[];
  hint: string;
  difficulty: 'базовий' | 'середній' | 'підвищений';
}

export interface UserAnswer {
  problemId: string;
  userRawInput: string;
  rawInput?: string;
  parsedValue: number | null;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface TopicProgress {
  topicId: TopicId;
  attempts: number;
  bestScore: number | null;
  lastScore: number | null;
}

export interface TestSession {
  id: string;
  topicId: TopicId | 'mixed';
  topicTitle: string;
  problems: PhysicsProblem[];
  currentIndex: number;
  answers: Record<string, UserAnswer>;
  startedAt: number;
  finishedAt?: number;
}

export interface PhysicalConstant {
  symbol: string;
  name: string;
  value: string;
  unit: string;
  category: 'mechanics' | 'thermodynamics' | 'electrodynamics' | 'quantum_astro';
}

export interface TopicStat {
  topicId: TopicId;
  attempts: number;
  bestScore: number; // out of 5
  lastCompletedAt?: number;
}
