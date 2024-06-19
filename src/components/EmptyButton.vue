<template>
  <button class="empty-button__control">
    <slot name="icon" class="empty-button__control-arrowicon"> </slot>
  </button>
</template>

<script setup>

</script>

<style scoped> 
.empty-button__control {
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
}
</style>
