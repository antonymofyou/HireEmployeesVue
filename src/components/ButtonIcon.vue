<template>
  <button class="button-icon__control">
    <slot name="icon" class="button-icon__control-arrowicon" />
  </button>
</template>

<script setup></script>

<style scoped>
.button-icon__control {
  cursor: pointer;

  display: flex;
  align-items: center;

  background-color: transparent;
  border: none;
}
</style>
