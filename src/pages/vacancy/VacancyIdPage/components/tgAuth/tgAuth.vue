<template>
  <div class="tg-auth">
    <!--<h1 class="tg-auth__title">Авторизация</h1>-->
    <div class="tg-auth__message">
      Войдите через Telegram, чтобы заполнить анкету
    </div>
    <div class="tg-auth__message2">*необходимо, чтобы с вами связаться</div>
    <telegram-login-temp
      mode="callback"
      :telegram-login="configData.TELEGRAM_AUTH_BOT"
      class="tg-auth__button"
      @callback="getCandidateToken"
    />
    <p v-if="isError" class="tg-auth__warning">Ошибка: {{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { telegramLoginTemp } from 'vue3-telegram-login';

import { AuthGetCandidateToken } from './js/ApiClassesTgAuth.js';
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
    function (response) {
      // успешный результат
      localStorage.setItem(configData.SEEKER_TOK_NAME, response.candidateToken);
      localStorage.setItem(configData.SEEKER_DEVICE_NAME, response.device);
      emit('update:isLoggedIn', !props.isLoggedIn);
    },
    (err) => {
      // неуспешный результат
      isError.value = true;
      errorMessage.value = err;
    },
  );
};
</script>

<style scoped>
.tg-auth {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 40px;

  color: rgb(72 72 75);

  border-radius: 30px;
  box-shadow:
    0 19px 38px rgb(0 0 0 / 30%),
    0 15px 12px rgb(0 0 0 / 22%);
}

.tg-auth__title {
  margin: 0;
  font-size: 28px;
}

.tg-auth__message {
  margin: 5px;
  font-size: 18px;
  text-align: center;
}

.tg-auth__message2 {
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 12px;
  text-align: center;
}

.tg-auth__warning {
  margin: 0;
  font-size: 14px;
  color: var(--cinnabar);
}

@media (width <= 800px) {
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
