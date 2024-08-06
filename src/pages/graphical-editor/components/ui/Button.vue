<template>
  <button class="button">
    <slot />
  </button>
</template>

<style scoped>
.button {
  appearance: none;
  border: none;
  cursor: pointer;
  background: none;

  font-size: 14px;
  padding: 6px 15px;
  border-radius: 4px;
  
  color: rgba(0, 0, 0, 0.7);
  background-color: rgba(68, 71, 70, .03);

  transition: background ease 0.2s, opacity ease 0.1s;
}

.button:hover {
  background-color: rgba(68, 71, 70, .1);
}

.button:active {
  opacity: 0.6;
}

.button:disabled {
  color: rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0);
  pointer-events: none;
}
</style>