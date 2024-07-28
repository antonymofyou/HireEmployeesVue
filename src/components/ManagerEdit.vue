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
  user-select: none;
  padding: 7px 13px;
  border: 1px solid gray;
  border-radius: 20px;
  display: flex;
  transition: opacity 0.3s ease, background-color 0.3s ease; /* Добавили transition для background-color */
  cursor: pointer;
  font-size: 14px;
  align-items: center;
}

.manager_item:hover{
  background-color: #d3d3d3; /* Цвет при наведении */
}
</style>
