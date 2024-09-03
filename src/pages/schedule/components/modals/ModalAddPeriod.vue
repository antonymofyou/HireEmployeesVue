<template>
  <Modal
    :show="props.isShow"
    class="modal-add-period"
    @pointerdown.self="$emit('close')"
  >
    <template #header>
      <div>Добавление рабочего времени</div>
    </template>

    <template #body>
      <PeriodForm
        v-model:date="props.forDay.date"
        v-model:period-start="newPeriod.periodStart"
        v-model:period-end="newPeriod.periodEnd"
        :disabled-fields="['date']"
        :error="finalErrorMessage"
        :is-submit-disabled="isSubmitButtonDisabled"
        :max-width="props.maxFormWidth"
        id="add-period-form"
        @submit="handleSubmitForm"
      />
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import Modal from '@/components/Modal.vue';

import PeriodForm from '../periods/PeriodForm.vue';

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true
  },
  // Идёт ли загрузка
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  // К какому дню делаем период
  forDay: {
    type: Object,
    required: true
  },
  // Ошибка для формы
  error: {
    type: String,
    required: false,
    default: ''
  },
  // Максимальная ширина формы (например: 300px)
  maxFormWidth: {
    type: String,
    required: false,
    default: 'initial'
  }
});

// Локальные ошибки (валидации и т.д.)
const localError = ref('');

// Сообщение об ошибке для показа пользователю
const finalErrorMessage = computed(() => {
  return props.error || localError.value;
});

const emit = defineEmits(['close', 'submit']);

// Вспомогательные функции
const helpers = {
  /**
   * Сравнение двух единиц времени формата hh:mm
   * @param {String} time1
   * @param {String} time2 
   * @returns {Boolean} - Меньше ли первое время второго
   */
  isTimeOneLessThanTwo(time1, time2) {
    const date1 = new Date(`2000-01-01T${time1}Z`);
    const date2 = new Date(`2000-01-01T${time2}Z`);

    if (date1 - date2 < 0) {
      return true;
    }

    return false;
  }
};

// Фабрика для нового периода
const initNewDay = () => ({
  dayId: props.forDay.dayId,
  periodStart: '',
  periodEnd: ''
});

// Модель нового периода
const newPeriod = ref(initNewDay());

// Следим за props.forDay, т.к. иначе - newPeriod всегда будет пустым
watch(() => props.forDay, () => {
  newPeriod.value = initNewDay();
});

// Заблокирована ли кнопка отправки формы
const isSubmitButtonDisabled = computed(() => {
  return newPeriod.value.periodStart.length === 0 || newPeriod.value.periodEnd.length === 0;
});

/**
 * Обработка отправки формы
 */
function handleSubmitForm() {
  // Проверяем корректность введённых данных
  const isTimesCorrect = helpers.isTimeOneLessThanTwo(
    newPeriod.value.periodStart,
    newPeriod.value.periodEnd
  );

  if (!isTimesCorrect) {
    localError.value = 'Первое время больше второго!';
    return;
  }

  localError.value = '';

  emit('submit', newPeriod.value);
}
</script>

<style scoped>
.modal-add-period__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>