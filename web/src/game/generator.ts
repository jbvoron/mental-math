import { LEVELS } from "./levels";
import type { Level } from "../app/state";
import type { Operator, Question } from "./types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function evalBinary(a: number, op: Operator, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return a / b;
  }
}

/**
 * Génère 4 propositions :
 * - 1 bonne réponse
 * - 3 distracteurs proches et >= 0
 */
function makeOptions(answer: number): number[] {
  const set = new Set<number>();
  set.add(answer);

  const deltas = [1, 2, 3, 4, 5, 10, 11];
  while (set.size < 4) {
    const d = pick(deltas);
    const sign = Math.random() < 0.5 ? -1 : 1;
    const candidate = answer + sign * d;
    if (candidate >= 0) set.add(candidate);
  }
  return shuffle([...set]);
}

/**
 * Contrainte voulue :
 * - Pas de 0 ÷ x ni x ÷ 0
 * - Pas de résultats non entiers
 * - Pas de résultat <= 0 (entier positif strict)
 */
export function generateQuestion(level: Level): Question {
  const rules = LEVELS[level];
  const op = pick(rules.operators);

  // Niveau 6 : parfois expression à 3 opérandes (uniquement + / -)
  const useThree =
    rules.allowThreeOperands &&
    (op === "+" || op === "-") &&
    Math.random() < 0.35;

  if (op === "×") {
    // Résultat > 0 => on exclut 0
    const a = randInt(1, 10);
    const b = randInt(1, rules.maxMulTable);
    const answer = a * b; // forcément >= 1
    return { text: `${a} × ${b}`, answer, options: makeOptions(answer) };
  }

  if (op === "÷") {
    // On évite x/0 (divisor >= 1), et 0/x (quotient >= 1).
    // On garantit aussi : dividend <= maxDivOperand et résultat entier.
    const divisor = randInt(1, 10);

    const maxQuotient = Math.floor(rules.maxDivOperand / divisor);
    const upper = Math.max(1, Math.min(10, maxQuotient));

    const quotient = randInt(1, upper); // >=1 => pas de 0 ÷ x
    const dividend = divisor * quotient; // multiple => résultat entier

    // dividend >= 1 => pas de 0 ÷ x
    return { text: `${dividend} ÷ ${divisor}`, answer: quotient, options: makeOptions(quotient) };
  }

  // + / -
  const max = rules.maxAddSubOperand;
  const a = randInt(0, max);
  const b = randInt(0, max);

  if (!useThree) {
    if (op === "-" && rules.avoidNegativeResults) {
      // On force un résultat strictement > 0 :
      // - hi - lo
      // - mais on exclut hi === lo (résultat 0)
      const hi = Math.max(a, b);
      const lo = Math.min(a, b);
      if (hi === lo) return generateQuestion(level); // évite 0
      const answer = hi - lo; // > 0
      return { text: `${hi} - ${lo}`, answer, options: makeOptions(answer) };
    }

    const answer = evalBinary(a, op, b);

    // Pour l'addition, on évite le seul cas donnant 0 : 0 + 0
    // et on impose answer > 0.
    if (op === "+" && answer <= 0) return generateQuestion(level);

    // Pour le '-' sans avoidNegativeResults (au cas où), on impose aussi > 0
    if (op === "-" && answer <= 0) return generateQuestion(level);

    return { text: `${a} ${op} ${b}`, answer, options: makeOptions(answer) };
  }

  // 3 opérandes : x op y op2 z (évaluation gauche->droite)
  const c = randInt(0, max);
  const op2: Operator = Math.random() < 0.5 ? "+" : "-";

  let answer = evalBinary(a, op, b);
  answer = evalBinary(answer, op2, c);

  // Résultat strictement > 0
  if (rules.avoidNegativeResults && answer <= 0) {
    return generateQuestion(level);
  }

  return { text: `${a} ${op} ${b} ${op2} ${c}`, answer, options: makeOptions(answer) };
}