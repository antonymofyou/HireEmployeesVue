<template>
  <div class="colored_status" :style="{ backgroundColor: statusColor }">
    {{ statusText }}
  </div>
</template>

<script setup>

const props = defineProps({
  // Текст статуса
  statusText: {
    type: String,
    required: true,
  },
  // Цвет статуса
  statusColor: {
    type: String,
    required: true,
  }
});

</script>

<style scoped>
.colored_status {
  border-radius: 13px;
  color: white;
  padding: 7px 16px;
  cursor: default;
  user-select: none;
  width: fit-content;
  font-size: 14px;
}
</style>