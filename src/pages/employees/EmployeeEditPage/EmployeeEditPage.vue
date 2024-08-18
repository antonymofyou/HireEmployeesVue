<template>
  <section class="employee-edit">
    <RouterLink
      class="employee-edit__back-link"
      :to="{ name: 'employeesList' }"
    >
      <TopSquareButton class="employee-edit__back-btn" :icon="iconBack" />
    </RouterLink>
    <div class="employee-edit__title">
      <h1>Страница редактирования</h1>
    </div>
    <EmployeeEditData
      :key="employeeInfo.managerId"
      :employeeInfo="employeeInfo"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isManager } from "@/js/AuthFunctions";
import TopSquareButton from "@/components/TopSquareButton.vue";
import iconBack from "@/assets/icons/back.svg";
import { ManagersGetManager } from "../EmployeeInfoPage/js/ApiClassesEmployeeInfo";
import EmployeeEditData from "./components/EmployeeEditData.vue";

const router = useRouter();
const route = useRoute();

if (!isManager()) router.push({ name: "managerAuth" });

const employeeId = ref(""); // ID вакансии

const employeeInfo = ref([]);

// Отображение ошибки
const errorMessage = ref("");

//Флаги загрузки данных
const isLoading = ref(false);

// Получение из роута параметров, если есть query
if (route.query.employeeId) {
  employeeId.value = route.query.employeeId;
}

// Запрос на получения информации о сотруднике по ID
function getEmployeeInfoById() {
  let requestClass = new ManagersGetManager();
  requestClass.managerId = employeeId.value;
  // Установление флага прелоадера
  isLoading.value = true;
  requestClass.request(
    "/managers/get_manager.php",
    "manager",
    function (response) {
      if (response.success === "1") {
        //успешный результат
        employeeInfo.value = response.info;
        isLoading.value = false;
      } else {
        errorMessage.value = err;
      }
    },
    function (err) {
      //неуспешный результат
      errorMessage.value = err;
      isLoading.value = false;
    }
  );
}

onMounted(() => {
  getEmployeeInfoById();
});
</script>

<style scoped>
.employee-edit {
  padding-bottom: 80px;
  max-width: 925px;
  margin: 20px auto 0;
}
.employee-edit__back-link {
  display: inline-block;
}
.employee-edit__back-btn {
  position: sticky;
  top: 20px;
  width: 40px;
}
.employee-edit__title {
  width: 100%;
  text-align: center;
}
.employee-edit__save-btn {
  position: sticky;
  top: 20px;
  right: 20px;
  z-index: 10;
  margin: 0 0 20px;
}
.employee-edit__icon-button {
  fill: var(--white);
}
</style>
