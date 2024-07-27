<template>
  <div class="vacancy-edit__status">
    <SpinnerMain v-if="request" class="vacancy-edit__status-spinner" />
    <p
      class="vacancy-edit__status-error"
      v-if="errorMessage && !indicators.isAdd && !indicators.isEdit"
    >
      {{ errorMessage }}
    </p>

    <!-- Список статусов -->
    <VacancyStatusList
      v-if="!request"
      :statusList
      :statusMod
      :indicators
      :handleModification
    />

    <!-- Кнопка добавления статуса -->
    <div class="vacancy-edit__status-add">
      <ButtonIcon
        class="vacancy-edit__status-add-btn"
        @click="openAddStatusModal"
      >
        <template v-slot:icon
          ><IconAdd class="vacancy-edit__status-add-icon" />
        </template>
      </ButtonIcon>
    </div>
  </div>

  <Teleport to="body">
    <!-- Вывод модалки для добавления и изменения статуса -->
    <VacancyStatusModal
        :show="indicators.isAdd || indicators.isEdit"
        :statusMod="statusMod"
        :indicators="indicators"
        :colors="colors"
        :handleModification="handleModification"
        :request="request"
        :errorMessage="errorMessage"
    />
  </Teleport>
</template>

<script setup>
import {
  VacanciesGetVacancyStatuses,
  VacanciesModifyVacancyStatus,
  VacanciesSetVacancyStatusTransfer,
} from '../../js/ApiClassesVacancyEdit.js';
import { onMounted, ref, watch } from 'vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import IconAdd from '@/assets/icons/add.svg?component';
import { colors } from '../../js/statusColors.js';
import VacancyStatusList from './VacancyStatusList.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import VacancyStatusModal from './VacancyStatusModal.vue';
const props = defineProps({
  // Id вакансии
  vacancyId: {
    type: String,
    required: true,
  },
});
// Индикаторы
const indicators = ref({
  isAdd: false,
  isEdit: false,
  isTransfer: false,
  activeHandlers: false,
  activeTransfer: false,
});
// Доступные статусы - общие, трансферные, для селекта
const statusList = ref({
  statuses: [],
  transferStatuses: {},
  statusesSelect: [],
});
// Создаваемый/изменяемый статус
const statusMod = ref({
  action: 'create',
  name: '',
  toName: '',
  comment: '',
  color: '#a3a3a2',
});
// Флаг запроса
const request = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');
// Очистка statusMod после создания/изменения
const resetStatusMod = () => {
  statusMod.value = {
    action: 'create',
    name: '',
    toName: '',
    comment: '',
    color: '#a3a3a2',
  };
};
const requestVacancyStatuses = () => {
  const requestInstance = new VacanciesGetVacancyStatuses();
  requestInstance.vacancyId = props.vacancyId;
  request.value = true;
  errorMessage.value = '';
  requestInstance.request(
    '/vacancies/get_vacancy_statuses.php',
    'manager',
    (response) => {
      // Обновляем списки статусов
      statusList.value.statuses = response.statuses;
      statusList.value.statusesSelect = response.statuses.map((status) => {
        return { name: status.statusName, id: status.statusName };
      });
      statusList.value.transferStatuses = response.transfers;
      // Если статусов нет - создаем шаблонный
      if (!statusList.value.statuses.length) {
        request.value = false;
        statusMod.value = {
          action: 'create',
          name: 'New',
          toName: '',
          comment: 'Новый статус',
          color: '#a3a3a2',
        };
        requestStatusModification();
      }
      request.value = false;
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
    }
  );
};
// Запрос на создание/изменение/удаление статуса
const requestStatusModification = () => {
  const requestInstance = new VacanciesModifyVacancyStatus();
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.action = statusMod.value.action;
  requestInstance.statusName = statusMod.value.name;
  requestInstance.statusComment = statusMod.value.comment;
  requestInstance.statusColor = statusMod.value.color;
  // Если не введено название статуса - выдаем ошибку
  if (!statusMod.value.name) {
    errorMessage.value = 'Необходимо ввести название статуса';
    return;
  }
  request.value = true;
  errorMessage.value = '';
  requestInstance.request(
    '/vacancies/modify_vacancy_status.php',
    'manager',
    (response) => {
      // Сбрасываем данные статуса
      resetStatusMod();
      request.value = false;
      indicators.value.isEdit = false;
      indicators.value.isAdd = false;
      // Обновляем данные статусов
      requestVacancyStatuses();
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
    }
  );
};
const requestStatusTransfer = () => {
  const requestInstance = new VacanciesSetVacancyStatusTransfer();
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.action = statusMod.value.action;
  requestInstance.statusName = statusMod.value.name;
  requestInstance.toStatusName = statusMod.value.toName;
  request.value = true;
  errorMessage.value = '';
  requestInstance.request(
    '/vacancies/set_vacancy_status_transfer.php',
    'manager',
    (response) => {
      // Сбрасываем данные статуса
      resetStatusMod();
      request.value = false;
      indicators.value.isTransfer = false;
      // Обновляем данные статусов
      requestVacancyStatuses();
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
    }
  );
};
/**  Обработчик модификации статуса
 * @param {string} statusName - название статуса
 * @param {'create'|'update'|'delete'} method - тип запроса
 * @param {boolean} transfer - флаг трансфера
 * @param {string} toStatus - название статуса для переноса
 */
const handleModification = (statusName, method, transfer, toStatus) => {
  //Присваиваем данные модификации
  statusMod.value.action = method;
  statusMod.value.name = statusName;
  // Если нужно перенести статус - присваиваем название статуса для переноса
  if (transfer) {
    if (toStatus) {
      statusMod.value.toName = toStatus;
    }
    requestStatusTransfer();
  } else requestStatusModification();
};
const openAddStatusModal = () => {
  indicators.value.isAdd = true;
  resetStatusMod();
};
onMounted(() => {
  requestVacancyStatuses();
});
// Запрещаем скролл страницы при открытии модалки
watch(
  () => [indicators.value.isAdd, indicators.value.isEdit],
  () => {
    document.body.style.overflow =
      indicators.value.isAdd || indicators.value.isEdit ? 'hidden' : '';
  }
);
</script>

<style scoped>
.vacancy-edit__status {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 50px;
}

.spinner__svg {
  align-self: center;
}

.vacancy-edit__status-error {
  color: var(--error-color);
}

.vacancy-edit__status-add {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: fit-content;
  max-width: fit-content;
}

.vacancy-edit__status-add-btn {
  display: flex;
  padding: 0;
  width: fit-content;
}

.vacancy-edit__status-add-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;

  &:hover {
    transform: scale(1.3);
  }
}

.vacancy-edit__status-spinner {
  width: 50px;
}
</style>