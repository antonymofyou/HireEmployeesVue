<template>
  <form
    class="period-form"
    @submit.prevent="handleSubmit"
  >
    <InputSimple
      v-model.trim="mainDateModel"
      :disabled="isFieldDisabled('date')"
      placeholder="Дата (yyyy-mm-dd)"
      pattern="\d{4}-\d{2}-\d{2}"
    />
    <InputSimple
      v-model.trim="periodStartTimeModel"
      placeholder="Начало (часы:секунды)"
      pattern="\d{2}:\d{2}"
      @input="clearCustomErrors"
      @invalid="showReadableMessage"
    />
    <InputSimple
      v-model.trim="periodEndTimeModel"
      placeholder="Конец (часы:секунды)"
      pattern="\d{2}:\d{2}"
      @input="clearCustomErrors"
      @invalid="showReadableMessage"
    />
  </form>
</template>

<script setup>
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
</style>