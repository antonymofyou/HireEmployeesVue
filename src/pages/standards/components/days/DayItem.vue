<template>
  <div class="day">
    <div class="day__header">
      <p class="day__text">
        <span class="day__title day__highlight">
          {{ props.date }}
        </span>
      </p>
    </div>

    <div class="day__body">
      <div class="day__periods">
        <PeriodItem
          v-for="period in props.periods"
          :start="formatTime(period.periodStart)"
          :end="formatTime(period.periodEnd)"
        />

        <AddButton />
      </div>

      <div class="day__info">
        <p class="day__text">
          Длина рабочего дня: {{ props.workTime }}
        </p>
        <p
          v-if="props.report"
          class="day__text"
        >
          Текст отчёта: {{ props.report }}
        </p>
      </div>
    </div>

    <div class="day__footer">
      
    </div>
  </div>
</template>

<script setup>
/* Сущность дня сотрудника */
import { formatTime } from '../../js/utils';
import AddButton from '../AddButton.vue';

import PeriodItem from '../periods/PeriodItem.vue';

const props = defineProps({
  dayId: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  workTime: {
    type: Number,
    required: true
  },
  report: {
    type: String,
    required: true
  },
  reportId: {
    type: Number,
    required: true
  },
  isWeekend: {
    type: Boolean,
    required: true
  },
  comment: {
    type: String,
    required: true,
  },
  periods: {
    type: Array,
    required: false,
    default: () => []
  }
});

const emit = defineEmits(['editClick', 'deleteClick']);

/**
 * Обработка клика по кнопке редактирования
 */
function handleEditButtonClick() {
  emit('editClick');
}

/**
 * Обработка клика по кнопке удаления
 */
function handleDeleteButtonClick() {
  emit('deleteClick');
}
</script>

<style scoped>
.day {
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
}

.day__highlight {
  font-weight: bold;
}

.day__header {
  text-align: center;
  margin-bottom: 20px;
}

.day__title {
  font-size: 18px;
}

.day__footer {
  display: flex;
  justify-content: flex-end;
}

.day__body {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.day__periods {
  padding-bottom: 20px;
  border-bottom: 2px solid var(--cornflower-blue);
  display: flex;
  column-gap: 20px;
}

.day__text {
  margin: 0;
}

.day__text:not(:last-of-type) {
  margin-bottom: 15px;
}
</style>