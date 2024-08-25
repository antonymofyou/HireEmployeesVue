<template>
  <Modal
    :show="props.isShow"
    class="modal-add-day"
    @click.self="$emit('close')"
  >
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <template #body>
      <form
        @submit.prevent="handleSubmitForm"
        id="add-day-form"
        class="day-form"
      >
        <InputSimple
          v-model="newDay.date"
          placeholder="Дата (yyyy-mm-dd)"
          pattern="\d{4}-\d{2}-\d{2}"
        />
        <div class="day-form__separator">
          <label>
            Выходной?
            <input
              v-model="newDay.isWeekend"
              type="checkbox"
            >
          </label>
        </div>
        <InputSimple
          v-model="newDay.workTime"
          :disabled="isRestDisabled"
          placeholder="Рабочий день (в минутах)"
          pattern="\d+"
        />
        <InputSimple
          v-model="newDay.report"
          :disabled="isRestDisabled"
          placeholder="Отчёт"
          input-type="textarea"
        />
        <InputSimple
          v-model="newDay.comment"
          :disabled="isRestDisabled"
          placeholder="Комментарий"
          input-type="textarea"
        />
      </form>
    </template>

    <template #footer-control-buttons>
      <div class="modal-add-day__footer">
        <ButtonMain
          :is-active="props.isLoading"
          :is-disabled="isSubmitButtonDisabled"
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
import InputSimple from '@/components/InputSimple.vue';

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

// Следим за props.isShow, т.к. иначе - defaultDay всегда будет пустым
watch(() => props.isShow, () => {
  newDay.value = initNewDay();
});

// Заблокирована ли кнопка отправки формы
const isSubmitButtonDisabled = computed(() => {
  let result = false;

  // [x] Если дата пуста при выходном дне - дизейбл
  // [x] Если все значения пусты при не выходном дне - дизейбл
  // [x] Если все значения равны значениям по умолчанию - дизейбл

  if (newDay.value.isWeekend) {
    result = newDay.value.date.length === 0;
  } else if (props.defaultDay) {
    result = true;

    for (const key in newDay.value) {
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
    for (const key in newDay.value) {
      const value = newDay.value[key];

      if (typeof value !== 'boolean' && value.length === 0) {
        result = true;
        break;
      }
    }
  }

  return result;
});

// Будем дизейблить всё, кроме date, если isWeekend === true
const isRestDisabled = computed(() => {
  return newDay.value.isWeekend;
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

/* Day form */
.day-form {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.day-form__separator {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--cornflower-blue);
}
</style>