<template>
  <form
    id="edit-period-form"
    class="modal-edit-period__form"
    @submit.prevent="handleSubmit"
  >
    <InputSimple
      v-model="mainDateModel"
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
    <InputSimple
      v-model="periodReportModel"
      placeholder="Текст отчёта"
      input-type="textarea"
    />
  </form>
</template>

<script setup>
import InputSimple from '@/components/InputSimple.vue';

// Модели для сущностей периода для двусторонней связки
const mainDateModel = defineModel('forDate');
const periodStartTimeModel = defineModel('periodStart');
const periodEndTimeModel = defineModel('periodEnd');
const periodReportModel = defineModel('report');

const emit = defineEmits(['submit']);

/**
 * Обработка отправки формы
 */
function handleSubmit() {
  emit('submit');
}
</script>