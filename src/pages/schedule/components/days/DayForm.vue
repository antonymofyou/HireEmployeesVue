<template>
  <form
    :style="{
      maxWidth: props.maxWidth
    }"
    class="day-form"
    @submit.prevent="handleSubmitForm"
  >
    <label class="form-label">
      <span class="form-label__title">Дата:</span>

      <InputSimple
        v-model.trim="dateModel"
        :min="new Date().toLocaleDateString('en-CA')"
        :disabled="isFieldDisabled('date')"
        placeholder="Дата"
        pattern="\d{4}-\d{2}-\d{2}"
        type="date"
      />
    </label>
    <div
      :class="{
        'day-form__checkbox': true,
        'day-form__separator': !isFieldLast('isWeekend')
      }"
    >
      <label>
        Выходной?
        <input
          v-model="isWeekendModel"
          type="checkbox"
        >
      </label>
    </div>
    <label v-if="!isFieldRemoved('spentTime')" class="form-label">
      <span class="form-label__title">Рабочий день (в минутах):</span>

      <InputSimple
        v-model.trim="spentTimeModel"
        :disabled="isRestDisabled"
        placeholder="Рабочий день (в минутах)"
        pattern="\d+"
      />
    </label>
    <label v-if="!isFieldRemoved('spentTime')" class="form-label">
      <span class="form-label__title">Отчёт:</span>

      <InputSimple
        v-model.trim="reportModel"
        :disabled="isRestDisabled"
        placeholder="Текст отчёта"
        input-type="textarea"
      />
    </label>
    <label v-if="!isFieldRemoved('spentTime')" class="form-label">
      <span class="form-label__title">Комментарий:</span>

      <InputSimple
        v-model.trim="commentModel"
        :disabled="isRestDisabled"
        placeholder="Текст комментария"
        input-type="textarea"
      />
    </label>

    <ButtonMain
      :is-active="props.isLoading"
      :is-disabled="props.isSubmitDisabled"
      :message="props.error"
      align="center"
    >
      <template #text>{{ props.buttonText }}</template>
    </ButtonMain>
  </form>
</template>

<script setup>
import { computed } from 'vue';

import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';

const props = defineProps({
  // Не отображаемые поля
  removedFields: {
    type: Array,
    required: false,
    default: () => []
  },
  // Не активные поля
  disabledFields: {
    type: Array,
    required: false,
    default: () => []
  },
  // Статус загрузки
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  buttonText: {
    type: String,
    required: false,
    default: 'Подтвердить'
  },
  error: {
    type: String,
    required: false,
    default: ''
  },
  isSubmitDisabled: {
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

const emit = defineEmits(['submit']);

// Все поля формы. Т.к. defineModel является макросом, мы не можем использовать их внутри него
const fieldsNames = ['date', 'isWeekend', 'spentTime', 'report', 'comment'];

// Модели для сущностей дня для двусторонней связки
const dateModel = defineModel('date', { default: '' });
const isWeekendModel = defineModel('isWeekend', { default: '' });
const spentTimeModel = defineModel('spentTime', { default: null });
const reportModel = defineModel('report', { default: null });
const commentModel = defineModel('comment', { default: null });

// Будем дизейблить всё, кроме date, если isWeekend === true
const isRestDisabled = computed(() => {
  return isWeekendModel.value;
});

/**
 * Обработка отправки формы
 */
function handleSubmitForm() {
  emit('submit', {
    date: dateModel.value,
    isWeekend: isWeekendModel.value,
    spentTime: spentTimeModel.value,
    report: reportModel.value,
    comment: commentModel.value
  });
}

/**
 * Проверка отсутствия поля
 * @param {String} fieldName - Имя поля
 */
 function isFieldRemoved(fieldName) {
  return props.removedFields.includes(fieldName);
}

/**
 * Проверка поля на неактивность
 * @param {String} fieldName - Имя поля
 */
function isFieldDisabled(fieldName) {
  return props.disabledFields.includes(fieldName);
}

/**
 * Является ли поле последним при отображении
 * @param {String} fieldName - Имя поля
 */
function isFieldLast(fieldName) {
  const restFields = fieldsNames.filter((key) => !props.removedFields.includes(key));
  return restFields.at(-1) === fieldName;
}
</script>

<style scoped>
/* Day form */
.day-form {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  max-width: 300px;
}

.day-form__checkbox {
  display: flex;
  justify-content: center;
}

.day-form__separator {
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--cornflower-blue);
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
</style>