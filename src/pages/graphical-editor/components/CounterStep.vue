<template>
  <div class="stepper-wrapper">
    <div class="stepper">
      <div class="stepper__item">
        <button
          :disabled="isIncrementButtonDisabled"
          @click="callbacks.increment"
          class="stepper__button stepper__button--left"
        >
          +
        </button>
      </div>

      <div class="stepper__item">
         <input
          v-expandable
          v-only-numeric
          :value="props.value"
          @keydown="callbacks.handleKeyDown"
          @input="callbacks.handleInput"
          @change="callbacks.handleChange"
          class="stepper__count"
          type="number"
        />
      </div>

      <div class="stepper__item">
        <button
          :disabled="isDecrementButtonDisabled"
          @click="callbacks.decrement"
          class="stepper__button stepper__button--right"
        >
          -
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
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
});
// const value = defineModel({ type: Number, default: 0 });
const emit = defineEmits(['input', 'change']);

// Минимальная длина в 'ex' единице измерения
const minLengthByEx = 4;

// Динамически высчитываем нужную ширину, чтобы <input /> увеличивался автоматически
const minimumLengthByEx = computed(() => {
  return `${String(props.value).length + minLengthByEx}ex`;
});

// Статус дизейбла кнопок
const isIncrementButtonDisabled = computed(() => {
  return props.value >= props.max;
});
const isDecrementButtonDisabled = computed(() => {
  return props.value <= props.min;
});

// Переиспользуемые функции
const callbacks = {
  increment: () => {
    if (props.value + props.byStep > props.max) return;
    emit('input', props.value + props.byStep);
  },
  decrement: () => {
    if (props.value - props.byStep < props.min) return;
    emit('input', props.value - props.byStep);
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
    }
  },
  /**
   * Обработчик события input у элемента <input />
   * @param {InputEvent} e - Событие
   */
  handleInput: (e) => {
    emit('input', Number(e.target.value));
  },
  /**
   * Обработчик события change у элемента <input />
   * @param {ChangeEvent} e - Событие
   */
  handleChange: () => {
    emit('input', props.value);
  },
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
  border: 2px solid #bcc2cc;
  display: flex;
  border-radius: 6px;
}

.stepper__count {
  appearance: none;
  border: none;
  font: inherit;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-left: 2px solid #bcc2cc;
  border-right: 2px solid #bcc2cc;
  width: v-bind(minimumLengthByEx);
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

.stepper__button:hover {
  background: rgba(68, 71, 70, .1);
}

.stepper__button:active {
  opacity: 0.7;
}

/* Скрываем стрелочки у <input type="number" /> */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>