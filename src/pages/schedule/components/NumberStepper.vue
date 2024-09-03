<template>
  <div class="stepper-wrapper">
    <div class="stepper">
      <div ref="stepperInnerRef" class="stepper__item">
         <input
          v-only-numeric
          :placeholder="props.placeholder"
          :value="props.value"
          class="stepper__count"
          type="text"
          @keydown="callbacks.handleKeyDown"
          @input="callbacks.handleInput"
          @change="callbacks.handleChange"
        />
      </div>

      <div class="stepper-buttons">
        <button
          :disabled="isIncrementButtonDisabled"
          type="button"
          class="stepper-buttons__button stepper-buttons__up"
          @click="callbacks.increment"
        >
          <UpArrowIcon />
        </button>

        <button
          :disabled="isDecrementButtonDisabled"
          type="button"
          class="stepper-buttons__button stepper-buttons__down"
          @click="callbacks.decrement"
        >
          <DownArrowIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { makeDebouncedFn } from '../js/utils';

import UpArrowIcon from '@/assets/icons/select-up-arrow.svg?component';
import DownArrowIcon from '@/assets/icons/select-down-arrow.svg?component';

const props = defineProps({
  value: {
    type: [Number, String],
    required: true,
  },
  byStep: {
    type: Number,
    required: false,
    default: 1,
  },
  min: {
    type: Number,
    required: false,
    default: 0,
  },
  max: {
    type: Number,
    required: false,
    default: 100,
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  }
});
// const value = defineModel({ type: Number, default: 0 });
const emit = defineEmits(['input', 'change']);

// Ссылка на дом-ноду степпера
const stepperInnerRef = ref(null);

// Статус дизейбла кнопок
const isIncrementButtonDisabled = computed(() => {
  return props.value >= props.max;
});
const isDecrementButtonDisabled = computed(() => {
  return props.value <= props.min;
});
// Событие change будем вызывать отложенно, т.к. пользователь не всегда будет взаимодействовать с <input />
const debouncedChangeEventEmit = computed(() => {
  const { debouncedFn } = makeDebouncedFn(() => emit('change', props.value));
  return debouncedFn;
});
// Переиспользуемые функции
const callbacks = {
  increment: () => {
    const numberValue = Number(props.value);

    if (numberValue + props.byStep > props.max) return;

    let resultNumbertTime = numberValue + props.byStep;

    // Если увеличиваемое время меньше минимального - ставим в минимальное
    if (resultNumbertTime < props.min) {
      resultNumbertTime = props.min;
    }

    const resultStringTime = helpers.formatTime(resultNumbertTime);

    emit('input', resultStringTime);
  
    debouncedChangeEventEmit.value();
  },
  decrement: () => {
    const numberValue = Number(props.value);

    if (numberValue - props.byStep < props.min) return;

    const resultNumbertTime = numberValue - props.byStep;
    const resultStringTime = helpers.formatTime(resultNumbertTime);

    emit('input', resultStringTime);
    debouncedChangeEventEmit.value();
  },
  /**
   * Обработчик нажатия клавиши
   * @param {KeyboardEvent} e - Событие
   */
  handleKeyDown: (e) => {
    // Вводимая буква (т.к. используем директиву на numeric - то сюда попадёт цифра в виде строки)
    const num = e.key;
    // Строка после ввода num
    const resultStr = String(props.value) + num;

    // Если получившаяся после ввода строка будет больше максимума - не даём ввести
    if (Number(resultStr) > props.max) {
      e.preventDefault();
      // Пользователь хочет больше чем максимум - поэтому ставим максимум
      emit('input', props.max);
    }
  },
  /**
   * Обработчик события input у элемента <input />
   * @param {InputEvent} e - Событие
   */
  handleInput: (e) => {
    const resultNumberValue = Number(e.target.value === '' ? '' : e.target.value);
    console.log('Input event: ', e.target.value);

    if (String(resultNumberValue).length > String(props.max).length) {
      emit('input', props.max);
      debouncedChangeEventEmit.value();
      return;
    }

    const resultStringValue = helpers.formatTime(resultNumberValue);

    emit('input', resultStringValue);
    debouncedChangeEventEmit.value();
  },
  /**
   * Обработчик события change у элемента <input />
   * @param {ChangeEvent} e - Событие
   */
  handleChange: (e) => {
    emit('change', props.value);
  },
};

const helpers = {
  /**
   * Отформатировать время в формат 01:01
   * @param {String | Number} time - Время для форматирования
   * @returns {String} - Отформатированное время
   */
  formatTime: (time) => {
    return String(time).padStart(2, '0');
  }
};

// Директива, позволяющая вводить в <input type="number" /> только numeric-значения
const vOnlyNumeric = {
  mounted(el) {
    /**
     * Запрещаем пользователю вставлять неверные значения
     * @param {ClipboardEvent} e Событие
     */
    const pasteHandler = (e) => {
      // Берём вставляемое значение
      const pastedText = e.clipboardData.getData('text');
      // Если пользователь вставляет не число или число отрицательное - не разрешаем
      if (!isFinite(pastedText) || parseFloat(pastedText) < 0) e.preventDefault();
    };
    /**
     * Запрещаем вводить неверные значения
     * @param {KeyboardEvent} e Событие
     */
    const keyDownHandler = (e) => {
      const charCode = (e.which) ? e.which : e.keyCode;
      // Разрешаем ctrl + a
      if ((e.ctrlKey || e.metaKey) && charCode === 65) return;
      // Разрешаем двигаться по стрелочкам
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      // Не разрешаем не числовые символы
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46)
        e.preventDefault();
    };
    el.onpaste = pasteHandler;
    el.onkeydown = keyDownHandler;
  },
  // Чистим обработчики для избежания утечек памяти
  unmounted(el) {
    el.onpaste = null;
    el.onkeydown = null;
  },
};
</script>

<style scoped>
.stepper-wrapper {
  display: inline-block;
}
.stepper {
  border: 1px solid #bcc2cc;
  display: flex;
  position: relative;
}
.stepper__count {
  appearance: none;
  font: inherit;
  border: none;
  display: flex;
  align-items: center;
  width: 100px;
  font-size: 16px;
  padding: 6px 12px;
  line-height: 10px;
  outline: none;
}
.stepper__button {
  border: none;
  appearance: none;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-size: 16px;
  width: 30px;
  height: 30px;
  transition: background ease 0.3s, opacity ease 0.1s;
}
.stepper__button:disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Stepper buttons */
.stepper-buttons {
  position: absolute;
  right: 3px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
}

.stepper-buttons__button {
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  font-size: 10px;
  padding: 0;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.4;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
}

/* Скрываем стрелочки у <input type="number" /> */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>