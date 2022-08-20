<script lang="ts">
  import QuestionList from "./QuestionList.svelte";
  import type Question from "backend/Question";
  import Backend from "backend/Backend";

  export let question: Question;
  export let label: string;

  let mins: String = "";
  let secs: String = "";
  $: {
    mins = String(Math.floor(question.getTime())).padStart(2, "0");
    secs = String((question.getTime() % 1) * 60).padStart(2, "0");
  }
</script>

<div class="question-item">
  <div class="question-item-inner">
    <span>Question {label}</span>
    <div>
      <div class="time-container" class:fixed-time={question.isTimeFixed()}>
        <input
          class="time-field"
          class:fixed-time={question.isTimeFixed()}
          bind:value={mins}
          type="text"
          placeholder="mm"
        /><span class="time-unit">min</span>
        <input
          class="time-field"
          class:fixed-time={question.isTimeFixed()}
          bind:value={secs}
          type="text"
          placeholder="ss"
        /><span class="time-unit">sec</span>
      </div>
      <button on:click={() => question.setFixedTime(5)}>Set Time</button>
      <button on:click={() => question.addQuestion()}>Add</button>
      <button on:click={() => question.remove()}>Remove</button>
    </div>
  </div>
  {#if question.hasQuestions()}
    <div class="subquesions-container">
      <QuestionList questions={question.getQuestions()} {label} />
    </div>
  {/if}
</div>

<style lang="scss">
  .question-item {
    display: flex;
    flex-direction: column;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .question-item-inner {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }
  .subquesions-container {
    margin-left: 5px;
  }
  .fixed-time {
    color: rgb(19, 140, 234);
  }

  input[type="text"].time-field {
    border: none;
    font-family: monospace;
  }

  .time-container {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }

  .time-field {
    width: 16px;
    margin: 0 2px 0 4px;
    text-align: right;
  }

  .time-unit {
    font-size: 0.8rem;
  }
</style>
