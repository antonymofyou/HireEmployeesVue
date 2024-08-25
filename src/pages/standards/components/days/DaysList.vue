<template>
  <div class="days-list">
    <DayItem
      v-for="day in props.days"
      :key="day.dayId"
      :date="day.date"
      :work-time="day.workTime"
      :report="day.report"
      :report-id="day.reportId"
      :is-weekend="day.isWeekend"
      :comment="day.comment"
      :periods="props.periods[day.dayId]"
      @edit-click="handleEditClickPeriodItem(period)"
      @delete-click="handleDeleteClickPeriodItem(period)"
    />
  </div>
</template>

<script setup>
import DayItem from './DayItem.vue';

const props = defineProps({
  // Дни сотрудника
  days: {
    type: Array,
    required: true
  },

  // Периоды сотрудника
  periods: {
    type: Array,
    required: true
  }
});

const emit = defineEmits({
  startEdit: (payload) => typeof payload === 'object' && payload !== null,
  startDelete: (payload) => typeof payload === 'object' && payload !== null
});

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
.days-list {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
</style>
