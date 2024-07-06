<template>
  <div class="page">
    <DragAndDrop  />
    <Statuses />
  </div>
</template>

<script setup>
 import DragAndDrop from "@/components/DragAndDrop.vue";
 import Statuses from "@/components/Statuses.vue";
 import { ref } from "vue";
 const files = ref([]);
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