<template>
  <div class="days-list">
    <DayItem
      v-for="day in props.days"
      :key="day.dayId"
      :day-id="day.dayId"
      :date="day.date"
      :work-time="day.workTime"
      :report="day.report"
      :report-id="day.reportId"
      :is-weekend="Boolean(day.isWeekend)"
      :comment="day.comment"
      :periods="props.periods[day.dayId]"
      :active-period-id="props.activePeriodId"
      @period-select="handlePeriodSelectDayItem"
      @period-add="handlePeriodAddDayItem"
      @period-delete="handlePeriodDeleteDayItem"
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
    type: Object,
    required: true
  },

  // ID выбранного периода
  activePeriodId: {
    type: Number,
    required: false,
    default: null
  }
});

const emit = defineEmits(['periodSelect', 'periodAdd', 'periodDelete']);

/**
 * Обработка события выделения периода
 * @param {Object} periodEmitted - Период
 */
function handlePeriodSelectDayItem(periodEmitted) {
  emit('periodSelect', periodEmitted);
}

/**
 * Обработка события добавления периода
 */
function handlePeriodAddDayItem() {
  emit('periodAdd');
}

/**
 * Обработка события удаления периода
 * @param {Object} periodEmitted - Период
 */
function handlePeriodDeleteDayItem(periodEmitted) {
  emit('periodDelete', periodEmitted);
}
</script>

<style scoped>
.days-list {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
</style>
