<template>
  <div class="vacancy-edit__status">
    <SpinnerMain v-if="request" class="vacancy-edit__status-spinner" />
    <p
      class="vacancy-edit__status-error"
      v-if="errorMessage.error && !indicators.isAdd && !indicators.isEdit"
    >
      {{ errorMessage.error }}
    </p>

    <!-- Список статусов -->
    <VacancyStatusList
      v-if="!request"
      :statusList
      :statusMod
      :indicators
      :status="statusList"
      :handleModification
      :vacancyId="vacancyId"
      :requestSortVacancyStatus="requestSortVacancyStatus"
      @itemStartUpdate="onStatusItemStartUpdate"
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
      :errorMessage="errorMessage.error"
      :managersInList="currentStatusManagers.list"
      :managerMod="managerMod"
      :managersInSelect="currentStatusManagers.select"
      :isAddingManagerRequestNow="isAddingManagerToStatusNow"
      :isDeletingManagerRequestNow="isDeletingManagerFromStatusNow"
      @managerAdd="onManagerAddToCurrentStatus"
      @managerDelete="onManagerDeleteFromCurrentStatus"
    />
  </Teleport>

  <Teleport to="body">
    <!-- Вывод модалки для добавления и изменения менеджера -->
    <VacancyManagersModal
      :title="managersModalTitle"
      :show="isManagersModalVisible"
      :managerMod="managerMod"
      :indicators="indicators"
      :errorMessage="errorMessage"
      :managerList="currentStatusManagers.select"
      :managerListAssigned="currentStatusManagers.list"
      :requestManagersModification="requestManagersModification"
      :formData="formData"
      :request="isAddingManagerToStatusNow"
    />
  </Teleport>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import ButtonIcon from '@/components/ButtonIcon.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';

import VacancyStatusList from './VacancyStatusList.vue';
import VacancyStatusModal from './VacancyStatusModal.vue';
import VacancyManagersModal from '../VacancyManagers/VacancyManagersModal.vue';

import {
  VacanciesGetVacancyStatuses,
  VacanciesModifyVacancyStatus,
  VacanciesSetVacancyStatusTransfer,
  VacanciesSortVacancyStatus,
  VacanciesAccessGetManagerAccessVacancy,
  VacanciesAccessSetManagerAccessVacancy,
} from '../../js/ApiClassesVacancyEdit.js';
import { colors } from '../../js/statusColors.js';

import IconAdd from '@/assets/icons/add.svg?component';

