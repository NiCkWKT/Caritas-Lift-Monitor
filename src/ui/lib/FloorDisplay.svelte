<script>
  const floorMapping = {
    "000001": "G.png",
    "000010": "1.png",
    "000011": "2.png",
    "000100": "3.png",
    "000101": "4.png",
    "000110": "5.png",
    "000111": "6.png",
    "001000": "7.png",
    "001001": "8.png",
    "001010": "9.png",
    "001011": "10.png",
    "001100": "11.png",
    "001101": "12.png",
    "001110": "13.png",
    "001111": "14.png",
    "010000": "15.png",
    "010001": "16.png",
    "010010": "17.png",
    "010011": "18.png",
    "010100": "19.png",
    "010101": "20.png",
    "010110": "21.png",
    "010111": "22.png",
    "011001": "R.png",
    "011011": "LG1.png",
    "011100": "LG2.png",
    "011101": "LG3.png",
    100000: "B1.png",
    100001: "B2.png",
    101101: "23.png",
    101110: "24.png",
    101111: "25.png",
    110000: "26.png",
    110001: "27.png",
    110010: "28.png",
    110011: "29.png",
    110100: "30.png",
    110101: "31.png",
    111000: "1M.png",
    111010: "LG4.png",
    111011: "LG5.png",
  };

  let { binary_2c } = $props();
  let src = $state("");
  let isHidden = $state(true);

  // Apply mask 00111111 to get last 6 bits
  const value = parseInt(binary_2c, 2);
  const maskedValue = value & 0b00111111;

  // Convert masked value back to binary string (padded to 6 bits)
  const maskedBinary = maskedValue.toString(2).padStart(6, "0");

  // Get corresponding floor image name from mapping
  const floorImage = floorMapping[maskedBinary];

  if (floorImage) {
    src = `assets/floors/${floorImage}`;
    isHidden = false;
    // console.log(`Floor changed to: ${floorImage} (binary: ${maskedBinary})`);
  } else {
    isHidden = true;
    console.log(`Unknown floor: ${binary_2c}`);
  }
</script>

<img class="floor" class:hidden={isHidden} {src} />

<style>
  .floor {
    flex-shrink: 0;
    width: 250px;
    height: 250px;
    position: relative;
    object-fit: cover;
  }

  .hidden {
    visibility: hidden;
  }
</style>
