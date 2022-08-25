import { nanoid } from "nanoid";
import Backend from "./Backend";
import type QuestionNode from "./QuestionNode";

export default class Question implements QuestionNode {
  private readonly iD: string;
  private readonly parent: QuestionNode;

  private timeAlloc = 0;
  private timeFixed = false;
  private readonly subQuestions = new Map<string, Question>();

  constructor(parent: QuestionNode) {
    this.iD = nanoid();
    this.parent = parent;
  }

  getID() {
    return this.iD;
  }

  getTimeAlloc() {
    return this.timeAlloc;
  }

  setTimeAlloc(timeAlloc: number) {
    this.timeAlloc = timeAlloc;
  }

  getMinuteVal() {
    return Math.floor(this.timeAlloc / 60);
  }

  getSecondVal() {
    return this.timeAlloc % 60;
  }

  setFixedTime(timeAlloc: number) {
    this.setTimeAlloc(timeAlloc);
    this.timeFixed = true;
    Backend.getInstance().update();
  }

  unsetFixedTime() {
    this.timeAlloc = 0;
    this.timeFixed = false;
  }

  isTimeFixed() {
    return this.timeFixed;
  }

  hasQuestions() {
    return this.subQuestions.size > 0;
  }

  addQuestion() {
    const question = new Question(this);
    this.subQuestions.set(question.getID(), question);
    Backend.getInstance().update();
  }

  removeQuestion(iD: string): void {
    this.subQuestions.delete(iD);
    Backend.getInstance().update();
  }

  getQuestions() {
    return [...this.subQuestions.values()];
  }

  update(): void {
    let specifiedTime = 0;
    let numSpecifiedQuesions = 0;
    for (const question of this.subQuestions.values()) {
      if (question.isTimeFixed()) {
        specifiedTime += question.getTimeAlloc();
        numSpecifiedQuesions++;
      }
    }

    const averageTime = (this.timeAlloc - specifiedTime) / (this.subQuestions.size - numSpecifiedQuesions);
    for (const question of this.subQuestions.values()) {
      if (!question.isTimeFixed()) {
        question.setTimeAlloc(averageTime);
      }
      question.update();
    }
  }

  remove() {
    this.parent.removeQuestion(this.iD);
  }
}