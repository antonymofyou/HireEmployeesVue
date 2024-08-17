<template>
  <section class="employee">
    <RouterLink class="employee__back-link" :to="{ name: 'employeesList' }">
      <TopSquareButton class="employee__back-btn" :icon="iconBack" />
    </RouterLink>
    <div class="employee__title">
      <h1>Информация о сотруднике</h1>
    </div>
    <EmployeeInfoData
      :key="employeeInfo.managerId"
      :employeeInfo="employeeInfo"
    />
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isManager } from "@/js/AuthFunctions";
import TopSquareButton from "@/components/TopSquareButton.vue";
import iconBack from "@/assets/icons/back.svg";
import { ManagersGetManager } from "./js/ApiClassesEmployeeInfo";
import EmployeeInfoData from "./components/EmployeeInfoData.vue";

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
        console.log(employeeInfo.value);
        isLoading.value = false;
      } else {
        errorMessage.value = err;
        console.log(err);
      }
    },
    function (err) {
      //неуспешный результат
      errorMessage.value = err;
      isLoading.value = false;
      console.log(err);
    }
  );
}

onMounted(() => {
  getEmployeeInfoById();
});
</script>

<style scoped>
.employee {
  padding-bottom: 80px;
  max-width: 925px;
  margin: 20px auto 0;
}
.employee__title {
  width: 100%;
  text-align: center;
}
.employee__back-link {
  display: inline-block;
}
.employee__back-btn {
  position: sticky;
  top: 20px;
  width: 40px;
}
</style>
