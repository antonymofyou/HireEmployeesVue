<template>
  <SpinnerMain v-if="request" class="manager-list__status-spinner" />
  <VacancyManagersList
    v-if="!request"
    :managerList="managerList.assignedManagers"
    :requestManagersModification
    :indicators
    :managerMod
  ></VacancyManagersList>
  <div class="manager-list__options-box">
    <ButtonIcon @click="openAddManagersModal" class="manager-list__add-btn">
      <template v-slot:icon
        ><IconAdd class="manager-list__list-icon"
      /></template>
    </ButtonIcon>
  </div>
  <p class="manager-list__status-error" v-if="errorMessage">
    {{ errorMessage }}
  </p>

  <Teleport to="body">
    <!-- Вывод модалки для добавления и изменения статуса -->
    <VacancyManagersModal
      :show="indicators.isAdd || indicators.isDelete"
      :managerMod
      :indicators
      :managerList="managerList.unassignedManagers"
      :requestManagersModification
      :request
      :errorMessage
      :formData
    />
  </Teleport>
</template>

<script setup>
import IconAdd from "@/assets/icons/add.svg?component";
import ButtonIcon from "@/components/ButtonIcon.vue";
import SpinnerMain from "@/components/SpinnerMain.vue";
import VacancyManagersModal from "./VacancyManagersModal.vue";

import {
  VacanciesAccessGetManagerAccessVacancy,
  VacanciesAccessSetManagerAccessVacancy,
} from "../../js/ApiClassesVacancyEdit";
import { onMounted, watch, ref } from "vue";
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

//Индикаторы для открытия попапа
const indicators = ref({
  isDelete: false,
  isAdd: false,
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
  managerMod.value.managerId = managerId;

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
      indicators.value.isAdd = false;
      indicators.value.isDelete = false;
      formData.value.id = "";
      managerMod.value.managerId = "";
    },
    (err) => {
      request.value = false;
      errorMessage.value = err;
    }
  );
};

const openAddManagersModal = () => {
  indicators.value.isAdd = true;
};

//при загрузке делаем запрос к серверу
onMounted(() => {
  requestVacancyManagers();
});

watch(
  () => [indicators.value.isAdd, indicators.value.isDelete],
  () => {
    document.body.style.overflow =
      indicators.value.isAdd || indicators.value.isDelete ? "hidden" : "";
  }
);
</script>

<style scoped>
.manager-list__status-error {
  color: var(--error-color);
}
.manager-list__status-spinner {
  width: 50px;
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
.manager-list__add-btn{
  padding: 0;
}
.manager-list__list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
}
</style>
