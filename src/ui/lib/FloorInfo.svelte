<script>
  let { binary_2c, binary_2e, binary_2f } = $props();
  let floor = $state("LOGO_caritas.png");
  let src = $derived("assets/logos/" + floor);

  let floorMapping = {
    "000001": "LOGO_G.png",
    "000010": "LOGO_1.png",
    "000011": "LOGO_2.png",
    "000100": "LOGO_3.png",
    "000101": "LOGO_4.png",
    "000110": "LOGO_5.png",
    "000111": "LOGO_6.png",
    "011011": "LOGO_LG1.png",
    "011100": "LOGO_LG2.png",
    "011101": "LOGO_LG3.png",
    111010: "LOGO_LG4.png",
    111011: "LOGO_LG5.png",
  };

  const value2c = parseInt(binary_2c, 2);
  const maskedValue = value2c & 0b00111111;
  const maskedBinary = maskedValue.toString(2).padStart(6, "0");
  const floorImage = floorMapping[maskedBinary];

  const value2e = parseInt(binary_2e, 2);
  // const isMoving = value2e & 1;
  const isArrival = (value2e >> 4) & 1;

  const value2f = parseInt(binary_2f, 2);
  const isDoorClosing = (value2f >> 2) & 1;

  if (floorImage && isArrival == 1) {
    floor = floorImage;
  } else if (isDoorClosing == 1) {
    floor = "LOGO_caritas.png";
  }
</script>

<img class="floor-info" {src} />

<style>
  .floor-info {
    width: 1024px;
    height: 768px;
    position: absolute;
    top: calc(50% - 384px);
    object-fit: cover;
  }
</style>
