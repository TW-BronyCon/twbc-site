<template>
  <div class="background-container">
  </div>
</template>

<script setup>
// No logic needed for solid color background
</script>

<style scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background-color: #2b163d; /* Dark purple matching site scheme */
}
</style>
