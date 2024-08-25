<template>
  <form
    id="edit-period-form"
    class="modal-edit-period__form"
    @submit.prevent="handleSubmit"
  >
    <InputSimple
      v-model="mainDateModel"
      :disabled="isFieldDisabled('date')"
      placeholder="Дата (yyyy-mm-dd)"
      pattern="\d{4}-\d{2}-\d{2}"
    />
    <InputSimple
      v-model="periodStartTimeModel"
      placeholder="Начало (II:ss)"
      pattern="\d{2}:\d{2}"
    />
    <InputSimple
      v-model="periodEndTimeModel"
      placeholder="Конец (II:ss)"
      pattern="\d{2}:\d{2}"
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