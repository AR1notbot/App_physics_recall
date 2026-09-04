import { PhysicsProblem } from '../types';

export interface CheckResult {
  isValidNumber: boolean;
  parsedValue: number | null;
  isCorrect: boolean;
  percentError?: number;
  matchedTarget?: number;
}

/**
 * Parses user input string which may contain:
 * - commas or dots as decimal separator (e.g. "3,14" or "3.14")
 * - simple fractions (e.g. "1/3", "3/4")
 * - scientific notation (e.g. "2e-4", "2*10^4", "2 x 10^4")
 * - trailing unit letters accidentally entered (strip them if user types "25 м" or "72 км/год")
 */
export function parseUserNumber(input: string): number | null {
  if (!input) return null;
  let clean = input.trim();

  // Strip known trailing unit tokens if user typed them by habit
  clean = clean.replace(/(м\/с²|м\/с|км\/год|кПа|Па|Дж|кДж|МДж|Вт|кВт|Н·м|Н|Ом|В|А|Тл|Гн|Вб|Гц|дптр|мкФ|Ф|Кл|нКл|мкКл|еВ|моль|кг|г|см|мм|м|с|хв|год|%)\s*$/i, '').trim();

  // If user entered a fraction like "1/3" or "3/4"
  if (/^[-+]?\s*\d+(?:[.,]\d+)?\s*\/\s*\d+(?:[.,]\d+)?$/.test(clean)) {
    const parts = clean.split('/');
    const numerator = parseFloat(parts[0].replace(',', '.').replace(/\s+/g, ''));
    const denominator = parseFloat(parts[1].replace(',', '.').replace(/\s+/g, ''));
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }

  // Handle scientific notation formats like "3.2*10^-17" or "3.2x10^-17" or "3.2e-17"
  const sciRegex = /^([-+]?\d*(?:[.,]\d+)?)\s*(?:[*x×]\s*10\^?([+-]?\d+)|e([+-]?\d+))$/i;
  const sciMatch = clean.match(sciRegex);
  if (sciMatch) {
    const base = parseFloat(sciMatch[1].replace(',', '.'));
    const exp = parseInt(sciMatch[2] || sciMatch[3], 10);
    if (!isNaN(base) && !isNaN(exp)) {
      return base * Math.pow(10, exp);
    }
  }

  // Replace comma with dot
  clean = clean.replace(',', '.');

  const num = parseFloat(clean);
  if (isNaN(num)) return null;
  return num;
}

/**
 * Checks whether user answer matches problem target with acceptable physical tolerance
 */
export function checkPhysicsAnswer(rawInput: string, problem: PhysicsProblem): CheckResult {
  const parsed = parseUserNumber(rawInput);
  if (parsed === null) {
    return {
      isValidNumber: false,
      parsedValue: null,
      isCorrect: false,
    };
  }

  const defaultTolerancePct = problem.tolerancePercent ?? 2.5; // default 2.5% tolerance
  const targets = [problem.expectedAnswer, ...(problem.acceptableAlternatives || [])];

  for (const target of targets) {
    // If target is 0
    if (Math.abs(target) < 1e-9) {
      if (Math.abs(parsed) < 1e-4) {
        return {
          isValidNumber: true,
          parsedValue: parsed,
          isCorrect: true,
          percentError: 0,
          matchedTarget: target,
        };
      }
      continue;
    }

    const absDiff = Math.abs(parsed - target);
    const relDiffPct = (absDiff / Math.abs(target)) * 100;

    // Direct match or within tolerance percent (or within 0.05 absolute for small numbers < 1)
    if (relDiffPct <= defaultTolerancePct || (Math.abs(target) <= 1 && absDiff <= 0.02)) {
      return {
        isValidNumber: true,
        parsedValue: parsed,
        isCorrect: true,
        percentError: relDiffPct,
        matchedTarget: target,
      };
    }
  }

  // If not matched, compute percent error relative to expectedAnswer
  const primaryAbsDiff = Math.abs(parsed - problem.expectedAnswer);
  const primaryRelDiffPct =
    Math.abs(problem.expectedAnswer) > 1e-9
      ? (primaryAbsDiff / Math.abs(problem.expectedAnswer)) * 100
      : primaryAbsDiff;

  return {
    isValidNumber: true,
    parsedValue: parsed,
    isCorrect: false,
    percentError: primaryRelDiffPct,
    matchedTarget: problem.expectedAnswer,
  };
}
