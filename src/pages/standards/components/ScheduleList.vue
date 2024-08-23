<template>
  <div class="schedule-list">
    <PeriodItem
      v-for="period in props.jobPeriods"
      :key="period.forDate"
      :date="period.forDate"
      :start-time="formatTime(period.periodStart)"
      :end-time="formatTime(period.periodEnd)"
      :is-report-exist="isExistReportForPeriod(period)"
      :report-text="getReportText(period)"
      @edit-click="handleEditClickPeriodItem(period)"
      @delete-click="handleDeleteClickPeriodItem(period)"
    />
  </div>
</template>

<script setup>
import PeriodItem from './PeriodItem.vue';
import { formatTime } from '../js/date-utils';

const props = defineProps({
  // Расписание сотрудника. Содержит начало и конец рабочего периода для каждой даты
  jobPeriods: {
    type: Array,
    required: true
  },

  // Данные для графика. Содержит общее время работы, наличие отчёта, текст отчёта
  dataByDate: {
    type: Array,
    required: true
  }
});

const emit = defineEmits({
  startEdit: (payload) => typeof payload === 'object' && payload !== null,
  startDelete: (payload) => typeof payload === 'object' && payload !== null
});

/**
 * Существует ли отчёт для заданной даты
 * @param {Object} period - Объект периода
 * @returns {Boolean} - Статус наличия отчёта
 */
function isExistReportForPeriod(period) {
  return Boolean(props.dataByDate.find((d) => d.forDate === period.forDate)?.haveReport);
}

/**
 * Получить текст репорта к определённому периоду
 * @param {Object} period - Объект периода
 * @returns {String} - Текст отчёта по периоду
 */
function getReportText(period) {
  return props.dataByDate.find((d) => d.forDate === period.forDate).report ?? '';
}

/**
 * Обработка клика по редактированию периода
 * @param {Object} period - Объект периода
 */
function handleEditClickPeriodItem(period) {
  emit('startEdit', period);
}

/**
 * Обработка клика по удалению периода
 * @param {Object} period - Объект периода
 */
function handleDeleteClickPeriodItem(period) {
  emit('startDelete', period);
}
</script>

<style scoped>
.schedule-list {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
</style>
