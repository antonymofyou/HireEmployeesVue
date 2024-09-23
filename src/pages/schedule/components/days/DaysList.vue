<template>
  <div class="days-list">
    <DayItem
      v-for="day in props.days"
      :key="day.dayId"
      :day="day"
      :comment="day.comment"
      :periods="props.periods[day.dayId]"
      :active-period-id="props.activePeriodId"
      :is-allow-edit="props.isAllowEdit"
      :is-editing="day.dayId === props.editingDayId"
      :is-editing-request-now="props.isEditingDayNow && props.requestsEditDaysNow.includes(day.dayId)"
      :error-message="day.dayId === props.editingDayId ? props.editErrorMessage : ''"
      @day-edit="handleDayEditDayItem"
      @day-edit-submit="handleDayEditSubmitDayItem"
      @day-delete="handleDayDeleteDayItem"
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
    type: [String, Number],
    required: false,
    default: null
  },

  // Разрешено ли редактирование списка
  isAllowEdit: {
    type: Boolean,
    required: false,
    default: false
  },

  // Текущий редактируемый день
  editingDayId: {
    type: [String, Number, null],
    required: false,
    default: null
  },

  // Статус - идёт ли запрос за обновлением дня
  isEditingDayNow: {
    type: Boolean,
    required: false,
    default: false
  },

  // Сообщение об ошибке 
  editErrorMessage: {
    type: String,
    required: false,
    default: '',
  },

  // Дни, за которыми идут запросы за изменением
  requestsEditDaysNow: {
    type: Array,
    required: false,
    default: () => []
  }
});

const emit = defineEmits([
  'dayEdit',
  'dayEditSubmit',
  'dayDelete',
  'periodSelect',
  'periodAdd',
  'periodDelete'
]);

/**
 * Обработка события редактирования дня
 * @param {Number} dayId - ID дня
 */
function handleDayEditDayItem(dayId) {
  emit('dayEdit', dayId);
}

/**
 * Обработка события отправки формы на редактирование дня
 * @param {Number} editedDay - Отредактированный день
 */
function handleDayEditSubmitDayItem(editedDay) {
  emit('dayEditSubmit', editedDay);
}

/**
 * Обработка события удаления дня
 * @param {Number} dayId - ID дня
 */
function handleDayDeleteDayItem(dayId) {
  emit('dayDelete', dayId);
}

/**
 * Обработка события выделения периода
 * @param {Object} periodEmitted - Период
 */
function handlePeriodSelectDayItem(periodEmitted) {
  emit('periodSelect', periodEmitted);
}

/**
 * Обработка события добавления периода
 * @param {Object} periodEmitted - Период
 */
function handlePeriodAddDayItem(periodEmitted) {
  emit('periodAdd', periodEmitted);
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
