<template>
  <div class="status">
    <div v-if="errorMessage" class="status__error">
      <div class="status__error-text">
        {{ errorMessage }}
      </div>
      <ButtonMain @click="errorMessage = ''"
        ><template v-slot:text>Повторить</template></ButtonMain
      >
    </div>

    <template v-else-if="statusChanged">
      <div class="status__success">Статус отклика изменен</div>
    </template>

    <template v-else>
      <div class="status__info">
        <label class="status__select">
          <div class="status__select-label">Статус отклика</div>
          <SelectMain v-model="status" :options="statuses" />
        </label>
        <ButtonMain @click="changeStatus" :isActive="sendRequest"
          ><template v-slot:text>Изменить</template>
        </ButtonMain>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import {
  CandidatesGetOtklikAnswers,
  CandidatesSetOtklikStatus,
} from '../js/CommentsClasses';
import SelectMain from '@/components/SelectMain.vue';
import ButtonMain from '@/components/ButtonMain.vue';

const props = defineProps({
  // ID отклика
  respondId: {
    type: String,
    required: true,
  },
});

// Флаг загрузки данных
const dataFetched = ref(false);
// Флаг отправки запроса
const sendRequest = ref(false);
// Флаг успешной смены
const statusChanged = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');
// Массив статусов кандидата
const statuses = ref([]);
// Статус кандидата
const status = ref('');

// Запрос данных по ответам кандидата
const requestCandidateInfo = () => {
  const requestInstance = new CandidatesGetOtklikAnswers();
  requestInstance.otklikId = props.respondId;
  errorMessage.value = '';
  dataFetched.value = false;

  requestInstance.request(
    '/candidates/get_otklik_info.php',
    'manager',
    (response) => {
      dataFetched.value = true;

      // Инициализируем массив статусов на основе полученных данных
      if (!response.info.status) {
        // Если статус неизвестный
        status.value = 'Неизвестный';
        statuses.value = response.statusTransfers.length ? response.statusTransfers : [{ name: 'Неизвестный', id: 'Неизвестный' }];
      } else {
        status.value = response.info.status;
        statuses.value = response.statusTransfers.length ? response.statusTransfers : [{ name: response.info.status, id: response.info.status }];
      }
    },
    (err) => (errorMessage.value = err)
  );
};

// Изменение статуса
const changeRespondStatus = () => {
  const requestInstance = new CandidatesSetOtklikStatus();
  requestInstance.otklikId = props.respondId;
  requestInstance.toStatusName = status.value;
  errorMessage.value = '';
  statusChanged.value = false;
  sendRequest.value = true;

  requestInstance.request(
    '/candidates/set_otklik_status.php',
    'manager',
    () => {
      sendRequest.value = false;
      statusChanged.value = true;
    },
    (err) => {
      errorMessage.value = err;
      sendRequest.value = false;
    }
  );
};

// Вызов функции изменения статуса
const changeStatus = () => {
  changeRespondStatus();
};

onMounted(requestCandidateInfo);

watch(
  () => statusChanged.value,
  () => {
    setTimeout(() => {
      statusChanged.value = false;
    }, 2000);
  }
);
</script>

<style scoped>
* {
  font-size: 15px;
}

.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status__info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status__select {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status__select-label {
  font-size: 16px;
  font-weight: 600;
}

@media screen and (max-width: 460px) {
  .status__info {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  .status__select {
    gap: 0;
    width: 100%;
    justify-content: space-between;
    padding-right: 8px;
  }
}

.status__error {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.status__success {
  margin: 10px 0;
  color: var(--success-color);
}

.status__error-text {
  color: var(--error-color);
}
</style>
