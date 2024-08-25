<template>
  <Modal
    :show="props.isShow"
    class="modal-add-period"
    @click.self="$emit('close')"
  >
    <template #header>
      <div>Добавление периода</div>
    </template>

    <template #body>
      <PeriodForm
        v-model:date="props.forDay.date"
        v-model:period-start="newPeriod.periodStart"
        v-model:period-end="newPeriod.periodEnd"
        :disabled-fields="['date']"
        id="add-period-form"
        @submit="handleSubmitForm"
      />
    </template>

    <template #footer-control-buttons>
      <div class="modal-add-period__footer">
        <ButtonMain
          :is-active="props.isLoading"
          :is-disabled="isSubmitButtonDisabled"
          form="add-period-form"
        >
          <template #text>Создать</template>
        </ButtonMain>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue';

import Modal from '@/components/Modal.vue';
import ButtonMain from '@/components/ButtonMain.vue';

import PeriodForm from '../periods/PeriodForm.vue';

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  // К какому дню делаем период
  forDay: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'period-add']);

// Модель нового периода
const newPeriod = ref({
  dayId: props.forDay.dayId,
  periodStart: '',
  periodEnd: ''
});

// Заблокирована ли кнопка отправки формы
const isSubmitButtonDisabled = computed(() => {
  return newPeriod.value.periodStart.length === 0 || newPeriod.value.periodEnd.length === 0;
});

/**
 * Обработка отправки формы
 */
function handleSubmitForm() {
  emit('period-add', newPeriod.value);
}
</script>

<style scoped>
.modal-add-period__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>