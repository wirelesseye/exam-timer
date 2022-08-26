import { nanoid } from "nanoid";
import Backend from "./Backend";
import type QuestionNode from "./QuestionNode";

export default class Question implements QuestionNode {
  private readonly iD: string;
  private readonly parent: QuestionNode;

  private timeAlloc = 0;
  private timeLocked = false;
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

  allocTime(timeAlloc: number) {
    this.setTimeAlloc(timeAlloc);
    this.lock(); // Locking will call update on backend
    Backend.getInstance().update();
  }

  lock() {
    this.timeLocked = true;
  }

  unlock() {
    this.timeLocked = false;
  }

  isLocked() {
    return this.timeLocked;
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
    let lockedSubQuestions: Question[] = Array.from(this.subQuestions.values()).filter((question) => question.isLocked());
    let lockedTime = lockedSubQuestions.reduce((countingSum, question) => countingSum + question.getTimeAlloc(), 0);

    const averageTime = (this.timeAlloc - lockedTime) / (this.subQuestions.size - lockedSubQuestions.length);

    for (const question of this.subQuestions.values()) {
      if (!question.isLocked()) {
        question.setTimeAlloc(averageTime);
      }
      question.update();
    }
  }

  remove() {
    this.parent.removeQuestion(this.iD);
  }
}