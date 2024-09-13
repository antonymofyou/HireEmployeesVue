<template>
  <div class="day">
    <div class="day__header">
      <span class="day__title day__highlight">
        {{ props.date }}
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

      <div
        v-if="!props.isEditing"
        class="day__info"
      >
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
          class="day__text"
        >
          Текст отчёта: {{ props.report || 'отсутствует' }}
        </p>
        <p
          class="day__text"
        >
          Комментарий: {{ props.comment || 'отсутствует' }}
        </p>
      </div>

      <div v-else>
        <form
          class="edit-form"
          @submit.prevent="handleEditFormSubmit"
        >
          <div class="edit-form__row">
            <label
              class="edit-form__label"
            >
              Выходной:
              <input
                v-model="editDay.isWeekend"
                type="checkbox"
              >
            </label>
          </div>

          <div class="edit-form__row">
            <label
              class="edit-form__label--vertical"
            >
              Длина рабочего дня:
              <InputSimple
                v-model="editDay.spentTime"
                class="day__input"
                placeholder="Длина рабочего дня"
                pattern="\d+"
              />
            </label>
          </div>

          <div class="edit-form__row">
            <label
              class="edit-form__label--vertical"
            >
              Текст отчёта:
              <InputSimple
                v-model="editDay.report"
                input-type="textarea"
                size="medium"
                class="day__input"
                placeholder="Текст отчёта"
              />
            </label>
          </div>

          <div class="edit-form__row">
            <label
              class="edit-form__label--vertical"
            >
              Комментарий:
              <InputSimple
                v-model="editDay.comment"
                input-type="textarea"
                size="medium"
                class="day__input"
                placeholder="Комментарий"
              />
            </label>
          </div>

          <ButtonMain
            :is-active="props.isEditingLoadNow"
            :is-disabled="isSubmitEditButtonDisabled"
            :message="props.errorMessage"
          >
            <template #text>
              Изменить
            </template>
          </ButtonMain>
        </form>
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

import { computed, ref } from 'vue';

import ButtonIcon from '@/components/ButtonIcon.vue';

import EditIcon from '@/assets/icons/edit.svg?component';
import DeleteIcon from '@/assets/icons/delete.svg?component';

import AddButton from '../AddButton.vue';
import PeriodItem from '../periods/PeriodItem.vue';
import { watch } from 'vue';
import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';

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

watch(() => props.isEditing, (newVal) => {
  console.log(newVal)
})

const emit = defineEmits([
  'dayEdit',
  'dayEditSubmit',
  'dayDelete',
  'periodSelect',
  'periodAdd',
  'periodDelete'
]);

// Фабрика для нового дня
const initNewDay = () => ({
  isWeekend: props.isWeekend,
  spentTime: String(props.spentTime),
  report: props.report,
  comment: props.comment
});

// Состояние формы
const editDay = ref(initNewDay());

// Задизейблена ли кнопка отправки формы редактирования дня
const isSubmitEditButtonDisabled = computed(() => {
  let result = false;
  
  // [x] Если хоть что-то пустое - дизейблим

  for (const key of Object.keys(editDay.value)) {
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

.day__info {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.day__text {
  margin: 0;
}

/* Edit form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
}

.edit-form__row {
  display: flex;
}

.edit-form__label--vertical {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  max-width: 300px;
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