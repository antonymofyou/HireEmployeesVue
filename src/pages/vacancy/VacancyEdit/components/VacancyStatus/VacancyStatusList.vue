<template>
  <div class="vacancy-edit__statuslist">
    <div>Статусы: {{ statusList.statuses.length || 'Статусы не заданы' }}</div>
    <div class="statuslist__list-box">
      <VacancyStatusItem
          v-for="status in statusList.statuses"
          :key="status.statusName"
          :status="status"
          :statusList="statusList"
          :indicators="indicators"
          :statusMod="statusMod"
          :handleModification="handleModification"
          @startUpdate="onVacancyStatusItemUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import VacancyStatusItem from './VacancyStatusItem.vue'

const props = defineProps({
  // Массив статусов
  statusList: {
    type: [Array, Object, Array],
    required: true,
  },
  // Информация об изменяемом статусе
  statusMod: {
    type: Object,
    required: true,
  },
  // Индикаторы кнопок
  indicators: {
    type: Object,
    required: true,
  },
  // Обработчик изменения статуса
  handleModification: {
    type: Function,
    required: true,
  },
});
const emit = defineEmits(['itemStartUpdate']);

/**
 * Обработчик постановки статуса на апдейт
 * @param {Object} status - Статус
 */
const onVacancyStatusItemUpdate = (status) => {
  emit('itemStartUpdate', status);
};
</script>

<style scoped>
.vacancy-edit__statuslist {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.statuslist__list-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

</style>