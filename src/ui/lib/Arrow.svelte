<script>
  let { binary_2e, binary_2f } = $props();
  let direction = $state("");
  let imageType = $state("");
  let src = $derived("assets/arrows/" + direction + imageType);
  let isHidden = $state(true);

  const value2e = parseInt(binary_2e, 2);
  const value2f = parseInt(binary_2f, 2);

  const isMoving = value2e & 1;
  const isUp = (value2e >> 7) & 1;
  const isDown = value2f & 1;

  if (isUp == 1 && isDown == 0) {
    direction = "up";
    imageType = isMoving === 1 ? ".gif" : ".png";
    isHidden = false;
  } else if (isUp == 0 && isDown == 1) {
    direction = "down";
    imageType = isMoving === 1 ? ".gif" : ".png";
    isHidden = false;
  } else {
    isHidden = true;
  }
</script>

<img class="arrow" class:hidden={isHidden} {src} />

<style>
  .arrow {
    flex-shrink: 0;
    width: 200px;
    height: 150px;
    position: relative;
    object-fit: cover;
  }

  .hidden {
    visibility: hidden;
  }
</style>
