<template>
  <form
    @submit.prevent="handleSubmitForm"
    id="add-day-form"
    class="day-form"
  >
    <label class="form-label">
      <span class="form-label__title">Дата:</span>

      <InputSimple
        v-model.trim="dateModel"
        :min="new Date().toLocaleDateString('en-CA')"
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
    <label v-if="!isFieldRemoved('workTime')" class="form-label">
      <span class="form-label__title">Рабочий день (в минутах):</span>

      <InputSimple
        v-model.trim="workTimeModel"
        :disabled="isRestDisabled"
        placeholder="Рабочий день (в минутах)"
        pattern="\d+"
      />
    </label>
    <label v-if="!isFieldRemoved('workTime')" class="form-label">
      <span class="form-label__title">Отчёт:</span>

      <InputSimple
        v-model.trim="reportModel"
        :disabled="isRestDisabled"
        placeholder="Отчёт"
        input-type="textarea"
      />
    </label>
    <label v-if="!isFieldRemoved('workTime')" class="form-label">
      <span class="form-label__title">Комментарий:</span>

      <InputSimple
        v-model.trim="commentModel"
        :disabled="isRestDisabled"
        placeholder="Комментарий"
        input-type="textarea"
      />
    </label>
  </form>
</template>

<script setup>
import { computed } from 'vue';
import InputSimple from '@/components/InputSimple.vue';
import { formatTime } from '../../js/utils';

const props = defineProps({
  // Не отображаемые поля
  removedFields: {
    type: Array,
    required: false,
    default: () => []
  }
});

const emit = defineEmits(['submit']);

// Все поля формы. Т.к. defineModel является макросом, мы не можем использовать их внутри него
const fieldsNames = ['date', 'isWeekend', 'workTime', 'report', 'comment'];

// Модели для сущностей дня для двусторонней связки
const dateModel = defineModel('date', { default: '' });
const isWeekendModel = defineModel('isWeekend', { default: '' });
const workTimeModel = defineModel('workTime', { default: null });
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
    workTime: workTimeModel.value,
    report: reportModel.value,
    comment: commentModel.value
  })
}

/**
 * Проверка отсутствия поля
 * @param {String} fieldName - Имя поля
 */
 function isFieldRemoved(fieldName) {
  return props.removedFields.includes(fieldName);
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