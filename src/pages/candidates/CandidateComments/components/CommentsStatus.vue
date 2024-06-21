<template>
  <div class="status">
    <div v-if="errorMessage" class="status__error">
      <span class="status__error-text">
        {{ errorMessage }}
      </span>
      <ButtonMain @click="errorMessage = ''"
        ><template v-slot:text>Повторить</template></ButtonMain
      >
    </div>

    <template v-else>
      <label class="status__select">
        <span><b>Изменить статус: </b></span>
        <SelectMain v-model="newStatus" :options="statuses" />
      </label>
      <ButtonMain @click="changeStatus"><template v-slot:text>Изменить</template></ButtonMain>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
// Сообщение об ошибке
const errorMessage = ref('');
// Массив статусов кандидата
const statuses = ref([]);
// Новый статус
const newStatus = ref('');

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
      statuses.value = response.statusTransfers;
      dataFetched.value = true;
    },
    (err) => (errorMessage.value = err)
  );
};

// Изменение статуса
const changeRespondStatus = () => {
  const requestInstance = new CandidatesSetOtklikStatus();
  requestInstance.otklikId = props.respondId;
  requestInstance.toStatusName = newStatus.value;
  errorMessage.value = '';

  requestInstance.request(
    '/candidates/set_otklik_status.php',
    'manager',
    (response) => {},
    (err) => (errorMessage.value = err)
  );
};

// Вызов функции изменения статуса
const changeStatus = () => {
  changeRespondStatus();
};

onMounted(requestCandidateInfo);
</script>

<style scoped>
.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status__select {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
}

@media screen and (max-width: 420px) {
  .status__select {
    flex-direction: column;
  }
}

.status__error {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.status__error-text {
  color: var(--error-color);
}
</style>
