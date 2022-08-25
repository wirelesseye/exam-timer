<script lang="ts">
  import Backend from "backend/Backend";
  import QuestionList from "./setup/QuestionList.svelte";

  let backend = Backend.getInstance();
  backend.onUpdate(() => backend = backend);

  let hours = 0;
  let minutes = 0;

  $: {
    backend.setTimeLimit(hours * 3600 + minutes * 60);
  }
</script>

<div>
  <div>
    <span>Exam time: </span>
    <input type="number" min="0" bind:value={hours}>
    <span>hours</span>
    <input type="number" min="0" bind:value={minutes}>
    <span>minutes</span>
    <button on:click={() => backend.startTimer()}>Start</button>
    <button on:click={() => backend.stopTimer()}>Pause</button>
    <div>
      <div>{`Counter: ${backend.getTimeCounter()}`}</div>
    </div>
  </div>
  <div class="questions-container">
    <p>Questions: </p>
    <button on:click={() => backend.addQuestion()}>Add</button>
    <QuestionList questions={backend.getQuestions()} />
  </div>
</div>

<style>
  .questions-container {
    max-width: 800px;
  }
</style>