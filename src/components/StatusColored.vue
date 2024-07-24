<template>
  <div class="colored_status" :style="{ backgroundColor: statusColor }">
    {{ statusText }}
    <span v-if="statusCount">({{ statusCount }})</span>
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
  },
  statusCount: {
    type: Number,
    required: false
  }
});

</script>

<style scoped>
.colored_status {
  border-radius: 10px;
  color: white;
  padding: 7px 14px;
  cursor: default;
  user-select: none;
  width: fit-content;
}
</style>