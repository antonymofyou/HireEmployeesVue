<template>
  <div class="status">
    <div class="status__info">
      <label class="status__select">
        <div class="status__select-label">Статус отклика</div>
        <div v-if="!statuses.find((status) => status.id === status)">
          <StatusColored :status-text="statusCurrent.status" :status-color="statusCurrent.color"></StatusColored>
        </div>
        <div v-if="newStatus">&#9658;</div>
        <SelectMain v-model="newStatus" :options="statuses" />
      </label>

      <div class="status__btn">
        <div v-if="statusChanged" class="status__btn-success">
          Статус отклика изменен
        </div>
        <ButtonMain
          class="status__btn-btn"
          @click="changeStatus"
          :isActive="sendRequest"
          :message="errorMessage"
          ><template v-slot:text>Изменить</template>
        </ButtonMain>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {CandidatesSetOtklikStatus, CandidatesGetOtklikAnswers } from '../js/CommentsClasses';
import SelectMain from '@/components/SelectMain.vue';
import ButtonMain from '@/components/ButtonMain.vue';
import StatusColored from '@/components/StatusColored.vue';

const props = defineProps({
  // ID отклика
  respondId: {
    type: String,
    required: true,
  },
  // Статус
  status: {
    type: String,
    required: true,
  },
  // Цвет статуса
  statusColor: {
    type: String,
    required: true,
  },
  // Массив статусов
  statuses: {
    type: Array,
    required: true,
  },
  //Функция для обновления ключа, чтобы перезагрузить комментарии
  reload: {
    type: Function,
    required: false,
  }
});

const emit = defineEmits(['sendObject']);


const sendToParent = () => {
  const object = { 
    changed : true
  }
  emit('sendObject', object);
}

// Флаг отправки запроса
const sendRequest = ref(false);
// Флаг успешной смены
const statusChanged = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');
// Массив статусов кандидата
const statuses = ref(props.statuses);
// Статус кандидата
const statusCurrent = ref({
  status: props.status,
  color: props.statusColor
});
// Новый статус
const newStatus = ref('');

// Флаг, отслеживающий состояние кнопки
const isButtonActive = ref(false);

// Обновление списка статусов
const updateStatuses = () => {
  getStatusesFromServer((response) => {
    sendRequest.value = true;
    if (response.success === '1') {
      statusCurrent.value = {
        status: response.info.status,
        color: response.info.statusColor,
      };
      statuses.value = response.statusTransfers.map((status) => ({
        name: status.status,
        id: status.status,
        color: status.color,
      }));
    } else {
      errorMessage.value = err;
    }
    sendRequest.value = false;
  },
    (err) => {
      errorMessage.value = err;
      sendRequest.value = false;
    }
  )
}

// Изменение статуса
const changeRespondStatus = () => {
  const requestInstance = new CandidatesSetOtklikStatus();
  requestInstance.otklikId = props.respondId;
  requestInstance.toStatusName = newStatus.value;
  errorMessage.value = '';
  statusChanged.value = false;
  sendRequest.value = true;

  requestInstance.request(
    '/candidates/set_otklik_status.php',
    'manager',
    (response) => {
      if (response.success === '1') {
        statusChanged.value = true;
        isButtonActive.value = false; // Сбрасываем флаг в false
        updateStatuses();
         sendToParent(); // сюда функцию передачи
        newStatus.value = ''; 
      } else {
        errorMessage.value = response.message;
      }
      sendRequest.value = false;
    },
    (err) => {
      isButtonActive.value = false; // Сбрасываем флаг в false
      errorMessage.value = err;
      sendRequest.value = false;
    }
  );
};

// Запрос для получения списка статусов
const getStatusesFromServer = (successCallback, errorCallback) => {
  const requestInstance = new CandidatesGetOtklikAnswers();
  requestInstance.otklikId = props.respondId;

  requestInstance.request(
    '/candidates/get_otklik_info.php',
    'manager',
    (response) => successCallback(response),
    (err) => errorCallback(err),
  );
}

// Вызов функции изменения статуса
const changeStatus = () => {
  if (!isButtonActive.value) {
    isButtonActive.value = true; // Устанавливаем флаг в true
    changeRespondStatus();
  }
};

watch(
  () => statusChanged.value,
  () => {
    setTimeout(() => {
      statusChanged.value = false;
    }, 3000);
  }
);
</script>

<style scoped>
.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.status__info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status__select {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.status__select-label {
  font-size: 16px;
  font-weight: 600;
}

.status__btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 50%;
}

.status__btn-btn {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;
  gap: 5px;
}

@media screen and (max-width: 460px) {
  .status__btn {
    flex-direction: column;
    width: 100%;
  }
  .status__btn-btn {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
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

.status__btn-success {
  width: 100%;
  font-size: 13px;
  color: var(--success-color);
}

</style>
