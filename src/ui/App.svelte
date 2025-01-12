<script>
  import { onMount } from "svelte";
  import Arrow from "./lib/Arrow.svelte";
  import BottomBar from "./lib/BottomBar.svelte";
  import DateTime from "./lib/DateTime.svelte";
  import FloorDisplay from "./lib/FloorDisplay.svelte";
  import FloorInfo from "./lib/FloorInfo.svelte";

  let binary_2c = $state("00000000");
  let binary_2d = $state("00000000");
  let binary_2e = $state("00000000");
  let binary_2f = $state("00000000");
  let currentZoneImage = $state("zone2.png");

  let bottomBars = $state([0, 0, 0, 0, 0, 0, 0, 0]);

  onMount(() => {
    connectIpcRenderer();
  });

  function extract2dBottomBarFlags() {
    const value = parseInt(binary_2d, 2);
    bottomBars[0] = (value >> 4) & 1;
    bottomBars[1] = (value >> 5) & 1;
  }

  function extract2eBottomBarFlags() {
    const value = parseInt(binary_2e, 2);
    bottomBars[2] = (value >> 2) & 1;
  }

  function extract2fBottomBarFlags() {
    const value = parseInt(binary_2f, 2);
    bottomBars[3] = (value >> 3) & 1;
    bottomBars[4] = (value >> 4) & 1;
    bottomBars[5] = (value >> 5) & 1;
    bottomBars[6] = (value >> 6) & 1;
    bottomBars[7] = (value >> 7) & 1;
  }

  async function importIpcRenderer() {
    if (!window.require) {
      throw new Error("window.require is not defined");
    }
    const electron = window.require("electron");
    return electron.ipcRenderer;
  }

  async function setupZoneImageListener(ipcRenderer) {
    ipcRenderer.on("change-zone", (event, imageName) => {
      currentZoneImage = imageName;
    });
  }

  function connectIpcRenderer() {
    importIpcRenderer().then((ipcRenderer) => {
      ipcRenderer.on("serial-data", (event, data) => {
        const control = data.controlByte;
        const binaryValue = data.value;

        switch (control) {
          case "2c":
            if (binaryValue !== binary_2c) {
              binary_2c = binaryValue;
            }
            break;
          case "2d":
            if (binaryValue !== binary_2d) {
              binary_2d = binaryValue;
              extract2dBottomBarFlags();
            }
            break;
          case "2e":
            if (binaryValue !== binary_2e) {
              binary_2e = binaryValue;
              extract2eBottomBarFlags();
            }
            break;
          case "2f":
            if (binaryValue !== binary_2f) {
              binary_2f = binaryValue;
              extract2fBottomBarFlags();
            }
            break;
          default:
            console.log(`Error in receiving serial data, data: ${data}`);
        }
      });

      // Add zone image listener
      setupZoneImageListener(ipcRenderer);
    });
  }
</script>

<main>
  <div class="zone">
    <div class="left">
      <div class="components">
        {#key [binary_2e, binary_2f]}
          <Arrow {binary_2e} {binary_2f} />
        {/key}
        {#key binary_2c}
          <FloorDisplay {binary_2c} />
        {/key}
        <DateTime />
      </div>
    </div>
    <div class="middle">
      <div class="top-bar"></div>
      <img class="zone-table" src={`assets/zones/${currentZoneImage}`} />
      {#key bottomBars}
        <BottomBar {bottomBars} />
      {/key}
    </div>
    <div class="right">
      {#key [binary_2c, binary_2e, binary_2f]}
        <FloorInfo {binary_2c} {binary_2e} {binary_2f} />
      {/key}
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
    /* height: 584px; */
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
</style>
