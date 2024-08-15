<template>
  <div class="button" :class="alignClass">
    <button class="button__control" :disabled="isActive">
      <span v-if="isActive" class="button__spinner" />
      <div v-if="$slots['icon'] && !isActive" class="button__icon">
        <slot name="icon" />
      </div>
      <span class="button__text" :class="{ 'button__text--bold': isBold }">
        <slot name="text" />
      </span>
    </button>
    <span
      v-if="success === '1'"
      class="button__feedback button__feedback--success"
      >{{ message }}</span
    >
    <span v-else class="button__feedback button__feedback--warning">{{
      message
    }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Статус кнопки (активна - отправляется запрос, блокируется; не аквтивна - доступна для нажатия)
// (для кнопки также добавляется класс для отображения спинера и скрывается её текст),
// Статус выполнения (1 - success, 0 - warning),
// сообщение (фидбек), цвет текста, цвет кнопки, жирный шрифт текста, выравнивание ошибки
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
    required: false,
  },
  success: {
    type: String,
    default: '',
    required: false,
  },
  message: {
    type: String,
    default: '',
    required: false,
  },
  textColor: {
    type: String,
    default: 'var(--white)',
    required: false,
  },
  buttonColor: {
    type: String,
    default: 'var(--cornflower-blue)',
    required: false,
  },
  isBold: {
    type: Boolean,
    default: false,
    required: false,
  },
  align: {
    type: String,
    default: 'start',
    required: false,
  },
});

// Выравнивание расположения кнопки и сообщения о выполнении
const alignClass = computed(() => ({
  'button--align-start': props.align === 'start',
  'button--align-end': props.align === 'end',
}));
</script>

<style scoped>
.button {
  display: flex;
  flex-direction: column;
}

.button--align-start {
  align-items: flex-start;
}

.button--align-end {
  align-items: flex-end;
  text-align: end;
}

.button__control {
  cursor: pointer;

  position: relative;

  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;

  padding: 10px 15px;

  color: v-bind(textcolor);

  background-color: v-bind(buttonColor);
  border: none;
  border-radius: 10px;
  outline: none;

  transition: all 0.5s ease-out;
}

.button__control:hover {
  opacity: 0.8;
}

.button__control:disabled {
  cursor: default;
  opacity: 0.5;
}

.button__icon {
  width: 20px;
  height: 20px;
}

.button__text {
  line-height: 20px;
}

.button__text--bold {
  font-weight: 600;
}

.button__spinner {
  display: inline-block;

  width: 10px;
  height: 10px;
  margin-right: 5px;

  border: 3px solid v-bind(textcolor);
  border-top: 3px solid transparent;
  border-radius: 50%;

  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.button__feedback {
  font-size: 12px;
}

.button__feedback--success {
  color: var(--apple);
}

.button__feedback--warning {
  color: var(--cinnabar);
}
</style>
