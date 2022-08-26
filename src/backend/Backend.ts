import Question from "./Question";
import type QuestionNode from "./QuestionNode";

export default class Backend implements QuestionNode {
  private static instance: Backend;

  private readonly questions = new Map<string, Question>();
  private readonly updateListeners = new Set<() => void>();

  private timeLimit: number = 0;
  private timeCounter: number = 0;
  private counting: boolean = false;
  private intervalId: ReturnType<typeof setInterval> | undefined;

  static getInstance() {
    if (!Backend.instance) {
      Backend.instance = new Backend();
    }
    return Backend.instance;
  }

  setTimeLimit(timeLimit: number) {
    this.timeLimit = timeLimit;
    this.update();
  }

  getTimeLimit() {
    return this.timeLimit;
  }

  getTimeCounter() {
    return this.timeCounter;
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

  update() {
    let lockedQuestions: Question[] = Array.from(this.questions.values()).filter((question) => question.isLocked());
    let lockedTime = lockedQuestions.reduce((countingSum, question) => countingSum + question.getTimeAlloc(), 0);

    const averageTime = (this.timeLimit - lockedTime) / (this.questions.size - lockedQuestions.length);

    for (const question of this.questions.values()) {
      if (!question.isLocked()) {
        question.setTimeAlloc(averageTime);
      }
      question.update();
    }

    this.updateListeners.forEach(callback => callback());
  }

  public onUpdate(callback: () => void) {
    this.updateListeners.add(callback);
  }

  public startTimer() {
    if (!this.counting) {
      this.intervalId = setInterval(() => {
        this.timeCounter++;
        this.update();
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