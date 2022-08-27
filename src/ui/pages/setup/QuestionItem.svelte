<script lang="ts">
  import QuestionList from "./QuestionList.svelte";
  import type Question from "backend/Question";
  import Backend from "backend/Backend";
  import "styles/tooltip.css";

  export let question: Question;
  export let label: string;

  let mins: String = "";
  let secs: String = "";
  let isSettingTime = false;
  let isLocked = false;
  $: {
    mins = String(Math.floor(question.getTimeAlloc() / 60)).padStart(2, "0");
    secs = String(question.getTimeAlloc() % 60).padStart(2, "0");
  }

  const updateMinutes = (event: Event): void => {
    console.log("hi from minuates");
    if (event.target instanceof HTMLInputElement) {
      const newMinutesVal = parseInt(event.target.value, 10);
      if (!isNaN(newMinutesVal)) {
        question.allocTime(newMinutesVal * 60 + question.getSecondVal());
        isLocked = question.isLocked();
      }
    }
  };

  const updateSeconds = (event: Event): void => {
    console.log("hi from secoands");
    if (event.target instanceof HTMLInputElement) {
      const newSecondsVal = parseInt(event.target.value, 10);
      if (!isNaN(newSecondsVal)) {
        question.allocTime(question.getMinuteVal() * 60 + newSecondsVal);
        isLocked = question.isLocked();
      }
    }
  };

  const setTimeAlloc = (event: Event): void => {
    isSettingTime = !isSettingTime;
  };

  // To prevent losing focus on the input fields when the user clicks away
  // from them.
  const handleClickTimeField = (event: Event) => {
    event?.stopPropagation();
  };
</script>

<div class="question-item">
  <div class="question-item-inner">
    <span>Question {label}</span>
    <div>
      <div class="time-container" class:fixed-time={isLocked}>
        <div class="time-display-field" class:fixed-time={isLocked}>
          {mins}<span class="time-unit">min</span>
        </div>
        <div class="time-display-field" class:fixed-time={isLocked}>
          {secs}<span class="time-unit">sec</span>
        </div>
      </div>
      <button class="tooltip" on:click={setTimeAlloc}
        >Reallocate
        <div
          class="tooltiptext time-container"
          class:tooltip-visible={isSettingTime}
        >
          <input
            class="time-input-field"
            class:fixed-time={isLocked}
            class:tooltip-visible={isSettingTime}
            value={mins}
            type="text"
            placeholder="mm"
            on:click={handleClickTimeField}
            on:change={updateMinutes}
          /><span class="time-unit">min</span>
          <input
            class="time-input-field"
            class:fixed-time={isLocked}
            class:tooltip-visible={isSettingTime}
            value={secs}
            type="text"
            placeholder="ss"
            on:click={handleClickTimeField}
            on:change={updateSeconds}
          /><span class="time-unit">sec</span>
        </div>
      </button>
      {#if isLocked}
        <button
          on:click={() => {
            question.unlock();
            isLocked = question.isLocked();
          }}>Unlock</button
        >
      {:else}
        <button
          on:click={() => {
            question.lock();
            isLocked = question.isLocked();
          }}>Lock</button
        >
      {/if}
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

  input[type="text"].time-input-field {
    border: none;
    font-family: monospace;
  }

  .time-container {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }

  .time-input-field {
    width: 16px;
    margin: 0 2px 0 4px;
    text-align: right;
  }

  .time-display-field {
    font-family: monospace;
    width: 36px;
    margin: 0 2px 0 4px;
    text-align: right;
  }

  .time-unit {
    // display: inline-block;
    margin-left: 2px;
    font-size: 0.8rem;
    font-family: initial;
  }

</style>

