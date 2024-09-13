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
        <TransitionGroup name="period-tr-group">
          <PeriodItem
            v-for="period in props.periods"
            :key="period.periodId"
            :period-id="period.periodId"
            :start="period.periodStart"
            :end="period.periodEnd"
            :is-active="props.activePeriodId === period.periodId"
            @select="handleSelectPeriodItem"
            @delete="handleDeletePeriodItem"
            />

          <AddButton
            key="add-button"
            @click="handleClickAddButtonPeriod"
          />
        </TransitionGroup>

      </div>

      <div class="day__info">
        <p
          v-if="props.isWeekend"
          class="day__text"
        >
          Выходной: Да
        </p>

        <p
          v-else
          class="day__text"
        >
          Длина рабочего дня: {{ props.spentTime }} минут
        </p>

        <p
          v-if="props.report"
          class="day__text"
        >
          Текст отчёта: {{ props.report }}
        </p>
        <p
          v-if="props.comment"
          class="day__text"
        >
          Комментарий: {{ props.comment }}
        </p>
      </div>
    </div>

    <div
      v-if="props.isAllowEdit"
      class="day__footer"
    >
      <ButtonIcon
        class="button-icon"
        @click="handleClickEditButton"
      >
        <template #icon>
          <EditIcon
            class="button-icon__icon"
          />
        </template>
      </ButtonIcon>

      <ButtonIcon
        class="button-icon"
        @click="handleClickDeleteButton"
      >
        <template #icon>
          <DeleteIcon
            class="button-icon__icon button-icon__icon--delete"
          />
        </template>
      </ButtonIcon>
    </div>
  </div>
</template>

<script setup>
/* @component Сущность дня сотрудника */

import ButtonIcon from '@/components/ButtonIcon.vue';

import EditIcon from '@/assets/icons/edit.svg?component';
import DeleteIcon from '@/assets/icons/delete.svg?component';

import AddButton from '../AddButton.vue';
import PeriodItem from '../periods/PeriodItem.vue';

const props = defineProps({
  dayId: {
    type: [Number, String],
    required: true
  },
  date: {
    type: String,
    required: true
  },
  spentTime: {
    type: [Number, String],
    required: true
  },
  report: {
    type: String,
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
  },
  activePeriodId: {
    type: [String, Number],
    required: false,
    default: null
  },
  // Разрешено ли редактирование дня
  isAllowEdit: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(['dayEdit', 'dayDelete', 'periodSelect', 'periodAdd', 'periodDelete']);

/**
 * Обработка клика по кнопке редактирования
 */
function handleClickEditButton() {
  emit('dayEdit', props.dayId);
}

/**
 * Обработка клика по кнопке удаления
 */
function handleClickDeleteButton() {
  emit('dayDelete', props.dayId);
}

/**
 * Обработка выделения периода
 * @param {Object} periodEmitted - Период
 */
function handleSelectPeriodItem(periodEmitted) {
  emit('periodSelect', {
    ...periodEmitted,
    dayId: props.dayId
  });
}

/**
 * Обработка добавления периода
 */
 function handleClickAddButtonPeriod() {
  emit('periodAdd', {
    dayId: props.dayId,
  });
}

/**
 * Обработка удаления периода
 * @param {Object} periodEmitted - Период
 */
function handleDeletePeriodItem(periodEmitted) {
  emit('periodDelete', {
    ...periodEmitted,
    dayId: props.dayId
  });
}
</script>

<style scoped>
.day {
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  background: #fff;
  padding: 10px 30px;
  border-radius: 10px;
}

.day__highlight {
  font-weight: bold;
}

.day__header {
  text-align: center;
  margin-bottom: 5px;
}

.day__title {
  font-size: 18px;
}

.day__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.day__body {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  padding-bottom: 10px;
}

.day__periods {
  padding-bottom: 10px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.day__text {
  margin: 0;
}

.day__text:not(:last-of-type) {
  margin-bottom: 15px;
}

/* Period transition group */
.period-tr-group-move,
.period-tr-group-enter-active,
.period-tr-group-leave-active {
  transition: all 0.5s ease
}

.period-tr-group-enter-from,
.period-tr-group-leave-to {
  opacity: 0;
  transform: scale(0) translate(0, 0);
}

.period-tr-group-leave-active {
  position: absolute;
}

/* Buttons */
.button-icon:hover {
  opacity: 0.7;
}

.button-icon:active {
  opacity: 0.3;
}

.button-icon__icon--delete {
  transform: scale(1.75);
}
</style>