import Question from "./Question";
import type QuestionNode from "./QuestionNode";

export default class Backend implements QuestionNode {
  private static instance: Backend;

  private readonly questions = new Map<string, Question>();
  private readonly updateListeners = new Set<() => void>();
  
  private time = 0;

  static getInstance() {
    if (!Backend.instance) {
      Backend.instance = new Backend();
    }
    return Backend.instance;
  }

  setTime(time: number) {
    this.time = time;
    this.update();
  }

  getTime() {
    return this.time;
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
    let specifiedTime = 0;
    let numSpecifiedQuesions = 0;
    for (const question of this.questions.values()) {
      if (question.isTimeFixed()) {
        specifiedTime += question.getTime();
        numSpecifiedQuesions++;
      }
    }

    const averageTime = (this.time - specifiedTime) / (this.questions.size - numSpecifiedQuesions);
    for (const question of this.questions.values()) {
      if (!question.isTimeFixed()) {
        question.setTime(averageTime);
      }
      question.update();
    }

    this.updateListeners.forEach(callback => callback());
  }

  public onUpdate(callback: () => void) {
    this.updateListeners.add(callback);
  }

  public startTimer() {
    setInterval(() => {
      this.time++;
      this.update();
    } , 1000);
  }
}