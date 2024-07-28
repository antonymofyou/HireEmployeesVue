<template>
  <div>
    <div @click="handleManagerClick(manager)">
      <ManagerEdit :ManagerText="manager.name" />
    </div>
  </div>
</template>

<script setup>
import ManagerEdit from "@/components/ManagerEdit.vue";

const props = defineProps({
  // менеджер
  manager: {
    type: Object,
    required: true,
  },
  // Индикаторы кнопок
  indicators: {
    type: Object,
    required: true,
  },
  managerMod: {
    type: Object,
    required: true,
  },
});
// Функция для обработки клика трансфера
const handleManagerClick = (manager) => {
  props.indicators.isDelete = true;
  props.managerMod.managerId = manager.id;
};
</script>

<style scoped></style>