const props = defineProps({
  // Id вакансии
  vacancyId: {
    type: String,
    required: true,
  },
});
// Индикаторы статуса
const indicators = ref({
  isAdd: false,
  isManagerAdd: false,
  isEdit: false,
  isDelete: false,
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
  activeTransfer: '',
});
// Менеджеры текущего выбранного статуса
const currentStatusManagers = ref({
  list: [], // Отобразим в списке
  select: [], // Отобразим в селекте
});
// Флаг запроса
const request = ref(false);
// Идёт ли запрос на добавление менеджера к текущему статусу сейчас
const isAddingManagerToStatusNow = ref(false);
// Идёт ли запрос на удаление менеджера из текущего статуса сейчас
const isDeletingManagerFromStatusNow = ref(false);
// Сообщение об ошибке
const errorMessage = ref({
  error: "",
});
// Информация об изменяемом менеджере
const managerMod = ref({
  action: '',
  permissionType: 'STATUS_PERMISSION',
  managerId: '',
});
// Данные из <MainSelect />
const formData = ref({
  id: "",
});
// Заголовок модалки с менеджером
const managersModalTitle = computed(() => {
  if (indicators.value.isDelete) return 'Удалить менеджера статуса?';
  else if (indicators.value.isManagerAdd) return 'Добавить менеджера статуса';
});
// Видна ли модалка менеджеров
const isManagersModalVisible = computed(() => {
  return indicators.value.isDelete || indicators.value.isManagerAdd;
});

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
  errorMessage.value.error = '';
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
      errorMessage.value.error = err;
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
    errorMessage.value.error = 'Необходимо ввести название статуса';
    return;
  }
  request.value = true;
  errorMessage.value.error = '';
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
      errorMessage.value.error = err;
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
  errorMessage.value.error = '';
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
      errorMessage.value.error = err;
    }
  );
};
const requestSortVacancyStatus = (vacancyId, statusName, direction) => {
  const requestInstance = new VacanciesSortVacancyStatus();
  requestInstance.vacancyId = vacancyId;
  requestInstance.statusName = statusName;
  requestInstance.direction = direction;

  request.value = true;
  errorMessage.value.error = '';

  requestInstance.request(
    '/vacancies/sort_vacancy_status.php',
    'manager',
    (response) => {
      // После успешного запроса обновляем данные статусов
      if (response.success === "1"){
        requestVacancyStatuses();
        request.value = false;
      } else {
        errorMessage.value += ' '+response.message+'.'
      }
    },
    (err) => {
      request.value = false;
      errorMessage.value.error = err;
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

/**
 * Запрос на добавление/удаление менеджера
 * @param {'create'|'delete'} action - Строка с действием, которое необходимо выполнить
 * @param {Number}  managerId - ID менеджера
 */
const requestManagersModification = (action, managerId) => {
  switch (action) {
    case 'create': {
      onManagerAddToCurrentStatus(managerId);
      break;
    }
    case 'delete': {
      onManagerDeleteFromCurrentStatus(managerId);
      indicators.value.isDelete = false;
    }
  }
};

/**
 * Запросить всех менеджеров текущего выбранного статуса
 */
const requestCurrentStatusManagers = () => {
  const requestInstance = new VacanciesAccessGetManagerAccessVacancy();

  requestInstance.vacancyId = props.vacancyId;
  requestInstance.statusName = statusMod.value.name;
  requestInstance.permissionType = 'STATUS_PERMISSION';

  requestInstance.request(
    '/vacancies/access/get_managers_access_vacancy.php',
    'manager',
    (response) => {
      // Успех - устанавливаем менеджеров к текущему статусу на отображение
      if (response.success === '1') {
        currentStatusManagers.value.list = response.assignedManagers;
        currentStatusManagers.value.select = response.unassignedManagers;
      } else {
        errorMessage.value.error = response.message;
      }
    },
    (err) => {
      // Обработка ошибки при запросе
      errorMessage.value.error = err;
    }
  );
};

/**
 * Обработчик начала изменения статуса в списке
 */
const onStatusItemStartUpdate = (status) => {
  statusMod.value = {
    action: 'update',
    name: status.statusName,
    comment: status.statusComment,
    color: status.statusColor
  };
};

/**
 * Обработчик добавления менеджера к текущему статусу
 * @param {Number} managerId - ID менеджера
 */
const onManagerAddToCurrentStatus = (managerId) => {
  isAddingManagerToStatusNow.value = true;

  const requestInstance = new VacanciesAccessSetManagerAccessVacancy();

  requestInstance.vacancyId = props.vacancyId;
  requestInstance.statusName = statusMod.value.name;
  requestInstance.managerId = managerId;
  requestInstance.action = 'create';
  requestInstance.permissionType = managerMod.value.permissionType;

  requestInstance.request(
    '/vacancies/access/set_manager_access_vacancy.php',
    'manager',
    (response) => {
      // Успех
      if (response.success === '1') {
        requestCurrentStatusManagers();
        indicators.value.isManagerAdd = false;
        formData.value.id = '';
        errorMessage.value.error = '';
      } else {
        errorMessage.value.error = response.message;
      }

      // Общие действия
      isAddingManagerToStatusNow.value = false;
    },
    (err) => {
      // Обработка ошибки при запросе
      errorMessage.value.error = err;
      isAddingManagerToStatusNow.value = false;
    }
  );
};

/**
 * Обработчик удаления менеджера от текущего статуса
 * @param {Number} managerId - ID менеджера
 */
const onManagerDeleteFromCurrentStatus = (managerId) => {
  isDeletingManagerFromStatusNow.value = true;

  const requestInstance = new VacanciesAccessSetManagerAccessVacancy();

  requestInstance.vacancyId = props.vacancyId;
  requestInstance.statusName = statusMod.value.name;
  requestInstance.managerId = managerId;
  requestInstance.action = 'delete';
  requestInstance.permissionType = managerMod.value.permissionType;

  requestInstance.request(
    '/vacancies/access/set_manager_access_vacancy.php',
    'manager',
    (response) => {
      // Успех
      if (response.success === '1') {
        requestCurrentStatusManagers();
        errorMessage.value.error = '';
      } else {
        // Ошибка
        errorMessage.value.error = response.message;
      }
      
      // Общие действия
      isDeletingManagerFromStatusNow.value = false;
    },
    (err) => {
      // Обработка ошибки при запросе
      errorMessage.value.error = err;
      isDeletingManagerFromStatusNow.value = false;
    }
  );
};

// При изменение выбранного статуса - перезапрашиваем всех менеджеров
watch(statusMod, () => {
  // Исполняем запрос, только если выбран статус
  if (!statusMod.value.name) return;
  requestCurrentStatusManagers()
});

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