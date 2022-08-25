<script lang="ts">
  import QuestionList from "./QuestionList.svelte";
  import type Question from "backend/Question";
  import Backend from "backend/Backend";

  export let question: Question;
  export let label: string;

  let mins: String = "";
  let secs: String = "";
  let isSettingTime = false;
  $: {
    mins = String(Math.floor(question.getTimeAlloc() / 60)).padStart(2, "0");
    secs = String(question.getTimeAlloc() % 60).padStart(2, "0");
  }

  const updateMinutes = (event: Event): void => {
    console.log("hi from minuates");
    if (event.target instanceof HTMLInputElement) {
      const newMinutesVal = parseInt(event.target.value, 10);
      if (!isNaN(newMinutesVal)) {
        console.log("update?")
          question.setFixedTime(newMinutesVal * 60 + question.getSecondVal());
        }
    }
  };

  const updateSeconds = (event: Event): void => {
    console.log("hi from secoands");
    if (event.target instanceof HTMLInputElement) {
      const newSecondsVal = parseInt(event.target.value, 10);
      if (!isNaN(newSecondsVal)) {
        question.setFixedTime(question.getMinuteVal() * 60 + newSecondsVal);
      }
    }
  };

  const setTimeLimit = (event: Event): void => {
    isSettingTime = !isSettingTime;
  };

  const handleClickTimeField = (event:Event) => {event?.stopPropagation();}
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
          on:change={updateSeconds}
        /><span class="time-unit">sec</span>
      </div>
      <button
        class="tooltip"
        on:click={setTimeLimit}
        >Set Time
        <div
          class="tooltiptext time-container"
          class:tooltip-visible={isSettingTime}
        >
          <input
            class="time-field"
            class:fixed-time={question.isTimeFixed()}
            class:tooltip-visible={isSettingTime}
            value={mins}
            type="text"
            placeholder="mm"
            on:click={handleClickTimeField}
            on:change={updateMinutes}
            /><span class="time-unit">min</span>
            <input
            class="time-field"
            class:fixed-time={question.isTimeFixed()}
            class:tooltip-visible={isSettingTime}
            value={secs}
            type="text"
            placeholder="ss"
            on:click={handleClickTimeField}
            on:change={updateSeconds}
          /><span class="time-unit">sec</span>
        </div>
      </button>
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

  /* Tooltip container */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    // width: 180px;
    background-color: rgba(47, 47, 47, 0.76);
    color: #fff;
    text-align: center;
    padding: 6px 8px;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  // .tooltip:focus .tooltiptext {
  //   visibility: visible;
  // }

  .tooltip .tooltip-visible {
    visibility: visible;
  }
</style>
