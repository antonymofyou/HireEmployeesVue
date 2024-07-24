<template>
  <SpinnerMain v-if="request" class="manager-list__status-spinner" />
  <p class="manager-listt__status-error" v-if="errorMessage">
    {{ errorMessage }}
  </p>
  <VacancyManagersList
    v-if="!request"
    :managerList="managerList.assignedManagers"
    :requestManagersModification
  ></VacancyManagersList>
  <div class="manager-list__options-box">
    <div>Добавить:</div>
    <div class="manager-list__select-box">
      <SelectMain
        v-model="formData.id"
        :options="managerList.unassignedManagers"
      />
      <ButtonIcon @click="requestManagersModification('create')">
        <template v-slot:icon
          ><IconAdd class="statuslist__list-icon"
        /></template>
      </ButtonIcon>
    </div>
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
import { onMounted, ref } from "vue";
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
  //Условие нужно для проверки удаляем или добавляем
  formData.value.id
    ? (managerMod.value.managerId = formData.value.id)
    : (managerMod.value.managerId = managerId);
  //Обнуляем форму
  formData.value.id = "";

  managerMod.value.action = action;
  requestInstance.action = managerMod.value.action;
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
      console.log(err);
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
  align-items: center;
}
.manager-list__select-box {
  margin-left: 20px;
  display: flex;
}
.statuslist__list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
}
</style>
