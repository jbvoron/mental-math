export type Operator = "+" | "-" | "×" | "÷";

export interface Question {
  text: string;     // "7 + 3"
  answer: number;   // 10
  options: number[]; // 4 propositions mélangées
}