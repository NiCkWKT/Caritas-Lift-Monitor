<script>
  import { onMount, onDestroy } from "svelte";

  let { bottomBars } = $props();
  let src = $state("");
  let isRunning = $state(false);
  let timeoutId = null;
  let destroyed = false;

  $effect(() => {
    if (!bottomBars.some((flag) => flag === 1)) {
      src = "";
      isRunning = false;
    } else if (!isRunning) {
      startDisplay();
    }
  });

  function startDisplay() {
    if (destroyed) return;

    isRunning = true;
    displayNextBar(0);
  }

  function displayNextBar(index) {
    if (destroyed || !isRunning) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // If we've reached the end, start over
    if (index >= bottomBars.length) {
      if (bottomBars.some((flag) => flag === 1)) {
        displayNextBar(0);
      } else {
        isRunning = false;
        src = "";
      }
      return;
    }

    // If current bar is active, show it and wait
    if (bottomBars[index] === 1) {
      src = `assets/bottom-bars/bar${index}.png`;
      timeoutId = setTimeout(() => {
        displayNextBar(index + 1);
      }, 2000);
    } else {
      // If current bar is inactive, immediately move to next
      src = "";
      displayNextBar(index + 1);
    }
  }

  onMount(() => {
    if (bottomBars.some((flag) => flag === 1)) {
      startDisplay();
    }
  });

  onDestroy(() => {
    destroyed = true;
    isRunning = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
</script>

<img class="bottom-bar" {src} />

<style>
  .bottom-bar {
    background: #0404fc;
    align-self: stretch;
    flex-shrink: 0;
    height: 93.39px;
    position: relative;
    object-fit: cover;
  }
</style>
