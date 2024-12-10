<template>
    <div class="temp-auth">
        <ButtonMain
            class="temp-auth__btn"
            @click="getCandidateToken"
            :isDisabled="props.isLoggedIn"
        >
            <template v-slot:text>Заполнить анкету</template>
        </ButtonMain>
        <div class="temp-auth__message">Тестовое задание в анкете - первый этап собеседования.</div>
        <p v-if="errorMessage" class="temp-auth__error">
            Ошибка: {{ errorMessage }}
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ButtonMain from '@/components/ButtonMain.vue';

import { ApiRootClass } from '@/js/RootClasses';
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

// Получение токена пользователя
const getCandidateToken = () => {
  let requestClass = new ApiRootClass();
  requestClass.request(
    '/auth/get_candidate_token_temp.php',
    'first',
    function(response) {
      if (response.success === '1') {
        localStorage.setItem(configData.SEEKER_TOK_NAME, response.candidateToken);
        localStorage.setItem(configData.SEEKER_DEVICE_NAME, response.device);
        emit('update:isLoggedIn', !props.isLoggedIn);
      } else {
        errorMessage.value = response.message;
      }
    },
    (err) => {
      errorMessage.value = err;
    });
};

</script>

<style scoped>
.temp-auth {
  position: fixed;
  top: 50%;
  left: 50%;

  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  padding: 40px 40px;

  color: rgb(72, 72, 75);

  transform: translateX(-50%) translateY(-50%);

  border-radius: 30px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
}

.temp-auth__message {
  font-size: 12px;
  text-align: center;
}

.temp-auth__error {
  font-size: 14px;
  margin: 0;
  color: var(--cinnabar);
  text-align: center;
}

@media screen and (max-width: 800px) {
  .temp-auth {
    padding: 30px 20px;
  }

  .temp-auth__error {
    font-size: 12px;
  }
}
</style>