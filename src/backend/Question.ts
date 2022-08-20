import { nanoid } from "nanoid";
import Backend from "./Backend";
import type QuestionNode from "./QuestionNode";

export default class Question implements QuestionNode {
  private readonly iD: string;
  private readonly parent: QuestionNode;

  private time = 0;
  private timeFixed = false;
  private readonly subQuestions = new Map<string, Question>();

  constructor(parent: QuestionNode) {
    this.iD = nanoid();
    this.parent = parent;
  }

  getID() {
    return this.iD;
  }

  getTime() {
    return this.time;
  }

  setTime(time: number) {
    this.time = time;
  }

  getMinuteVal() {
    return Math.floor(this.time / 60);
  }

  getSecondVal() {
    return this.time % 60;
  }

  setFixedTime(time: number) {
    this.setTime(time);
    this.timeFixed = true;
    Backend.getInstance().update();
  }

  unsetFixedTime() {
    this.time = 0;
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
        specifiedTime += question.getTime();
        numSpecifiedQuesions++;
      }
    }

    const averageTime = (this.time - specifiedTime) / (this.subQuestions.size - numSpecifiedQuesions);
    for (const question of this.subQuestions.values()) {
      if (!question.isTimeFixed()) {
        question.setTime(averageTime);
      }
      question.update();
    }
  }

  remove() {
    this.parent.removeQuestion(this.iD);
  }
}