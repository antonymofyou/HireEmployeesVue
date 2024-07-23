<template>
  <VacancyManagersList :managerList="managerList.assignedManagers"></VacancyManagersList>
  <div class="manager-list__options-box">
    <div class="manager-list__add-item">
              <div>Добавить</div>
            <SelectMain
              v-model="formData.id"
              :options="managerList.unassignedManagers"
            />
            <ButtonIcon @click="requestManagersModification('create')">
              <template v-slot:icon><IconAdd class="statuslist__list-icon" /></template>
            </ButtonIcon>
    </div>
    <div class="manager-list__remove-item">
            <div>Удалить</div>
          <SelectMain
            class="manager-list__select"
            v-model="formData.id"
            :options="managerList.assignedManagers"
          />
          <ButtonIcon @click="requestManagersModification('delete')">
            <template v-slot:icon><IconAdd class="statuslist__list-icon" /></template>
          </ButtonIcon>
    </div>
   
  </div>
</template>

<script setup>
import IconAdd from "@/assets/icons/add.svg?component";
import ButtonIcon from "@/components/ButtonIcon.vue";
import SelectMain from "@/components/SelectMain.vue";

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
      console.log(response);
      managerList.value.assignedManagers = response.assignedManagers;

      managerList.value.unassignedManagers = response.unassignedManagers;

      request.value = false;
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
      console.log(err);
    }
  );
};

// Запрос на добавление/удаление менеджера
const requestManagersModification = (action) => {
  const requestInstance = new VacanciesAccessSetManagerAccessVacancy();
  managerMod.value.action = action; 
  managerMod.value.managerId = formData.value.id;
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.action =  managerMod.value.action;
  requestInstance.permissionType = managerMod.value.permissionType;
  requestInstance.managerId = managerMod.value.managerId;
  request.value = true;
  errorMessage.value = "";
  requestInstance.request(
    "/vacancies/access/set_manager_access_vacancy.php",
    "manager",
    (response) => {
      // Обновляем данные статусов
      requestVacancyManagers();
      // Сбрасываем данные статуса
      console.log(response);
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
      console.log(err);
    }
  );
};

onMounted(() => {
  requestVacancyManagers();
});
</script>

<style scoped>
.manager-list {
  margin-top: 40px;
}
.manager-list__options-box {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 400px;
}
.manager-list__add-item{
  
  display: flex;
  justify-content: space-between;

}
.manager-list__remove-item{
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

}
.statuslist__list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
  .manager-list__select{
    width: 200px;
  }
}
</style>
