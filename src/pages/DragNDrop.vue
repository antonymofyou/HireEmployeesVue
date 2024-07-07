<template>
  <div class="page">
    <DragAndDrop />
  </div>
</template>

<script setup>
import DragAndDrop from "@/components/DragAndDrop.vue";
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>