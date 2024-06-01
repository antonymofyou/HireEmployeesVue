<template>
  <div class="tg-auth">
    <h1 class="tg-auth__title">Авторизация</h1>
    <p class="tg-auth__message">Войдите через Telegram, чтобы заполнить анкету</p>
    <telegram-login-temp
      mode="callback"
      telegram-login="bt21hirebot"
      @callback="getCandidateToken"
      class="tg-auth__button"
    />
    <p v-if="isError" class="tg-auth__warning">Ошибка: {{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { telegramLoginTemp } from 'vue3-telegram-login';

import { AuthGetCandidateToken } from "./js/ApiClassesTgAuth.js";
import { configData } from '@/js/configData.js';

// Состояние авторизации для обновления
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
    required: true,
  },
});

// Обновление данных об авторизации в родителе
const emit = defineEmits(['update:isLoggedIn']);

// Уведомление об ошибке
const errorMessage = ref('');

// Произошла ли ошибка
const isError = ref(false);

// Получение токена пользователя
const getCandidateToken = (user) => {
  let requestClass = new AuthGetCandidateToken();
  requestClass.telegramData = user;
    
  requestClass.request(
    '/auth/get_candidate_token.php',
    'first',
    function(response) {  // успешный результат
      localStorage.setItem(configData.SEEKER_TOK_NAME, response.candidateToken);
      localStorage.setItem(configData.SEEKER_DEVICE_NAME, response.device);
      emit('update:isLoggedIn', !props.isLoggedIn);
    },
    (err) => {  // неуспешный результат
      isError.value = true;
      errorMessage.value = err;
    });
};
</script>

<style scoped>
.tg-auth {
  position: fixed;
  top: 50%;
  left: 50%;

  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 70px 50px;

  color: rgb(72, 72, 75);

  transform: translateX(-50%) translateY(-50%);

  border-radius: 40px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
}

.tg-auth__title {
  font-size: 28px;

  margin: 0;
}

.tg-auth__message {
  font-size: 18px;
  line-break: normal;
}

.tg-auth__warning {
  font-size: 14px;

  margin: 0;

  color: var(--cinnabar);
}

@media screen and (max-width: 800px) {
  .tg-auth {
    padding: 30px 20px;
  }

  .tg-auth__title {
    font-size: 20px;
  }

  .tg-auth__message {
    font-size: 14px;
  }

  .tg-auth__warning {
    font-size: 12px;
  }
}
</style>