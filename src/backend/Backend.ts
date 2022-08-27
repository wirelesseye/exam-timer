import { timeLeft } from "stores/timer-store";
import Question from "./Question";
import type QuestionNode from "./QuestionNode";

export default class Backend implements QuestionNode {
  private static instance: Backend;

  private readonly questions = new Map<string, Question>();
  private readonly updateListeners = new Set<() => void>();

  private timeLimit: number = 100 * 60 + 52;
  private timeCounter: number = 0;
  private counting: boolean = false;
  private intervalId: ReturnType<typeof setInterval> | undefined;

  private constructor() {
    this.setTimeLimit(100*60 + 52);
  }

  static getInstance() {
    if (!Backend.instance) {
      Backend.instance = new Backend();
    }
    return Backend.instance;
  }

  setTimeLimit(timeLimit: number) {
    this.timeLimit = timeLimit;
    timeLeft.set(timeLimit);
    console.log(`set time limit to ${timeLimit}`);
    this.update();
  }

  getTimeLimit() {
    return this.timeLimit;
  }

  getTimeCounter() {
    return this.timeCounter;
  }

  isCounting() {
    return this.counting;
  }

  getTimeLeft() {
    return this.timeLimit - this.timeCounter;
  }

  addQuestion() {
    const question = new Question(this);
    this.questions.set(question.getID(), question);
    this.update();
  }

  removeQuestion(iD: string) {
    this.questions.delete(iD);
    this.update();
  }

  getQuestions() {
    return [...this.questions.values()];
  }

  update(): boolean {
    let lockedQuestions: Question[] = Array.from(this.questions.values()).filter((question) => question.isLocked());
    let lockedTime = lockedQuestions.reduce((countingSum, question) => countingSum + question.getTimeAlloc(), 0);

    if (this.questions.size - lockedQuestions.length === 0) {
      return false;
    }
    const averageTime = (this.timeLimit - lockedTime) / (this.questions.size - lockedQuestions.length);
    console.log(averageTime);

    for (const question of this.questions.values()) {
      if (!question.isLocked()) {
        question.setTimeAlloc(averageTime);
      }
      question.update();
    }

    this.updateListeners.forEach(callback => callback());

    return true;
  }

  public onUpdate(callback: () => void) {
    this.updateListeners.add(callback);
  }

  public startTimer() {
    if (!this.counting) {
      this.intervalId = setInterval(() => {
        this.timeCounter++;
        this.update();
        timeLeft.update(i => i - 1);
        console.log(this.timeCounter);
      }, 1000);

      this.counting = true;
    }
  }

  public stopTimer() {
    if (this.counting && this.intervalId) {
      clearInterval(this.intervalId);
      this.counting = false;
    }
  }
}