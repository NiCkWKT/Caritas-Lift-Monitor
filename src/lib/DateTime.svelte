<script>
  import { onMount } from "svelte";

  let formattedTime = $state("");
  let formattedDate = $state("");
  let dayOfWeek = $state("");

  onMount(() => {
    const interval = setInterval(() => {
      updateDateTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  function updateDateTime() {
    const now = new Date();

    // Get hours, minutes, and seconds
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Format hours to 12-hour time with AM/PM
    if (hours >= 12) {
      formattedTime = `${String(hours - 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    } else {
      formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} AM`;
    }

    // Handle the edge case for 12 PM and 12 AM
    if (hours === 0) {
      formattedTime = `12:${String(minutes).padStart(2, "0")} AM`;
    } else if (hours === 12) {
      formattedTime = `12:${String(minutes).padStart(2, "0")} PM`;
    }

    // Format the date
    const dayOfMonth = String(now.getDate()).padStart(2, "0");
    const month = now.toLocaleDateString("en-US", { month: "short" });
    const year = now.getFullYear().toString();
    formattedDate = `${dayOfMonth}-${month}-${year}`;

    // Format the day of the week
    dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });
  }
</script>

<div class="date-time">
  {formattedTime}
  <br />
  {formattedDate}
  <br />
  {dayOfWeek}
</div>

<style>
  .date-time {
    color: #ffff00;
    text-align: left;
    font-family: "Arial-Bold", sans-serif;
    font-size: 40px;
    font-weight: 700;
    position: relative;
  }
</style>
