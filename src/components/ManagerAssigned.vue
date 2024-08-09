<template>
  <div class="manager_item">
    {{ ManagerText }}
  </div>
</template>

<script setup>
const props = defineProps({
  // Имя менеджера
  ManagerText: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.manager_item {
  font-size: 14px;
  border: 1px solid gray;
  border-radius: 20px;
  padding: 7px 13px;
}
</style>
