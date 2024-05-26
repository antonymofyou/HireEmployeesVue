<template>
  <div class="submit" :class="alignClass">
    <button
      class="submit__button"
      :disabled="isActive"
      @click="onClick"
    >
      <span v-if="isActive" class="submit__spinner"></span>
      <div class="submit__icon" v-if="$slots['icon'] && !isActive" >
        <slot name="icon"></slot>
      </div>
      <span class="submit__text" :class="{ 'submit__text--bold': isBold }">
        <slot name="text"></slot>
      </span>
    </button>
    <span v-if="success === '1'" class="submit__result submit__result--success">{{ message }}</span>
    <span v-else class="submit__result submit__result--warning">{{ message }}</span>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';

// Функция события, текст успешного выполнения, текст ошибочного выполнения
const props = defineProps({
  textColor: {
    type: String,
    default: defaultTextColor,
  },
  buttonColor: {
    type: String,
    default: defaultButtonColor,
  },
  submitFunction: {
    type: Function,
  },
  successText: {
    type: String,
    default: '',
  },
  warningText: {
    type: String,
    default: 'Ошибка!',
  },
  isBold: {
    type: Boolean,
  },
  align: {
    type: String,
    default: 'start',
  }
});

// Статус кнопки (активна - отправляется запрос, блокируется; не аквтивна - доступна для нажатия)
// для кнопки также добавляется класс для отображения спинера и скрывается её текст
const isActive = ref(false);

// Статус выполнения (1 - success, 0 - warning)
const success = ref('');

// Сообщение для отображения после отправки
const message = ref('');

//Переменные для кастомизации кнопки
const defaultButtonColor = 'var(--cornflower-blue)';
const defaultTextColor = 'var(--white)';

// Выравнивание расположения кнопки и сообщения о выполнении
const alignClass = computed(() => ({
  'submit--align-start': props.align === 'start',
  'submit--align-end': props.align === 'end',
}));

const onClick = () => {
  // Если передана функция отправки, Вызываем её
  if (props.submitFunction) {
    props.submitFunction((response) => {
      // Кнопка переводится в активное состояние выполнения
      isActive.value = true;

      // получаем данные о статусе и сообщении
      const { message: resMessage, success: resSuccess } = response;

      // Заполняем данными из ответа
      success.value = resSuccess;
      message.value = resSuccess === '1' ? resMessage || props.successText : resMessage || props.warningText;

      // Кнопка переводится в неактивное состояние
      isActive.value = false;
    });
  };
};
</script>

<style scoped>
.submit {
  display: flex;
  flex-direction: column;
}

.submit--align-start {
  align-items: flex-start;
}

.submit--align-end {
  align-items: flex-end;
  text-align: end;
}

.submit__button {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  padding: 10px 15px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  outline: none;
  color: v-bind(textColor);
  background-color: v-bind(buttonColor);
  transition: all 0.5s ease-out;
}

.submit__button:hover {
  opacity: 0.8;
}

.submit__button:disabled {
  opacity: 0.5;
  cursor: default;
}

.submit__icon {
  width: 20px;
  height: 20px;
}

.submit__text {
  line-height: 20px;
}

.submit__text--bold {
  font-weight: 600;
}

.submit__spinner {
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

.submit__result {
  font-size: 12px;
}

.submit__result--success {
  color: var(--apple);
}

.submit__result--warning {
  color: var(--cinnabar);
}
</style>