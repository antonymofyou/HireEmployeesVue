<template>
  <Modal
    :show="props.isShow"
    class="modal-add-day"
    @pointerdown.self="$emit('close')"
  >
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <template #body>
      <DayForm
        v-model:date="newDay.date"
        v-model:is-weekend="newDay.isWeekend"
        v-model:work-time="newDay.workTime"
        v-model:report="newDay.report"
        v-model:comment="newDay.comment"
        :removed-fields="props.removedFields"
        @submit="handleSubmitForm"
      />
    </template>

    <template #footer-control-buttons>
      <div class="modal-add-day__footer">
        <ButtonMain
          :is-active="props.isLoading"
          :is-disabled="isSubmitButtonDisabled"
          :message="props.error"
          align="center"
          form="add-day-form"
        >
          <template #text>{{ props.buttonText }}</template>
        </ButtonMain>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import Modal from '@/components/Modal.vue';
import ButtonMain from '@/components/ButtonMain.vue';
import DayForm from '../days/DayForm.vue';

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
  title: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: false,
    default: 'Подтвердить'
  },
  // Значения по умолчанию
  defaultDay: {
    type: Object,
    required: false
  },
  error: {
    type: String,
    required: false,
    default: ''
  },
  // Не отображаемые поля
  removedFields: {
    type: Array,
    required: false,
    default: () => []
  }
});

const emit = defineEmits(['submit', 'close']);

// Фабрика для нового дня
const initNewDay = () => ({
  date: props.defaultDay?.date ?? '',
  isWeekend: props.defaultDay?.isWeekend ?? false,
  workTime: String(props.defaultDay?.workTime ?? ''),
  report: props.defaultDay?.report ?? '',
  comment: props.defaultDay?.comment ?? ''
});

// Новый день для заполнения
const newDay = ref(initNewDay());

watch(newDay, (newVal) => {
  console.log(newVal);
})


// Следим за props.isShow, т.к. иначе - newDay всегда будет пустым
watch(() => props.isShow, () => {
  newDay.value = initNewDay();
});

// Заблокирована ли кнопка отправки формы
const isSubmitButtonDisabled = computed(() => {
  let result = false;

  // [x] Если дата пуста при выходном дне - дизейбл
  // [x] Если все значения пусты при не выходном дне - дизейбл
  // [x] Если все значения равны значениям по умолчанию - дизейбл
  // [] Если какие-то поля отсутствуют - мы их не считаем

  const restFields = Object.keys(newDay.value).filter((key) => !props.removedFields.includes(key));
  console.log('RestFields = ', restFields)

  if (newDay.value.isWeekend) {
    result = newDay.value.date.length === 0;
  } else if (props.defaultDay) {
    result = true;

    for (const key of restFields) {
      const newValue = newDay.value[key];
      const oldValue = props.defaultDay[key];

      console.log(newValue, oldValue);

      // Обязательно "!=", не опечатка
      if (newValue != oldValue) {
        result = false;
        break;
      }
    }
  } else {
    for (const key of restFields) {
      const value = newDay.value[key];

      if (typeof value !== 'boolean' && value.length === 0) {
        result = true;
        break;
      }
    }
  }

  return result;
});

/**
 * Обработка отправки формы
 */
function handleSubmitForm() {
  emit('submit', newDay.value);
}
</script>

<style scoped>
.modal-add-day__form {
  display: contents;
}

.modal-add-day__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>