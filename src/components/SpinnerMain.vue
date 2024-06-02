<template>
  <svg class="spinner__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle class="spinner__circle" cx="50" cy="50" r="45" />
  </svg>
</template>

<script setup>
</script>

<style scoped>
.spinner {
  margin: 0.5rem auto;
  max-width: 8rem;
}

.spinner__svg {
  animation: svg-animation 2s linear infinite;
}

@keyframes svg-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner__circle {
  animation: circle-animation 1.4s ease-in-out infinite both;
  transition: stroke 0.3s linear;
  display: block;
  fill: transparent;
  stroke: var(--cornflower-blue);
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 280;
  stroke-width: 10px;
  transform-origin: 50% 50%;
}

@keyframes circle-animation {
  0%,
  25% {
    stroke-dashoffset: 280;
    transform: rotate(0);
  }
  50%,
  75% {
    stroke-dashoffset: 75;
    transform: rotate(45deg);
  }
  100% {
    stroke-dashoffset: 280;
    transform: rotate(360deg);
  }
}
</style>