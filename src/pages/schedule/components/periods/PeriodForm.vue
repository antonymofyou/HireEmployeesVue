<template>
  <form
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
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputSimple from '@/components/InputSimple.vue';

const props = defineProps({
  disabledFields: {
    type: Array,
    required: false,
    default: () => []
  }
});

// Модели для сущностей периода для двусторонней связки
const mainDateModel = defineModel('date');
const periodStartTimeModel = defineModel('periodStart');
const periodEndTimeModel = defineModel('periodEnd');

watch(periodStartTimeModel, (newVal, prevVal) => {
  if (newVal.length === 2 && prevVal.length < newVal.length) {
    periodStartTimeModel.value += ":";
  }

  if (newVal.length > 5) {
    periodStartTimeModel.value = prevVal;
  }

  console.log('After: ', periodStartTimeModel.value);
});

watch(periodEndTimeModel, (newVal, prevVal) => {
  if (newVal.length === 2 && prevVal.length < newVal.length) {
    periodEndTimeModel.value += ":";
  }

  if (newVal.length > 5) {
    periodEndTimeModel.value = prevVal;
  }

  console.log('After: ', periodStartTimeModel.value);
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