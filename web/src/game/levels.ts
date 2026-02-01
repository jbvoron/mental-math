import type { Level } from "../app/state";
import type { Operator } from "./types";

export interface LevelRules {
  level: Level;
  operators: Operator[];
  maxAddSubOperand: number;      // bornes pour +/-
  maxMulTable: number;           // table max (b)
  maxDivOperand: number;         // jusqu'à 100 (niveau 5/6)
  allowThreeOperands: boolean;   // niveau 6
  avoidNegativeResults: boolean; // recommandé 6-12 ans
}

export const LEVELS: Record<Level, LevelRules> = {
  1: { level: 1, operators: ["+"], maxAddSubOperand: 10, maxMulTable: 0,  maxDivOperand: 0,   allowThreeOperands: false, avoidNegativeResults: true },
  2: { level: 2, operators: ["+", "-"], maxAddSubOperand: 10, maxMulTable: 0,  maxDivOperand: 0,   allowThreeOperands: false, avoidNegativeResults: true },
  3: { level: 3, operators: ["+", "-", "×"], maxAddSubOperand: 10, maxMulTable: 5,  maxDivOperand: 0,   allowThreeOperands: false, avoidNegativeResults: true },
  4: { level: 4, operators: ["+", "-", "×"], maxAddSubOperand: 10, maxMulTable: 10, maxDivOperand: 0,   allowThreeOperands: false, avoidNegativeResults: true },
  5: { level: 5, operators: ["+", "-", "×", "÷"], maxAddSubOperand: 10, maxMulTable: 10, maxDivOperand: 100, allowThreeOperands: false, avoidNegativeResults: true },
  6: { level: 6, operators: ["+", "-", "×", "÷"], maxAddSubOperand: 20, maxMulTable: 10, maxDivOperand: 100, allowThreeOperands: true,  avoidNegativeResults: true },
};