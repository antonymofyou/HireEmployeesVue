<!-- Компонент основной кнопки: предназначен для отправки какого-либо запроса, при этом можно использовать и как простую кнопку -->
<template>
    <button class="button-main" :class="buttonClass" :disabled="isDisabled || isActive">
        <span v-if="isActive" class="button-main__spinner"></span>
        <div class="button-main__icon" v-if="$slots['icon'] && !isActive">
            <slot name="icon"></slot>
        </div>
        <span class="button-main__text">
            <slot name="text"></slot>
        </span>
    </button>
</template>
  
<script setup>
import { computed } from 'vue';

// Статус кнопки (активна - отправляется запрос, блокируется; не активна - доступна для нажатия)
// (для кнопки также добавляется класс для отображения спинера и скрывается её текст),
// статус disabled кнопки, цвет кнопки, цвет текста в кнопке, вариант кнопки (default - filled, text, outline)
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
    required: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  buttonColor: {
    type: String,
    default: 'var(--cornflower-blue)',
    required: false,
  },
  hoverColor: {
    type: String,
    default: 'var(--cornflower-blue-opacity-08)',
    required: false,
  },
  textColor: {
    type: String,
    default: 'var(--white)',
    required: false,
  },
  variant: {
    type: String,
    default: 'filled', // 'filled', 'outline', 'text'
    required: false,
  },
});

const buttonClass = computed(() => ({
  'button-main--outline': props.variant === 'outline',
  'button-main--text': props.variant === 'text',
}));
</script>
  
<style scoped>
.button-main {
  position: relative;
  font-size: 14px;
  font-weight: bold;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  height: fit-content;

  padding: 10px 15px;
  cursor: pointer;
  color: v-bind(textColor);
  border: none;
  border-radius: 10px;
  outline: none;

  background-color: v-bind(buttonColor);
  transition: all 0.3s ease-out;
}

.button-main:not([disabled]):hover {
  background-color: v-bind(hoverColor);
}

.button-main:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-main--outline {
  background-color: transparent;
  border: 2px solid v-bind(buttonColor);
}

.button-main--text {
  background-color: transparent;
  padding: 0;
  height: max-content;
  color: v-bind(buttonColor);
}

.button-main--text:not([disabled]):hover {
  background: none;
  color: v-bind(hoverColor);
}

.button-main__icon {
  width: 20px;
  height: 20px;
}

.button-main__text {
  width: fit-content;
  line-height: 1;
  min-height: 20px;

  display: inline-flex;
  align-items: center;
}

.button-main__spinner {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 3px solid v-bind(textColor);
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 5px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>