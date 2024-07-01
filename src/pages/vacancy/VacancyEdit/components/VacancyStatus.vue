<template>
  <div class="vacancy-edit__status">
    <div class="vacancy-edit__status-list">
      <div>Статусы: {{ statuses.length || 'Статусы не заданы' }}</div>
      <div class="vacancy-edit__status-list-box">
        <div
          class="vacancy-edit__status-list-items"
          v-for="status in statuses"
          :key="status.statusName"
        >
          <!-- <div
            v-if="status.statusColor"
            class="vacancy-edit__status-list-color"
            :style="{ backgroundColor: status.statusColor }"
          ></div> -->
          <div class="vacancy-edit__status-list-status">
            <div
              class="vacancy-edit__status-list-comment"
              :style="{ backgroundColor: status.statusColor }"
              @click="console.log(status)"
            >
              {{ status.statusName }}
              <div
                v-if="status.statusComment"
                class="vacancy-edit__status-list-comment-tooltip"
              >
                {{ status.statusComment || 'Нет комментария' }}
              </div>
              <ButtonIcon
                class="vacancy-edit__status-list-btn"
                @click="
                  (isEdit = true),
                    (statusMod.name = status.statusName),
                    (statusMod.comment = status.statusComment),
                    (statusMod.color = status.statusColor)
                "
              >
                <template v-slot:icon
                  ><IconEdit class="vacancy-edit__status-list-icon-edit"
                /></template>
              </ButtonIcon>
              <ButtonIcon
                class="vacancy-edit__status-list-btn"
                @click="handleModification(status.statusName, 'delete')"
              >
                <template v-slot:icon
                  ><IconDelete class="vacancy-edit__status-list-icon-delete"
                /></template>
              </ButtonIcon>
            </div>
          </div>
          <div v-if="transferStatuses[status.statusName].length">&rarr;</div>
          <div
            v-if="transferStatuses[status.statusName].length"
            class="vacancy-edit__status-list-transfers"
          >
            <div
              class="vacancy-edit__status-list-transfers-box"
              v-for="transfer in transferStatuses[status.statusName]"
            >
              <div
                class="vacancy-edit__status-list-transfers-item"
                :style="{
                  backgroundColor: statuses.find(
                    (s) => s.statusName === transfer
                  ).statusColor,
                }"
              >
                {{ transfer || '' }}
                <ButtonIcon
                  class="vacancy-edit__status-list-btn"
                  @click="
                    handleModification(
                      status.statusName,
                      'delete',
                      true,
                      transfer
                    )
                  "
                >
                  <template v-slot:icon
                    ><IconDelete class="vacancy-edit__status-list-icon-delete"
                  /></template>
                </ButtonIcon>
              </div>
            </div>
          </div>
          <ButtonIcon
            class="vacancy-edit__status-list-btn"
            @click="
              if (isTransfer && statusMod.name !== status.statusName) {
                statusMod.name = status.statusName;
              } else
                (isTransfer = !isTransfer),
                  (statusMod.name = status.statusName);
            "
          >
            <template v-slot:icon
              ><IconAdd class="vacancy-edit__status-list-icon"
            /></template>
          </ButtonIcon>
          <SelectMain
            v-if="isTransfer && statusMod.name === status.statusName"
            :style="{ height: '20px', fontSize: '13px' }"
            v-model="statusMod.toName"
            :options="
              statusesSelect.filter(
                (el) =>
                  el.id !== status.statusName &&
                  transferStatuses[status.statusName].indexOf(el.id) === -1
              )
            "
            @update:model-value="
              handleModification(status.statusName, 'create', true)
            "
          />
        </div>
      </div>
    </div>

    <div class="vacancy-edit__status-add">
      <ButtonIcon
        class="vacancy-edit__status-add-btn"
        @click="
          (isAdd = true),
            (statusMod = {
              name: '',
              toName: '',
              comment: '',
              color: '',
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
    <!-- Вывод модалки -->
    <Modal
      :show="isAdd || isEdit"
      @click.self="
        isAdd = false;
        isEdit = false;
      "
    >
      <template v-slot:header>
        <div class="modal-confirmation__title">
          {{ isAdd ? 'Добавление статуса' : 'Изменение статуса' }}
        </div>
      </template>

      <template v-slot:body>
        <InputSimple
          v-if="isAdd"
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
          v-if="action !== 'delete'"
          class="vacancy-edit__status-select-color"
        >
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
          class="vacancy-edit__status-add-modal-btn"
          @click="
            isAdd
              ? handleModification(statusMod.name, 'create')
              : handleModification(statusMod.name, 'update')
          "
          :isActive="request"
          :message="errorMessage"
        >
          <template v-slot:text>Создать</template>
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
import IconEdit from '@/assets/icons/edit.svg?component';
import IconDelete from '@/assets/icons/close.svg?component';
import SelectMain from '@/components/SelectMain.vue';
import Modal from '@/components/Modal.vue';

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
  {
    name: 'Зеленый',
    value: '#48ed00',
  },
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

// Индикатор добавления
const isAdd = ref(false);
// Индикатор изменения
const isEdit = ref(false);
// Индикатор трансфера
const isTransfer = ref(false);

// Доступные статусы
const statuses = ref([]);
// Статусы для селекта
const statusesSelect = ref([]);
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
const action = ref('');
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
      statusesSelect.value = response.statuses.map((status) => {
        return { name: status.statusName, id: status.statusName };
      });
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
  requestInstance.statusColor = statusMod.value.color || '#a3a3a2';

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
      action.value = 'create';
      isAdd.value = false;
      isEdit.value = false;
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
      isTransfer.value = false;
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

const handleModification = (statusName, method, transfer, toStatus) => {
  action.value = method;
  statusMod.value.name = statusName;
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

watch(
  () => [isAdd.value, isEdit.value],
  () => {
    document.body.style.overflow = isAdd.value || isEdit.value ? 'hidden' : '';
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
  gap: 5px;
}

.vacancy-edit__status-list-items {
  display: flex;
  gap: 10px;
  align-items: center;
}

.vacancy-edit__status-list-color {
  width: 10px;
  height: 10px;
  border-radius: 100%;
}

.vacancy-edit__status-list-status {
  display: flex;
}

.vacancy-edit__status-list-transfers {
  display: flex;
  gap: 5px;
}

.vacancy-edit__status-list-transfers-box {
  display: flex;
  align-items: end;
  &::after {
    content: ',';
  }

  &:last-child::after {
    content: '';
  }
}

.vacancy-edit__status-list-transfers-item {
  display: flex;
  padding: 5px;
  border-radius: 10px;
  color: white;
  padding: 5px 12px;
}

.vacancy-edit__status-list-comment-tooltip {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  margin: 0;
  margin-bottom: -80px;
  margin-left: -3px;
  max-width: 200px;
  max-height: 100px;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  background-color: var(--cornflower-blue);
  color: var(--white);
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
}

.vacancy-edit__status-list-comment {
  min-height: 25px;
  display: flex;
  align-items: center;
  color: white;
  border-radius: 10px;
  padding: 5px 12px;
}

.vacancy-edit__status-list-comment:hover,
.vacancy-edit__status-list-transfers-item:hover {
  .vacancy-edit__status-list-comment-tooltip {
    visibility: visible;
  }
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
  flex-direction: column;
  gap: 10px;
  width: fit-content;
  max-width: fit-content;
}

.vacancy-edit__status-add-btn,
.vacancy-edit__status-list-btn {
  display: flex;
  padding: 0;
  width: fit-content;
}

.vacancy-edit__status-add-icon,
.vacancy-edit__status-list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
}

.vacancy-edit__status-list-icon-edit {
  visibility: hidden;
  display: none;
  position: relative;
  margin: 0;
  margin-top: -15px;
  margin-left: 5px;
  height: 12px;
  width: 12px;
  fill: white;
}

.vacancy-edit__status-list-icon-delete {
  visibility: hidden;
  display: none;
  position: relative;
  margin: 0;
  margin-top: -15px;
  height: 12px;
  width: 12px;
  fill: white;
}

.vacancy-edit__status-add-modal-btn {
  display: flex;
  align-items: center;
  align-self: center;
  width: fit-content;
  gap: 5px;
}
</style>
