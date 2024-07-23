<template>
  <SpinnerMain v-if="request" class="manager-list__status-spinner" />
  <p
    class="manager-listt__status-error"
    v-if="errorMessage && !isAdd && !isEdit"
  >
    {{ errorMessage }}
  </p>
  <VacancyManagersList
    v-if="!request"
    :managerList="managerList.assignedManagers"
    :requestManagersModification
  ></VacancyManagersList>
  <div class="manager-list__options-box">
    <div>Добавить</div>
    <SelectMain
      v-model="formData.id"
      :options="managerList.unassignedManagers"
    />
    <ButtonIcon @click="requestManagersModification('create')">
      <template v-slot:icon><IconAdd class="statuslist__list-icon" /></template>
    </ButtonIcon>
  </div>
</template>

<script setup>
import IconAdd from "@/assets/icons/add.svg?component";
import ButtonIcon from "@/components/ButtonIcon.vue";
import SelectMain from "@/components/SelectMain.vue";
import SpinnerMain from "@/components/SpinnerMain.vue";

import {
  VacanciesAccessGetManagerAccessVacancy,
  VacanciesAccessSetManagerAccessVacancy,
} from "../js/ApiClassesVacancyEdit";
import { onMounted, ref, watch } from "vue";
import VacancyManagersList from "./VacancyManagersList.vue";

const props = defineProps({
  // Id вакансии
  vacancyId: {
    type: String,
    required: true,
  },
});
// Доступные статусы - общие, трансферные, для селекта
const managerList = ref({
  assignedManagers: [],
  unassignedManagers: [],
});
// Информация об изменяемом менеджере
const managerMod = ref({
  action: "",
  permissionType: "VACANCY_PERMISSION",
  managerId: "",
});

//Данные с MainSelect
const formData = ref({
  name: "",
  published: "",
  id: "",
});

// Флаг запроса
const request = ref(false);
// Сообщение об ошибке
const errorMessage = ref("");

// Запрос менеджеров по id
const requestVacancyManagers = () => {
  const requestInstance = new VacanciesAccessGetManagerAccessVacancy();
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.permissionType = managerMod.value.permissionType;
  request.value = true;
  errorMessage.value = "";
  requestInstance.request(
    "/vacancies/access/get_managers_access_vacancy.php",
    "manager",
    (response) => {
      // Обновляем списки менеджеров
      managerList.value.assignedManagers = response.assignedManagers;

      managerList.value.unassignedManagers = response.unassignedManagers;

      request.value = false;
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
    }
  );
};

// Запрос на добавление/удаление менеджера
const requestManagersModification = (action, managerId) => {
  const requestInstance = new VacanciesAccessSetManagerAccessVacancy();
  managerMod.value.action = action;
  //Условие нужно для проверки удаляем или добавляем
  if (formData.value.id) {
    managerMod.value.managerId = formData.value.id;
  } else {
    managerMod.value.managerId = managerId;
  }
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.action = managerMod.value.action;
  requestInstance.permissionType = managerMod.value.permissionType;
  requestInstance.managerId = managerMod.value.managerId;
  request.value = true;
  errorMessage.value = "";
  requestInstance.request(
    "/vacancies/access/set_manager_access_vacancy.php",
    "manager",
    (response) => {
      // Обновляем данные менеджеров
      requestVacancyManagers();
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
    }
  );
};

//при загрузке делаем запрос к серверу
onMounted(() => {
  requestVacancyManagers();
});
</script>

<style scoped>
.manager-list__status-error {
  color: var(--error-color);
}
.manager-list__status-spinner {
  width: 50px;
}
.manager-list {
  margin-top: 40px;
}
.manager-list__options-box {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  max-width: 320px;
}
.statuslist__list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
  .manager-list__select {
    width: 200px;
  }
}
</style>
