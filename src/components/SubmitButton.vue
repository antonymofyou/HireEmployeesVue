<template>
  <div class="submit">
    <button
      class="submit__button"
      :class="{ 'submit__button--loading': isActive }"
      :disabled="isActive"
      @click="onClick"
    >
      <span v-if="isActive" class="submit__spinner"></span>
      <slot v-else></slot>
    </button>
    <span v-if="success === '1'" class="submit__success">{{ message }}</span>
    <span v-else class="submit__warning">{{ message }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Функция события, текст успешного выполнения, текст ошибочного выполнения
const props = defineProps({
  submitFunction: {
    type: Function,
    required: true,
  },
  successText: {
    type: String,
    default: 'Данные успешно сохранены!',
  },
  warningText: {
    type: String,
    default: 'Ошибка!',
  },
});

// Статус кнопки (активна - отправляется запрос, блокируется; не аквтивна - доступна для нажатия)
// для кнопки также добавляется класс для отображения спинера и скрывается её текст
const isActive = ref(false);

// Статус выполнения (1 - success, 0 - warning)
const success = ref('');

// Сообщение для отображения после отправки
const message = ref('');

const onClick = () => {
  // Кнопка переводится в активное состояние выполнения
  isActive.value = true;

  // Вызываем функцию отправки
  props.submitFunction((response) => {
    // получаем данные о статусе и сообщении
    const { message: resMessage, success: resSuccess } = response;

    // Заполняем данными из ответа
    success.value = resSuccess;
    message.value = resSuccess === '1' ? resMessage || props.successText : resMessage || props.warningText;

    // Кнопка переводится в неактивное состояние
    isActive.value = false;
  });
};
</script>

<style scoped>
.submit {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.submit__button {
	position: relative;

  padding: 10px 15px;

	cursor: pointer;

	border: none;
  border-radius: 10px;
	outline: none;

	color: white;
  background-color: rgba(0, 0, 252, .6);

	transition: all 0.5s ease-out;
}

.submit__button:hover {
  background-color: rgba(0, 0, 252, .75);
}

.submit__button:disabled {
  background-color: rgba(0, 0, 252, .4);

  cursor: default;
}


.submit__button--loading {
	border-radius: 50px;
	width: 36px;
  height: 36px;
}

.submit__spinner {
  position: absolute;
	top: 4px;
  left: 4px;

	display: block;
	width: 28px;
	height: 28px;
  box-sizing: border-box;

	background: transparent;
	border-top: 4px solid white;
	border-left: 4px solid transparent;
	border-right: 4px solid transparent;
	border-bottom: 4px solid transparent;
	border-radius: 100%;
	animation: spin 0.6s ease-out infinite;
}
@keyframes spin {
	100% {transform: rotate(360deg)}
}

.submit__success {
  color: rgb(73, 191, 73);
}

.submit__warning {
  color: rgb(233, 65, 65);
}
</style>