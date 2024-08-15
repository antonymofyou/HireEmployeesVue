<template>
  <div v-if="request === true" class="manager-list__header">
      Менеджеры вакансии:
  </div>

  <SpinnerMain v-if="request" class="manager-list__status-spinner" />

  <VacancyManagersList
    :managerList="managerList.assignedManagers"
    :indicators="indicators"
    :managerMod="managerMod"
    :renderAddBtn="isAdmin()"
    @clickManager="setHandledManager"
    @clickAdd="openAddManagersModal"
    @clickDelete="openDeleteManagerModal"
    @resetHandled="resetIsHandled"
  />

  <Teleport to="body">
    <!-- Вывод модалки для добавления и изменения статуса -->
    <VacancyManagersModal
      :show="indicators.isAdd || indicators.isDelete"
      :managerMod
      :indicators
      :managerList="managerList.unassignedManagers"
      :managerListAssigned="managerList.assignedManagers"
      :requestManagersModification
      :request
      :errorMessage
      :formData
    />
  </Teleport>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";

import SpinnerMain from "@/components/SpinnerMain.vue";

import VacancyManagersModal from "./VacancyManagersModal.vue";
import VacancyManagersList from "./VacancyManagersList.vue";

import {
  VacanciesAccessGetManagerAccessVacancy,
  VacanciesAccessSetManagerAccessVacancy,
} from "../../js/ApiClassesVacancyEdit";
import { isAdmin } from "@/js/AuthFunctions";

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

//Индикаторы для открытия попапа и символа крестика
const indicators = ref({
  isDelete: false,
  isAdd: false,
  isHandled: false,
});

// Флаг запроса
const request = ref(false);
// Сообщение об ошибке
const errorMessage = ref({
  error: "",
});

// Запрос менеджеров по id
const requestVacancyManagers = () => {
  const requestInstance = new VacanciesAccessGetManagerAccessVacancy();
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.permissionType = managerMod.value.permissionType;
  request.value = true;
  errorMessage.value.error = "";
    requestInstance.request(
      "/vacancies/access/get_managers_access_vacancy.php",
      "manager",
      (response) => {
        // Обновляем списки менеджеров
        if (response.success === '1') {
          managerList.value.assignedManagers = response.assignedManagers;
          managerList.value.unassignedManagers = response.unassignedManagers;
          request.value = false;
        }
        else {
          errorMessage.value = err;
        }
      },
      (err) => {
        request.value = false;
        errorMessage.value.error = err;
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
  errorMessage.value.error = "";
  requestInstance.request(
    "/vacancies/access/set_manager_access_vacancy.php",
    "manager",
    (response) => {
      // Обновляем данные менеджеров
      if (response.success === '1') {
        requestVacancyManagers();
        indicators.value.isAdd = false;
        indicators.value.isDelete = false;
        formData.value.id = "";
        managerMod.value.managerId = "";
      }
      else {
        errorMessage.value = err;
      }
    },
    (err) => {
      request.value = false;
      errorMessage.value.error = err;
    }
  );
};

/**
 * Установка менеджера, которым манипулируем в данный момент
 * @param {Number} managerId - ID менеджера, на которого кликнули
 */
const setHandledManager = (managerId) => {
  // Если манипулируем менеджером и текущий модифицируемый не равен тому, что в компоненте
  if (indicators.value.isHandled && managerMod.value.managerId !== managerId)
    // Меняем модифицируемого менеджера
    managerMod.value.managerId = managerId;
  else
    indicators.value.isHandled = !indicators.value.isHandled;

  managerMod.value.managerId = managerId;
};

/**
 * Открыть модалку добавления менеджера
 */
const openAddManagersModal = () => {
  indicators.value.isAdd = true;
};

/**
 * Открыть модалку удаления менеджера
 */
const openDeleteManagerModal = () => {
  indicators.value.isDelete = true;
};

/**
 * Сброс индикатора обработки
 */
const resetIsHandled = () => {
  indicators.value.isHandled = false;
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
.manager-list__status-spinner{
  margin-top: 20px;
}
.manager-list__header{
  margin-top: 40px;
  user-select: none;
  font-weight: bold; 
}
</style>
