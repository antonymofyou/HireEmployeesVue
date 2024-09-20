<template>
  <div class="day">
    <div class="day__header">
      <div class="day__general">
        <div class="day__date">
          {{ formatDate(props.day.date) }}
        </div>
  
        <div class="day__weekend-status">
          <label class="day__weekend-status-label">
            Вых.
            <input
              v-model="editDay.isWeekend"
              v-show="props.isEditing"
              :disabled="!props.isEditing"
              :form="currentDayFormId"
              checked
              type="checkbox"
            />
              
            <span
              v-show="!props.isEditing"
              class="day__weekend-status-info"
            >
              {{ editDay.isWeekend ? 'Да' : 'Нет' }}
            </span>
          </label>
        </div>
      </div>

      <div class="day__header-end">
        <div class="day__spent-time-block">
          <label class="day__spent-time-label">
            Отработано:
            <InputSimple
              v-model="editDay.spentTime"
              :placeholder="convertMinsToHrsMins(props.day.spentTime)"
              :disabled="!props.isEditing"
              :form="currentDayFormId"
              pattern="\d\d:\d\d"
              class="day__time-input"
              type="text"
              @input="handleInputSpentTime"
              @keydown="handleSpentTimeKeyDown"
            />
          </label>
        </div>

        <DayActions
          :form-id="currentDayFormId"
          :is-editing="props.isEditing"
          @edit-click="handleClickEditButton"
          @delete-click="handleClickDeleteButton"
        />
      </div>     
    </div>

    <div class="day__body">
      <div class="day-periods">
        <span class="day-periods__title">
          Планируемое время:
        </span>

        <div
          :class="{
            'day-periods__list': true,
            'day-periods__list--disabled': !props.isEditing
          }"
        >
          <TransitionGroup name="period-tr-group">
            <PeriodItem
              v-for="period in props.periods"
              :key="period.periodId"
              :period-id="period.periodId"
              :start="period.periodStart"
              :end="period.periodEnd"
              :is-active="props.activePeriodId === period.periodId"
              :is-allow-select="props.isEditing"
              @select="handleSelectPeriodItem"
              @delete="handleDeletePeriodItem"
            />
  
            <AddButton
              :class="{
                'add-button': true,
                'add-button--invisible': !props.isEditing
              }"
              key="add-button"
              @click="handleClickAddButtonPeriod"
            />
          </TransitionGroup>
        </div>
      </div>

      <div class="day-info">
        <span class="day-info__title">
          Отчёт:
        </span>

        <form
          :id="currentDayFormId"
          class="day-info__form"
          @submit.prevent="handleEditFormSubmit"
        >
          <AutoSizeTextarea
            v-model="editDay.report"
            :disabled="!props.isEditing"
            class="day-info__report-input"
          />
        </form>

        <span
          v-if="props.errorMessage"
          class="day-info__error"
        >
          {{ props.errorMessage }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
/* @component Сущность дня сотрудника */

import { computed, nextTick, ref, watch } from 'vue';

import InputSimple from '@/components/InputSimple.vue';

import AddButton from '../AddButton.vue';
import PeriodItem from '../periods/PeriodItem.vue';
import AutoSizeTextarea from '../AutoSizeTextarea.vue';

import DayActions from './DayActions.vue';

import { convertHrsMinsToMins, convertMinsToHrsMins, maskifyValueToTime } from '../../js/utils';

const props = defineProps({
  // Объект дня
  day: {
    type: Object,
    required: true
  },

  // Массив периодов
  periods: {
    type: Array,
    required: false,
    default: () => []
  },

  // ID периода, над которым проводятся манипуляции
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
  },

  // Редактируем ли мы этот день сейчас
  isEditing: {
    type: Boolean,
    required: false,
    default: false
  },

  // Статус - идёт ли запрос за обновлением дня
  isEditingLoadNow: {
    type: Boolean,
    required: false,
    default: false
  },

  // Сообщение об ошибке
  errorMessage: {
    type: String,
    required: false,
    default: ''
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

// ID для формы и для кнопки отправки
const currentDayFormId = computed(() => {
  return `form-edit-day-${props.day.dayId}`;
});

// Фабрика для нового дня
const initNewDay = () => ({
  isWeekend: props.day.isWeekend === '1',
  spentTime: props.day.spentTime > 0 ? convertMinsToHrsMins(props.day.spentTime) : '',
  report: props.day.report,
});

// Состояние формы
const editDay = ref(null);

// При изменении дня, статуса редиктирования - инитаем новый день заново
watch([() => props.isEditing, () => props.day], () => {
  editDay.value = initNewDay();
}, {
  immediate: true
});

// Для масок на инпуты
watch(() => editDay.value.spentTime, async (newVal, prevVal) => {
  // Дожидаемся ререндера, и потом - меняем обратно
  await nextTick();
  editDay.value.spentTime = maskifyValueToTime(String(newVal), String(prevVal));
});

/**
 * Обработка ввода в инпут для отработанного времени
 * @param {Event} e - Объект события
 */
 function handleInputSpentTime(e) {
  const input = e.target;

  // Есть ошибка в паттерне - ставим свой текст в тултип ошибки
  if (input.validity.patternMismatch)
    input.setCustomValidity('Введите время в формате часы:минуты');
  else input.setCustomValidity('');
}

/**
 * Обработка подтверждения изменения дня
 */
function handleEditFormSubmit() {
  // Убираем иные значения (наприм: null)
  const correctSpentTime = String(editDay.value.spentTime);

  emit('dayEditSubmit', {
    ...editDay.value,
    spentTime: convertHrsMinsToMins(correctSpentTime)
  });
}

/**
 * Обработка клика по кнопке редактирования
 */
function handleClickEditButton() {
  emit('dayEdit', props.day.dayId);
}

/**
 * Обработка клика по кнопке удаления
 */
function handleClickDeleteButton() {
  emit('dayDelete', props.day.dayId);
}

/**
 * Обработка выделения периода
 * @param {Object} periodEmitted - Период
 */
function handleSelectPeriodItem(periodEmitted) {
  emit('periodSelect', {
    ...periodEmitted,
    dayId: props.day.dayId
  });
}

/**
 * Обработчик нажатий клавиш внутри инпута рабочего времени
 * @param {KeyboardEvent} e - Событие
 */
function handleSpentTimeKeyDown(e) {
  const char = e.key;

  const isInCombination = e.ctrlKey;
  const isCharLetter = char.length === 1 && /\w/.test(char) && !/\d/.test(char);
  
  // Если вводимое значение не число - то не даём ввести его (разрешаем комбинации ctrl + a и т.д.)
  if (!isInCombination && isCharLetter) {
    e.preventDefault();
    return;
  }
}

/**
 * Обработка добавления периода
 */
 function handleClickAddButtonPeriod() {
  emit('periodAdd', {
    dayId: props.day.dayId,
  });
}

/**
 * Обработка удаления периода
 * @param {Object} periodEmitted - Период
 */
function handleDeletePeriodItem(periodEmitted) {
  emit('periodDelete', {
    ...periodEmitted,
    dayId: props.day.dayId
  });
}

/**
 * Форматирование даты
 * @param {String} date - Дата для форматирования
 * @returns {String} - Отформатированная дата
 */
function formatDate(date) {
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const currentDate = new Date(date);

  let result = formatter.format(currentDate);

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const currentWeekday = weekDays[currentDate.getDay()];

  result += ` (${currentWeekday})`;

  return result;
}
</script>

<style scoped>
.day {
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  background: #fff;
  padding: 10px 30px;
  border-radius: 10px;
}

@media (max-width: 330px) {
  .day {
    padding: 10px;
  }
}

/* Header */
.day__header {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 15px;
  justify-content: space-between;
  margin-bottom: 5px;
}

.day__weekend-status-label {
  font-size: 14px;
}

.day__weekend-status-info {
  font-size: 12px;
  color: #777777;
}

.day__header-end {
  display: flex;
  gap: 10px;
}

.day__spent-time-block {
  padding-right: 10px;
  border-right: 1px solid var(--cornflower-blue);
}

.day__spent-time-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

@media (max-width: 350px) {
  .day__spent-time-block {
    padding: 0;
    border: none
  }

  .day__header-end {
    flex-direction: column;
  }

  .day-actions {
    justify-content: center;
  }
}

.day__date {
  padding-right: 10px;
  font-weight: 600;
  font-size: 14px;
  border-right: 1px solid var(--cornflower-blue);
  height: 100%;
  display: flex;
  align-items: center;
}

.day__general {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 10px;
  border-right: 1px solid var(--cornflower-blue);
}

@media (max-width: 710px) {
  .day__header {
    justify-content: center;
  }

  .day__general {
    padding: 0;
    border: none;
  }
}

:deep(.day__time-input input) {
  width: 60px;
  text-align: center;
  font-size: 14px;
  padding: 0;
}

.day__body {
  display: grid;
  grid-template-columns: 1.3fr 2fr;
  gap: 20px;
}

@media (max-width: 650px) {
  .day__body {
    grid-template-columns: 1fr;
  }
}

/* Day periods */
.day-periods {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.day-periods__title,
.day-info__title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
}

.day-info__error {
  font-size: 15px;
  color: var(--cinnabar);
}

.day-periods__list {
  padding: 5px;
  border: 2px solid var(--cornflower-blue);
  border-radius: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 40px;
}

.day-periods__list--disabled {
  background: rgb(243, 243, 243);
}

/* Add button */
.add-button {
  opacity: 1;
  transition: opacity ease 0.2s;
}

.add-button--invisible {
  opacity: 0;
}

/* Day info */
.day-info {
  display: flex;
  flex-direction: column;
}

:deep(.day-info__report-input textarea) {
  outline: 2px solid var(--cornflower-blue);
  min-height: 40px;
}

:deep(.day-info__report-input textarea:focus) {
  outline: 3px solid var(--cornflower-blue);
}

.day__text {
  margin: 0;
}

:deep(.day__input) input {
  font-size: 14px;
  padding: 5px;
}

:deep(.day__input--textarea) textarea {
  font-size: 14px;
  padding: 5px;
  overflow: hidden;
}

.day-info__form {
  display: flex;
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
</style>