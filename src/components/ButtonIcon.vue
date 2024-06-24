<template>
  <button class="button-icon__control">
    <slot name="icon" class="button-icon__control-arrowicon"> </slot>
  </button>
</template>

<script setup>

</script>

<style scoped> 
.button-icon__control {
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
}
</style>
