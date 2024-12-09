<script>
  import { onMount, onDestroy } from "svelte";

  let { bottomBars } = $props();
  let src = $state("");
  let timeoutId = null;

  function scheduleNextUpdate() {
    // If displayBottomBars is still running, clearTimeout the previous timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Schedule the next update after 1 second
    timeoutId = setTimeout(() => {
      if (bottomBars.every((flag) => flag === 0)) {
        src = "";
      } else {
        displayBottomBars().then(() => {
          // Once displayBottomBars is done, schedule the next update
          scheduleNextUpdate();
        });
      }
    }, 1000);
  }

  onMount(() => {
    // Start the recursive timeout on component mount
    scheduleNextUpdate();
  });

  onDestroy(() => {
    // Clear the timeout when the component is destroyed
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  });

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  async function displayBottomBars() {
    for (let i = 0; i < bottomBars.length; i++) {
      if (bottomBars[i] == 1) {
        src = `/bottom-bars/bar${i}.png`;
        await sleep(1000);
      }
    }
  }
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
