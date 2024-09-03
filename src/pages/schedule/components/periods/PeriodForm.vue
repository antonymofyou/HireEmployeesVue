<template>
  <form
    :style="{
      maxWidth: props.maxWidth
    }"
    class="period-form"
    @submit.prevent="handleSubmit"
  >
    <label class="form-label">
      <span class="form-label__title">Дата:</span>

      <InputSimple
        v-model.trim="mainDateModel"
        :disabled="isFieldDisabled('date')"
        placeholder="Дата (yyyy-mm-dd)"
        pattern="\d{4}-\d{2}-\d{2}"
      />
    </label>

    <label class="form-label">
      <span class="form-label__title">Начало периода:</span>

      <InputSimple
        v-model.trim="periodStartTimeModel"
        placeholder="Начало (часы:минуты)"
        pattern="\d{2}:\d{2}"
        @input="clearCustomErrors"
        @invalid="showReadableMessage"
      />
    </label>

    <label class="form-label">
      <span class="form-label__title">Конец периода:</span>

      <InputSimple
        v-model.trim="periodEndTimeModel"
        placeholder="Конец (часы:минуты)"
        pattern="\d{2}:\d{2}"
        @input="clearCustomErrors"
        @invalid="showReadableMessage"
      />
    </label>

    <ButtonMain
      :is-active="props.isLoading"
      :is-disabled="props.isSubmitDisabled"
      :message="props.error"
      align="center"
      form="add-period-form"
    >
      <template #text>Создать</template>
    </ButtonMain>
  </form>
</template>

<script setup>
import { watch } from 'vue';

import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';

const props = defineProps({
  // Не активные поля
  disabledFields: {
    type: Array,
    required: false,
    default: () => []
  },
  // Ошибка для формы
  error: {
    type: String,
    required: false,
    default: ''
  },
  // Запрещено ли отправлять форму
  isSubmitDisabled: {
    type: Boolean,
    required: false,
    default: false
  },
  // Идёт ли загрузка
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  // Максимальная ширина формы (например: 300px)
  maxWidth: {
    type: String,
    required: false,
    default: 'initial'
  }
});

// Модели для сущностей периода для двусторонней связки
const mainDateModel = defineModel('date');
const periodStartTimeModel = defineModel('periodStart');
const periodEndTimeModel = defineModel('periodEnd');

// Для масок на инпуты
watch(periodStartTimeModel, (newVal, prevVal) => {
  periodStartTimeModel.value = maskifyInputValueString(newVal, prevVal);
});

watch(periodEndTimeModel, (newVal, prevVal) => {
  periodEndTimeModel.value = maskifyInputValueString(newVal, prevVal);
});

const emit = defineEmits(['submit']);

// Уведомления по определённым ошибкам
const validityNotifiers = {
  pattern: 'Введите время в формате часы:минуты'
};

/**
 * Вывод читабельной ошибки при ошибке по паттерну
 * @param {Event} event - Объект события
 */
function showReadableMessage(event) {
  event.target.setCustomValidity(validityNotifiers.pattern);
}

/**
 * Сброс кастомных ошибок при пользовательском вводе
 * @param {InputEvent} event - Объект события
 */
function clearCustomErrors(event) {
  if (event.target.validity.patternMismatch) {
    event.target.setCustomValidity(validityNotifiers.pattern);
  } else {
    event.target.setCustomValidity('');
  }
}

/**
 * Обработка отправки формы
 */
function handleSubmit() {
  emit('submit');
}

/**
 * Проверка блокировки поля
 * @param {String} fieldName - Имя поля
 */
function isFieldDisabled(fieldName) {
  return props.disabledFields.includes(fieldName);
}

/**
 * Маска для инпутов времени
 * @param {String} newVal - Новое значение
 * @param {String} prevVal - Предыдущее значение
 * @returns {String}
 */
function maskifyInputValueString(newVal, prevVal) {
  if (newVal.length === 2 && prevVal.length < newVal.length) {
    return newVal += ":";
  }

  if (newVal.length > 5) {
    return prevVal;
  }

  return newVal;
}
</script>

<style scoped>
.period-form {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

/* Form label */
.form-label {
  display: flex;
  flex-direction: column;
  row-gap: 2px;
}

.form-label__title {
  font-size: 14px;
  margin-bottom: 5px;
}

.form-label__row {
  display: flex;
  column-gap: 5px;
  justify-content: center;
  align-items: center;
}
</style>