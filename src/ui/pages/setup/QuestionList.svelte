<script lang="ts">
  import type Question from "backend/Question";
  import QuestionItem from "./QuestionItem.svelte";

  export let questions: Question[];
  export let label: string = "";
</script>

<div>
  {#each questions as question, i (question.getID())}
    <QuestionItem question={question} label={(label ? label + "." : "") + (i + 1)} />
  {/each}
</div>