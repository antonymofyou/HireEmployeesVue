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
        v-model:spent-time="newDay.spentTime"
        v-model:report="newDay.report"
        v-model:comment="newDay.comment"
        :disabled-fields="disabledFields"
        :removed-fields="props.removedFields"
        :is-loading="props.isLoading"
        :error="props.error"
        :is-submit-disabled="isSubmitButtonDisabled"
        :max-width="props.maxFormWidth"
        @submit="handleSubmitForm"
      />
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import Modal from '@/components/Modal.vue';

import DayForm from '../days/DayForm.vue';

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true
  },
  // Статус загрузки
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
  },
  // Режим (редактирование или добавление)
  mode: {
    type: String,
    required: false,
    default: 'create'
  },
  // Максимальная ширина формы (например: 300px)
  maxFormWidth: {
    type: String,
    required: false,
    default: 'initial'
  }
});

const emit = defineEmits(['submit', 'close']);

// Фабрика для нового дня
const initNewDay = () => ({
  date: props.defaultDay?.date ?? '',
  isWeekend: props.defaultDay?.isWeekend ?? false,
  spentTime: String(props.defaultDay?.spentTime ?? ''),
  report: props.defaultDay?.report ?? '',
  comment: props.defaultDay?.comment ?? ''
});

// Новый день для заполнения
const newDay = ref(initNewDay());

// Не активные поля
const disabledFields = computed(() => {
  switch (props.mode) {
    case 'edit': {
      return ['date']
    }
  }

  return [];
});

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
  // [x] Если какие-то поля отсутствуют - мы их не считаем

  const restFields = Object.keys(newDay.value).filter((key) => !props.removedFields.includes(key));

  if (newDay.value.isWeekend) {
    result = newDay.value.date.length === 0;
  } else if (props.defaultDay) {
    result = true;

    for (const key of restFields) {
      const newValue = newDay.value[key];
      const oldValue = props.defaultDay[key];

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