<template>
  <div v-if="visible" class="error">
    <h2 class="error__title">Ошибка!</h2>
    <span class="error__message">{{ message }}</span>
    <button class="error__close-btn" @click="closeNotification">✕</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps } from 'vue';

// Сообщение об ошибке
const props = defineProps({
  message: String,
});

// Видимость уведомления
const visible = ref(true);

// Закрытие уведомления об ошибке
const closeNotification = () => {
  visible.value = false;
};

// Если появилось сообщение, устанавливаем видимость ошибки
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true;
  }
  // Наблюдатель должен быть вызван немедленно при создании
}, { immediate: true });
</script>

<style scoped>
.error {
  position: fixed;
  top: 30px;
  right: 50%;
  z-index: 1000;

  padding: 20px;

  color: #721c24;

  transform: translateX(50%);
  animation: appearance 1s forwards;

  border-radius: 10px;
  background-color: #f8d7da;
}

.error__title {
  margin-top: 0;
}

.error__close-btn {
  font-size: 16px;
  font-weight: 600;

  position: absolute;
  top: 10px;
  right: 10px;

  cursor: pointer;
  color: #721c24;
  transition: 0.2s ease;
  
  background: none;
  border: none;
}

.error__close-btn:hover {
  filter: opacity(0.7);
}

@keyframes appearance {
  0% { 
    opacity: 0; 
  }
  100% { 
    opacity: 1; 
  }
}
</style>