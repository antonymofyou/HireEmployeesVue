<template>
  <div class="vacancy-edit__status">
    <SpinnerMain v-if="request" class="vacancy-edit__status-spinner" />
    <p
      class="vacancy-edit__status-error"
      v-if="errorMessage && !isAdd && !isEdit"
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
        @click="
          (indicators.isAdd = true),
            (statusMod = {
              action: 'create',
              name: '',
              toName: '',
              comment: '',
              color: statusMod.color,
            })
        "
      >
        <template v-slot:icon
          ><IconAdd class="vacancy-edit__status-add-icon" />
        </template>
      </ButtonIcon>
    </div>
  </div>

  <Teleport to="body">
    <!-- Вывод модалки для добавления и изменения статуса -->
    <Modal
      class="vacancy-edit__modal"
      :show="indicators.isAdd || indicators.isEdit"
      @click.self="
        indicators.isAdd = false;
        indicators.isEdit = false;
      "
    >
      <template v-slot:header>
        <div class="vacancy-edit__modal__title">
          {{ indicators.isAdd ? 'Добавление статуса' : 'Изменение статуса' }}
        </div>
      </template>

      <template v-slot:body>
        <InputSimple
          v-if="indicators.isAdd"
          v-model="statusMod.name"
          id="statusEdit"
          inputType="input"
          placeholder="Название статуса"
        />
        <InputSimple
          v-model="statusMod.comment"
          id="statusEdit"
          inputType="textarea"
          placeholder="Комментарий"
        />

        <div
          v-if="statusMod.action !== 'delete'"
          class="vacancy-edit__modal-select"
        >
          <div>Цвет:</div>
          <select
            v-model="statusMod.color"
            class="vacancy-edit__modal-select-color"
            :style="{ backgroundColor: statusMod.color }"
          >
            <option
              v-for="color in colors"
              :key="color.value"
              :value="color.value"
              :style="{ backgroundColor: color.value }"
            >
              {{ color.value }}
            </option>
          </select>
        </div>

        <ButtonMain
          class="vacancy-edit__modal-btn-add"
          @click="
            indicators.isAdd
              ? handleModification(statusMod.name, 'create')
              : handleModification(statusMod.name, 'update')
          "
          :isActive="request"
          :message="errorMessage"
        >
          <template v-slot:text>{{
            indicators.isAdd ? 'Добавить' : 'Изменить'
          }}</template>
        </ButtonMain>
      </template>
    </Modal>
  </Teleport>
</template>

<script setup>
import ButtonMain from '@/components/ButtonMain.vue';
import {
  VacanciesGetVacancyStatuses,
  VacanciesModifyVacancyStatus,
  VacanciesSetVacancyStatusTransfer,
} from '../js/ApiClassesVacancyEdit';
import { onMounted, ref, watch } from 'vue';
import InputSimple from '@/components/InputSimple.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import IconAdd from '@/assets/icons/add.svg?component';
import Modal from '@/components/Modal.vue';
import { colors } from '../js/statusColors.js';
import VacancyStatusList from './VacancyStatusList.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
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
// Запрос статусов по id
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
      // Обновляем данные статусов
      requestVacancyStatuses();
      // Сбрасываем данные статуса
      statusMod.value = {
        action: 'create',
        name: '',
        toName: '',
        comment: '',
        color: '#a3a3a2',
      };
      request.value = false;
      indicators.value.isEdit = false;
      indicators.value.isAdd = false;
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
      // Обновляем данные статусов
      requestVacancyStatuses();
      // Сбрасываем данные статуса
      statusMod.value = {
        action: 'create',
        name: '',
        toName: '',
        comment: '',
        color: '#a3a3a2',
      };
      request.value = false;
      indicators.value.isTransfer = false;
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

.vacancy-edit__modal-btn-add {
  display: flex;
  align-items: center;
  align-self: center;
  width: fit-content;
  gap: 5px;
}

.vacancy-edit__modal-select {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.vacancy-edit__modal-select-color {
  -webkit-appearance: none;
  appearance: none;
  width: 90px;
  height: 20px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
}

.vacancy-edit__status-spinner {
  width: 50px;
}
</style>