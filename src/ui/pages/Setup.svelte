<script lang="ts">
  import Backend from "backend/Backend";
  import QuestionList from "./setup/QuestionList.svelte";
  import "styles/tooltip.css";

  let backend = Backend.getInstance();
  backend.onUpdate(() => (backend = backend));

  let hrsDisplay = 1;
  let minDisplay = 40;
  let secDisplay = 40;

  let isSettingTime = false;
  let isActive = false;

  $: {
    backend.setTimeLimit(hrsDisplay * 3600 + minDisplay * 60);
  }

  const setTimeLimit = (event: Event): void => {
    isSettingTime = !isSettingTime;
  };

  const toggleActive = (event: Event): void => {
    isActive = !isActive;
    console.log("oggle active");
  };
</script>

<div>
  <div>
    <div>Exam time:</div>
    <div class="clock-face-container">
      <div
        class="clock-face electric-btn"
        class:clock-face-active={isActive}
        class:electric-btn-active={isActive}
        on:click={toggleActive}
      >
        <div class="time-group">
          <span class="time-digit">{hrsDisplay}</span><span class="time-unit"
            >h</span
          >
          <div class="time-group-overlay">
            <span class="time-digit">{hrsDisplay}</span><span class="time-unit"
              >h</span
            >
          </div>
        </div>
        <div class="time-group">
          <span class="time-digit">{minDisplay}</span><span class="time-unit"
            >m</span
          >
          <div class="time-group-overlay">
            <span class="time-digit">{minDisplay}</span><span class="time-unit"
              >m</span
            >
          </div>
        </div>
        <div class="time-group">
          <span class="time-digit">{secDisplay}</span><span class="time-unit"
            >s</span
          >
          <div class="time-group-overlay">
            <span class="time-digit">{secDisplay}</span><span class="time-unit"
              >s</span
            >
          </div>
        </div>
        <svg>
          <rect x="0" y="0" fill="none" width="100%" height="100%" />
        </svg>
      </div>
    </div>

    <div class="time-container">
      <div class="time-display-field">
        {minDisplay}<span class="time-unit">min</span>
      </div>
      <div class="time-display-field">
        {secDisplay}<span class="time-unit">sec</span>
      </div>
    </div>

    <button on:click={() => backend.startTimer()}>Start</button>
    <button on:click={() => backend.stopTimer()}>Pause</button>
    <div>
      <div>{`Counter: ${backend.getTimeCounter()}`}</div>
    </div>
  </div>
  <div class="questions-container">
    <p>Questions:</p>
    <button on:click={() => backend.addQuestion()}>Add</button>
    <QuestionList questions={backend.getQuestions()} />
  </div>
</div>

<style lang="scss">
  $red: #34a5ea;
  $white: #fff;
  .questions-container {
    max-width: 800px;
  }

  .clock-face-container {
    height: 7rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .clock-face {
    margin: 0 auto;
    padding: 1rem 2rem;
    position: relative;
    display: flex;
    width: fit-content;
    font-family: monospace;
    font-weight: 600;
    font-size: 3.2rem;
    transition: font-size 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    transition: padding 0.6s cubic-bezier(0.25, 1, 0.5, 1);

    &:hover {
      // background: linear-gradient(90deg, rgba(111,63,230,1) 0%, rgba(163,30,186,1) 45%, rgba(231,73,133,1) 100%);
      // background: rgb(52, 234, 122);
      // color: linear-gradient(90deg, rgba(31,33,198,1) 0%, rgba(39,89,235,1) 35%, rgba(11,145,217,1) 100%);
      //     background-clip: text;
      //     -webkit-background-clip: text;
      //     -moz-background-clip: text;
      // -webkit-text-fill-color: transparent;
      // -moz-text-fill-color: transparent;
      letter-spacing: 3px;
      padding: 1.3rem 2.6rem;
      cursor: pointer;
    }

    &:active {
      transition: all 0.18s cubic-bezier(0.22, 1, 0.36, 1);
      padding: 1.2rem 2.4rem;
      font-size: 3rem;
      filter: brightness(90%);
    }
  }

  .clock-face-active {
    padding: 1.3rem 2.6rem;
    letter-spacing: 1px;

    &:hover {
      padding: 1.4rem 2.8rem;
    }

    &:active {
      padding: 1.3rem 2.6rem;
    }
  }

  .time-group {
    color: #3a3a3ab6;
    opacity: 1;
    mix-blend-mode: color-burn;
    position: relative;
  }

  .time-group:not(:first-child) {
    margin-left: 0.8rem;
  }

  .time-group-overlay {
    position: absolute;
    top: 0;
    left: 0;
    color: #c3c3c3;
    opacity: 0.5;
  }
  .time-digit {
  }

  .time-unit {
    font-size: 1.4rem;
    margin-left: 0.4rem;
  }

  .electric-btn {
    background: linear-gradient(
      90deg,
      rgb(197, 109, 234) 0%,
      rgb(107, 129, 229) 35%,
      rgb(118, 200, 232) 100%
    );
    transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);

    svg {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;

      rect {
        fill: none;
        stroke: rgba(255, 255, 255, 0.507);
        stroke-width: 6px;
        stroke-dasharray: 320, 0;
        stroke-dashoffset: 0;
        transition: all 0.45s ease-in;

        animation-name: electric-flow;
        animation-duration: 12s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-play-state: paused;
        // animation-fill-mode: both;
      }
    }
    &:hover {
      background: linear-gradient(
        90deg,
        rgb(57, 60, 231) 0%,
        rrgb(53, 120, 236) 35%,
        rgb(46, 178, 231) 80%
      );
      rect {
        stroke-width: 8px;
        stroke: rgba(255, 255, 255, 0.678);
        stroke-dasharray: 30, 290; // Must sum to factor of 320
        stroke-dashoffset: 640;
        transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);
      }
    }
  }

  .electric-btn-active {
    svg {
      rect {
        stroke-dasharray: 30, 290; // Must sum to factor of 320
        transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);
        animation-play-state: running;
        // animation-name: electric-flow;
        // animation-duration: 8s;
        // animation-timing-function: linear;
        // animation-iteration-count: infinite;
        // animation-fill-mode: both;
      }
    }
  }

  @keyframes electric-flow {
    0% {
      stroke-dashoffset: 1280;
    }
    100% {
      stroke-dashoffset: 1600;
    }
  }
</style>
