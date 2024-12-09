<script>
  import { onMount, onDestroy } from "svelte";
  import { binaryCode } from "./lib/shared.svelte";
  import Arrow from "./lib/Arrow.svelte";
  import BottomBar from "./lib/BottomBar.svelte";
  import DateTime from "./lib/DateTime.svelte";
  import FloorDisplay from "./lib/FloorDisplay.svelte";
  import FloorInfo from "./lib/FloorInfo.svelte";

  let ws;
  let binary_2c = $state("00000000");

  onMount(() => {
    connectWebSocket();
  });

  onDestroy(() => {
    if (ws) {
      ws.close();
    }
  });

  function connectWebSocket() {
    ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      console.log("WebSocket Connection established");
    };

    ws.onmessage = (event) => {
      const [control, binaryValue] = event.data.split(",");
      console.log(`Control bit: ${control}, Value: ${binaryValue}`);
      if (control === "2c") {
        if (binaryValue !== binary_2c) {
          binary_2c = binaryValue;
          console.log(`HiHiHI ${binary_2c}`);
        }
      } else if (control === "2d") {
        if (binaryValue !== binaryCode.binary_2d) {
          binaryCode.binary_2d = binaryValue;
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Connection closed. Reconnecting...");
      setTimeout(connectWebSocket, 1000);
    };

    ws.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };
  }
</script>

<main>
  <div class="zone">
    <div class="left">
      <div class="components">
        <Arrow />
        {#key binary_2c}
          <FloorDisplay {binary_2c} />
        {/key}
        <p>{binary_2c}</p>
        <DateTime />
      </div>
    </div>
    <div class="middle">
      <div class="top-bar"></div>
      <img class="zone-table" src="/zones/zone1.png" />
      <BottomBar />
    </div>
    <div class="right">
      <FloorInfo />
    </div>
  </div>
</main>

<style>
  .zone,
  .zone * {
    box-sizing: border-box;
  }
  .zone {
    background: #ffffff;
    height: 768px;
    position: relative;
    overflow: hidden;
  }
  .left {
    background: #c0c0c0;
    width: 294px;
    height: 768px;
    position: absolute;
    left: 0px;
    top: 0px;
    overflow: hidden;
  }
  .components {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 294px;
    height: 682px;
    position: absolute;
    left: 0px;
    top: 43px;
  }
  .middle {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 730px;
    height: 768px;
    position: absolute;
    left: 294px;
    top: calc(50% - 384px);
  }

  .top-bar {
    background: #0404fc;
    align-self: stretch;
    flex-shrink: 0;
    height: 93.39px;
    position: relative;
    overflow: hidden;
  }

  .zone-table {
    flex-shrink: 0;
    width: 730px;
    height: 584px;
    position: relative;
    object-fit: cover;
  }

  .right {
    width: 1024px;
    height: 768px;
    position: absolute;
    left: 1024px;
    top: calc(50% - 384px);
    object-fit: cover;
  }

  .floor-info {
    width: 1024px;
    height: 768px;
    position: absolute;
    left: 1024px;
    top: calc(50% - 384px);
    object-fit: cover;
  }
</style>
