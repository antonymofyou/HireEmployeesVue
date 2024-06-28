<template>
  <div class="vacancy-edit__status">
    <div class="vacancy-edit__status-list">
      <div>Статусы: {{ statuses.length ? '' : 'Статусы не заданы' }}</div>
      <div class="vacancy-edit__status-list-box">
        <div
          class="vacancy-edit__status-list-items"
          v-for="status in statuses"
          :key="status.statusName"
        >
          <div
            v-if="status.statusColor"
            class="vacancy-edit__status-list-color"
            :style="{ backgroundColor: status.statusColor }"
          ></div>
          <div class="vacancy-edit__status-list-status">
            {{ status.statusName }}
          </div>
          <ButtonIcon class="vacancy-edit__status-add">
            <template v-slot:icon
              ><IconAdd class="vacancy-edit__status-add-icon"
            /></template>
          </ButtonIcon>
          <div
            class="vacancy-edit__status-list-count"
            v-for="status in transferStatuses[status.statusName]"
          >
            {{ status ? status : '' }}
          </div>
          <div class="vacancy-edit__status-list-comment">
            {{ status.statusComment }}
          </div>
        </div>
      </div>
    </div>

    <ButtonIcon class="vacancy-edit__status-add">
      <template v-slot:icon
        ><IconAdd class="vacancy-edit__status-add-icon"
      /></template>
    </ButtonIcon>

    <!-- <div class="vacancy-edit__status-create">
      <div class="vacancy-edit__status-select-action">
        <div>Действие:</div>
        <SelectMain
          v-model="action"
          :options="actions"
          :model-value="actions[0].id"
        />
      </div>

      <InputSimple
        v-model="statusMod.name"
        id="statusCreation"
        labelName="Название статуса"
        inputType="input"
      />
      <InputSimple
        v-if="action !== 'delete'"
        v-model="statusMod.comment"
        id="statusCreation"
        labelName="Комментарий статуса"
        inputType="textarea"
      />
      <div v-if="action !== 'delete'" class="vacancy-edit__status-select-color">
        <div>Цвет:</div>
        <select
          class="vacancy-edit__status-select-color-select"
          v-model="statusMod.color"
          :style="{ backgroundColor: statusMod.color }"
        >
          <option
            v-for="color in colors"
            :key="color.value"
            :value="color.value"
            :style="{ backgroundColor: color.value }"
          ></option>
        </select>
      </div>

      <ButtonMain
        class="vacancy-edit__status-create-btn"
        :message="errorMessage"
        :isActive="request"
        @click="requestStatusModification"
      >
        <template v-slot:text>{{
          actions.find((a) => a.id === action).name
        }}</template>
      </ButtonMain>
    </div>

    <div class="vacancy-edit__status-edit">
      <InputSimple
        v-model="statusMod.name"
        id="statusEdit"
        labelName="From"
        inputType="input"
      />
      <InputSimple
        v-model="statusMod.toName"
        id="statusEdit"
        labelName="To"
        inputType="input"
      />
      <ButtonMain
        @click="requestStatusTransfer"
        :message="errorMessage"
        :isActive="request"
      >
        <template v-slot:text>Изменить</template>
      </ButtonMain>
    </div>
        -->
  </div>

  <!-- Вывод сообщения о ошибке -->
</template>

<script setup>
import ButtonMain from '@/components/ButtonMain.vue';
import {
  VacanciesGetVacancyStatuses,
  VacanciesModifyVacancyStatus,
  VacanciesSetVacancyStatusTransfer,
} from '../js/ApiClassesVacancyEdit';
import { onMounted, ref } from 'vue';
import InputSimple from '@/components/InputSimple.vue';
import SelectMain from '@/components/SelectMain.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import IconAdd from '@/assets/icons/add.svg?component';

const props = defineProps({
  // Id вакансии
  vacancyId: {
    type: String,
    required: true,
  },
});

const actions = [
  {
    id: 'create',
    name: 'Создать',
  },
  {
    id: 'update',
    name: 'Изменить',
  },
  {
    id: 'delete',
    name: 'Удалить',
  },
];

const colors = [
  { name: 'Зеленый', value: '#48ed00' },
  {
    name: 'Желтый',
    value: '#f6ff00',
  },
  {
    name: 'Красный',
    value: '#ff0000',
  },
  {
    name: 'Синий',
    value: '#0000ff',
  },
  {
    name: 'Фиолетовый',
    value: '#800080',
  },
  {
    name: 'Оранжевый',
    value: '#ffa500',
  },
];

const tab = ref(0);

// Доступные статусы
const statuses = ref([]);
// Доступные трансферные статусы
const transferStatuses = ref({});
// Создаваемый/изменяемый статус
const statusMod = ref({
  name: '',
  toName: '',
  comment: '',
  color: '',
});
// Тип действия
const action = ref('create');
// Флаг запроса
const request = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');

const requestVacancyStatuses = () => {
  const requestInstance = new VacanciesGetVacancyStatuses();
  requestInstance.vacancyId = props.vacancyId;

  errorMessage.value = '';

  requestInstance.request(
    '/vacancies/get_vacancy_statuses.php',
    'manager',
    (response) => {
      statuses.value = response.statuses;
      transferStatuses.value = response.transfers;
    },
    (err) => {
      errorMessage.value = err;
    }
  );
};

// Запрос на создание/изменение/удаление статуса
const requestStatusModification = () => {
  const requestInstance = new VacanciesModifyVacancyStatus();
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.action = action.value;
  requestInstance.statusName = statusMod.value.name;
  requestInstance.statusComment = statusMod.value.comment;
  requestInstance.statusColor = statusMod.value.color;

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
      requestVacancyStatuses();
      request.value = false;
      statusMod.value = {
        name: '',
        toName: '',
        comment: '',
        color: '',
      };
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
  requestInstance.action = action.value;
  requestInstance.statusName = statusMod.value.name;
  requestInstance.toStatusName = statusMod.value.toName;

  if (!statusMod.value.name) {
    errorMessage.value = 'Необходимо ввести название статуса';
    return;
  }
  request.value = true;
  errorMessage.value = '';

  requestInstance.request(
    '/vacancies/set_vacancy_status_transfer.php',
    'manager',
    (response) => {
      requestVacancyStatuses();
      request.value = false;
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
    }
  );
};

onMounted(() => {
  requestVacancyStatuses();
});
</script>

<style scoped>
.vacancy-edit__status {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input {
  width: 100%;
}

.vacancy-edit__status-select-action {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.vacancy-edit__status-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.vacancy-edit__status-list-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vacancy-edit__status-list-items {
  display: flex;
  gap: 5px;
  align-items: center;
}

.vacancy-edit__status-list-color {
  width: 10px;
  height: 10px;
  border-radius: 100%;
}

.vacancy-edit__status-list-comment {
  font-size: 12px;
  display: none;
}

.vacancy-edit__status-select-color {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.vacancy-edit__status-select-color-select {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 100%;
}

.vacancy-edit__status-add {
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
</style>
