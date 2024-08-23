<template>
  <div class="manager-item">
    {{ props.managerName }}
  </div>
</template>

<script setup>
const props = defineProps({
  // Имя менеджера
  managerName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.manager-item {
  font-size: 14px;
  border: 1px solid gray;
  border-radius: 20px;
  padding: 7px 13px;
}
</style>
