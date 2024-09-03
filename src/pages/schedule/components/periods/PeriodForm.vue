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

      <!-- <InputSimple
        v-model.trim="periodStartTimeModel"
        placeholder="Начало (часы:минуты)"
        pattern="\d{2}:\d{2}"
        @input="clearCustomErrors"
        @invalid="showReadableMessage"
      /> -->

      <div class="form-label__row">
        <NumberStepper
          :value="times.start.hours"
          :min="1"
          :max="24"
          @input="(val) => times.start.hours = val"
          placeholder="Часы"
        />
        :
        <NumberStepper
          :value="times.start.minutes"
          :min="1"
          :max="60"
          @input="(val) => times.start.minutes = val"
          placeholder="Минуты"
        />
      </div>
    </label>

    <label class="form-label">
      <span class="form-label__title">Конец периода:</span>

      <!-- <InputSimple
        v-model.trim="periodEndTimeModel"
        placeholder="Конец (часы:минуты)"
        pattern="\d{2}:\d{2}"
        @input="clearCustomErrors"
        @invalid="showReadableMessage"
      /> -->

      <div class="form-label__row">
        <NumberStepper
          :value="times.end.hours"
          :min="Number(times.start.hours)"
          :max="24"
          @input="(val) => times.end.hours = val"
          placeholder="Часы"
        />
        :
        <NumberStepper
          :value="times.end.minutes"
          :min="1"
          :max="60"
          @input="(val) => times.end.minutes = val"
          placeholder="Минуты"
        />
      </div>
    </label>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputSimple from '@/components/InputSimple.vue';
import NumberStepper from '../NumberStepper.vue';

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

// Текущее время (отдаём как модель в инпут)
const times = ref({
  start: {
    hours: '',
    minutes: ''
  },
  end: {
    hours: '',
    minutes: ''
  }
});

watch(times, () => {
  periodStartTimeModel.value = `${times.value.start.hours}:${times.value.start.minutes}`;
  periodEndTimeModel.value = `${times.value.end.hours}:${times.value.end.minutes}`;
}, {
  deep: true
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