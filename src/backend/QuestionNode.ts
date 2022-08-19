import type Question from "./Question";

export default interface QuestionNode {
  addQuestion(): void;
  removeQuestion(iD: string): void;
  getQuestions(): Question[];
  update(): void;
}