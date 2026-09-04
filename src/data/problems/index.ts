import { PhysicsProblem, TopicId } from '../../types';
import { KINEMATICS_PROBLEMS } from './kinematics';
import { DYNAMICS_PROBLEMS } from './dynamics';
import { CONSERVATION_PROBLEMS } from './conservation';
import { HYDROSTATICS_PROBLEMS } from './hydrostatics';
import { THERMODYNAMICS_PROBLEMS } from './thermodynamics';
import { ELECTROSTATICS_PROBLEMS } from './electrostatics';
import { CIRCUITS_PROBLEMS } from './circuits';
import { MAGNETISM_PROBLEMS } from './magnetism';
import { OSCILLATIONS_PROBLEMS } from './oscillations';
import { OPTICS_QUANTUM_PROBLEMS } from './opticsQuantum';

export const ALL_PROBLEMS_BY_TOPIC: Record<TopicId, PhysicsProblem[]> = {
  kinematics: KINEMATICS_PROBLEMS,
  dynamics: DYNAMICS_PROBLEMS,
  conservation: CONSERVATION_PROBLEMS,
  hydrostatics: HYDROSTATICS_PROBLEMS,
  thermodynamics: THERMODYNAMICS_PROBLEMS,
  electrostatics: ELECTROSTATICS_PROBLEMS,
  circuits: CIRCUITS_PROBLEMS,
  magnetism: MAGNETISM_PROBLEMS,
  oscillations: OSCILLATIONS_PROBLEMS,
  optics_quantum: OPTICS_QUANTUM_PROBLEMS,
};

export const ALL_PROBLEMS: PhysicsProblem[] = [
  ...KINEMATICS_PROBLEMS,
  ...DYNAMICS_PROBLEMS,
  ...CONSERVATION_PROBLEMS,
  ...HYDROSTATICS_PROBLEMS,
  ...THERMODYNAMICS_PROBLEMS,
  ...ELECTROSTATICS_PROBLEMS,
  ...CIRCUITS_PROBLEMS,
  ...MAGNETISM_PROBLEMS,
  ...OSCILLATIONS_PROBLEMS,
  ...OPTICS_QUANTUM_PROBLEMS,
];

/**
 * Fisher-Yates shuffle helper to randomly select N problems
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getRandomProblemsForTopic(topicId: TopicId, count = 5): PhysicsProblem[] {
  const pool = ALL_PROBLEMS_BY_TOPIC[topicId] || [];
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count);
}

export function getRandomMixedProblems(count = 5): PhysicsProblem[] {
  const shuffled = shuffleArray(ALL_PROBLEMS);
  return shuffled.slice(0, count);
}
