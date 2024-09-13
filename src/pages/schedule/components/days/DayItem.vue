<template>
  <div class="day">
    <div class="day__header">
      <span class="day__title day__highlight">
        {{ formatDate(props.day.date) }}
      </span>
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

      <div>
        <form
          :id="currentDayFormId"
          class="edit-form"
          @submit.prevent="handleEditFormSubmit"
        >
          <div class="edit-form__block edit-form__block--horizontal edit-form__block--items-center">
            <div class="edit-form__row edit-form__row--extra-small">
              <label
                class="edit-form__label"
              >
                Выходной:
                <input
                  v-model="editDay.isWeekend"
                  :disabled="!props.isEditing"
                  type="checkbox"
                >
              </label>
            </div>

            <div class="edit-form__row edit-form__row--small">
              <label
                class="edit-form__label edit-form__label--vertical"
              >
                Длина рабочего дня:
                <InputSimple
                  v-model="editDay.spentTime"
                  :disabled="!props.isEditing || isRestDisabled"
                  class="day__input"
                  placeholder="Длина рабочего дня"
                  pattern="\d+"
                />
              </label>
            </div>
          </div>

          <div class="edit-form__block edit-form__block--horizontal">
            <div class="edit-form__row">
              <label
                class="edit-form__label edit-form__label--vertical"
              >
                Текст отчёта:
                <InputSimple
                  v-model="editDay.report"
                  :disabled="!props.isEditing || isRestDisabled"
                  :is-auto-size="true"
                  input-type="textarea"
                  size="medium"
                  class="day__input day__input--textarea"
                  placeholder="Текст отчёта"
                />
              </label>
            </div>

            <div class="edit-form__row">
              <label
                class="edit-form__label edit-form__label--vertical"
              >
                Комментарий:
                <InputSimple
                  v-model="editDay.comment"
                  :disabled="!props.isEditing || isRestDisabled"
                  :is-auto-size="true"
                  input-type="textarea"
                  size="medium"
                  class="day__input day__input--textarea"
                  placeholder="Комментарий"
                />
              </label>
            </div>
          </div>

          <span
            v-if="props.errorMessage"
            class="edit-form__error"
          >
            {{ props.errorMessage }}
          </span>
        </form>
      </div>
    </div>

    <div
      v-if="props.isAllowEdit"
      class="day__footer"
    >
      <ButtonIcon
        v-if="props.isEditing"
        :form="currentDayFormId"
        class="button-icon"
      >
        <template #icon>
          <SaveIcon
            class="button-icon__icon button-icon__icon--save"
          />
        </template>
      </ButtonIcon>

      <ButtonIcon
        v-else
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

import { computed, ref, watch } from 'vue';

import ButtonIcon from '@/components/ButtonIcon.vue';

import EditIcon from '@/assets/icons/edit.svg?component';
import DeleteIcon from '@/assets/icons/delete.svg?component';
import SaveIcon from '@/assets/icons/save.svg?component';

import AddButton from '../AddButton.vue';
import PeriodItem from '../periods/PeriodItem.vue';
import InputSimple from '@/components/InputSimple.vue';

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
  return `form-edit-day-${props.dayId}`;
});

// Фабрика для нового дня
const initNewDay = () => ({
  isWeekend: props.day.isWeekend === '1',
  spentTime: String(props.day.spentTime),
  report: props.day.report,
  comment: props.day.comment
});

// Состояние формы
const editDay = ref(null);

watch([() => props.isEditing, () => props.day], () => {
  editDay.value = initNewDay();
}, {
  immediate: true
});

// Дизейблим ли остальные поля, если выбран выходной день
const isRestDisabled = computed(() => {
  // return editDay.value.isWeekend;
  return false;
});

// Задизейблена ли кнопка отправки формы редактирования дня
const isSubmitEditButtonDisabled = computed(() => {
  let result = true;
  
  const editDayKeys = Object.keys(editDay.value).filter((key) => {
    // Если задизейблено всё, кроме выбора выходного - будем проверять только его
    if (isRestDisabled.value) return key === 'isWeekend';
    return true;
  });

  // [x] Если ничего не поменялось - дизейблим

  for (const key of editDayKeys) {
    const currentValue = editDay.value[key];
    const oldValue = props[key];

    if (currentValue !== oldValue) {
      result = false;
    }
  }

  // [x] Если хоть что-то пустое - дизейблим

  for (const key of editDayKeys) {
    const value = editDay.value[key];

    if (typeof value !== 'boolean' && value.length === 0) {
      result = true;
      break;
    }
  }

  return result;
});

/**
 * Обработка отправки формы редактирования дня
 */
function handleEditFormSubmit() {
  emit('dayEditSubmit', editDay.value);
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
    weekday: 'long'
  });
  return formatter.format(new Date(date));
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
  margin-bottom: 7px;
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

.day__info {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
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
  height: 100px;
}

/* Edit form */
.edit-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.edit-form__block {
  width: 100%;
  flex-wrap: wrap;
}

.edit-form__block--horizontal {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.edit-form__block--items-center {
  align-items: center;
}

.edit-form__error {
  color: var(--cinnabar);
  font-size: 14px;
}

.edit-form__row {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.edit-form__row--extra-small {
  max-width: 110px;
}

.edit-form__row--small {
  max-width: 160px;
}

.edit-form__label--vertical {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  width: 100%;
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
.button-icon:disabled {
  pointer-events: none;
}

.button-icon:not(:disabled) {
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
  
  &:active {
    opacity: 0.3;
  }
}

.button-icon__icon--save {
  transform: scale(1.75);
}

.button-icon__icon--delete {
  transform: scale(1.75);
}
</style>