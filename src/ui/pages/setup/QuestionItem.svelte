<script lang="ts">
  import QuestionList from "./QuestionList.svelte";
  import type Question from "backend/Question";

  export let question: Question;
  export let label: string;
</script>

<div class="question-item">
  <div class="question-item-inner">
    <span>Question {label}</span>
    <div>
      <span class:fixed-time={question.isTimeFixed()}>{question.getTime().toFixed(2)} min</span>
      <button on:click={() => question.setFixedTime(5)}>Set Time</button>
      <button on:click={() => question.addQuestion()}>Add</button>
      <button on:click={() => question.remove()}>Remove</button>
    </div>
  </div>
  {#if question.hasQuestions()}
    <div class="subquesions-container">
      <QuestionList questions={question.getQuestions()} label={label} />
    </div>
  {/if}
</div>

<style lang="scss">
  .question-item {
    display: flex;
    flex-direction: column;
    &:hover {
      background-color: rgba(0, 0, 0, .1);
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
    color: rgb(17, 0, 255);
  }
</style>