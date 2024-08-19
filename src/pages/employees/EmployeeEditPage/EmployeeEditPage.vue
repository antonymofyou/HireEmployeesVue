<template>
  <div v-if="isLoading" class="vacancy-edit__loader">
    <SpinnerMain class="vacancy-edit__loader-spinner" />
  </div>
  <section v-if="!isLoading" class="employee-edit">
    <RouterLink
      class="employee-edit__back-link"
      :to="{ name: 'employeesList' }"
    >
      <TopSquareButton class="employee-edit__back-btn" :icon="iconBack" />
    </RouterLink>
    <div class="employee-edit__title">
      <h1>Страница редактирования</h1>
    </div>
    <ButtonMain
      class="employee-edit__save-btn"
      @click="handleClick"
      :success="successSave"
      :message="successMessage"
      :align="'end'"
      :isActive="saveLoad"
    >
      <template v-slot:text>Сохранить</template>
      <template v-slot:icon
        ><SaveIcon
          width="20px"
          height="20px"
          class="employee-edit__icon-button"
      /></template>
    </ButtonMain>
    <div class="employee-edit__select-box">
      <InputSimple
        v-model="formData.name"
        id="name"
        labelName="ФИО сотрудника"
        inputType="input"
        :isLabelBold="true"
        :isTextBold="true"
      />
      <InputSimple
        v-model="formData.userVkId"
        id="userVkId"
        labelName="VK-id сотрудника"
        inputType="input"
        :isLabelBold="true"
        :isTextBold="true"
      />
      <div>
        <h1 class="employee-edit__SelectlabelName">Роль сотрудника:</h1>
        <SelectMain v-model="formData.type" :options="SelectOptions" />
      </div>
    </div>
    <ButtonMain
      v-if="isAdmin()"
      buttonColor="var(--cinnabar)"
      type="button"
      :align="'end'"
      @click="showModalOnRemoveEmployee = true"
    >
      <template v-slot:text>Удалить вакансию</template>
    </ButtonMain>
    <Teleport to="body">
      <ModalConfirmation
        v-model:show="showModalOnRemoveEmployee"
        confirmText="Удалить"
        text="Вы уверены, что хотите удалить Сотрудника? Это действие нельзя отменить"
        confirmButtonColor="var(--cinnabar)"
        :requestObject="removeEmployeeRequestObject"
      />
    </Teleport>
    <Teleport to="body">
      <!-- Вывод сообщения о ошибке -->
      <ErrorNotification v-if="errorMessage" :message="errorMessage" />
    </Teleport>
  </section>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isAdmin } from "@/js/AuthFunctions";
import { isManager } from "@/js/AuthFunctions";
import { ManagersGetManager } from "../EmployeeInfoPage/js/ApiClassesEmployeeInfo";
import TopSquareButton from "@/components/TopSquareButton.vue";
import iconBack from "@/assets/icons/back.svg";
import SaveIcon from "@/assets/icons/save.svg?component";
import ButtonMain from "@/components/ButtonMain.vue";
import InputSimple from "@/components/InputSimple.vue";
import SelectMain from "@/components/SelectMain.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import ModalConfirmation from "@/components/ModalConfirmation.vue";
import { EmployeesSetEmployees } from "../EmployeesList/js/ApiClassesEmployees";
import SpinnerMain from "@/components/SpinnerMain.vue";

const router = useRouter();
const route = useRoute();

if (!isManager()) router.push({ name: "managerAuth" });

const successSave = ref(""); // при значении 1 делает текст успешного сохранения зеленым
const successMessage = ref(""); // текст успешного сохранения

const employeeId = ref(""); // ID вакансии

const employeeInfo = ref([]);

// Отображение ошибки
const errorMessage = ref("");

// индикаторы загрузок для кнопок
let saveLoad = ref(false); // true когда идет сохранение

//Флаги загрузки данных
const isLoading = ref(false);

// Показ модального окна при удалении вакансии
const showModalOnRemoveEmployee = ref(false);

const SelectOptions = [
  { name: "Админ", id: "1" },
  { name: "Менеджер", id: "2" },
  { name: "Сотрудник", id: "3" },
];

const formData = ref({
  name: "",
  type: "",
  userVkId: "",
  managerId: "",
});

onMounted(() => {
  try {
    getEmployeeInfoById((empResp) => {
      const employee = empResp;
      formData.value = {
        // заполняем formData
        name: employee.name,
        userVkId: employee.userVkId,
        managerId: employee.managerId,
        type:
          SelectOptions.find((item) => item.name === employee.type)?.id || "",
      };
    });
  } catch (err) {
    errorMessage.value = err;
  }
});

// Получение из роута параметров, если есть query
if (route.query.employeeId) {
  employeeId.value = route.query.employeeId;
}

//Заполняем массив set данными select и input
const fillManagerData = () => {
  const roleName = SelectOptions.find((item) => {
    return item.id === formData.value.type ? item.name : ""; // Проверяем только id
  });

  if (roleName) {
    // Если найден, создаем новый объект с необходимыми полями
    const result = {
      userVkId: formData.value.userVkId, // Из formData
      type: roleName.name, // id из найденного объекта
      name: formData.value.name, // Из formData
    };
    return result;
  } else {
    // Если не найден, возвращаем пустой объект
    return {};
  }
};

//обработка клика для обновления данных о сотруднике
const handleClick = () => {
  const result = fillManagerData(); // Получаем объект с данными
  if (result) {
    // Если объект не пустой
    editEmployees("update", formData.value.managerId, result);
  }
};

//функция удаления и возвращения на страницу со списком сотрудников
const removeEmployee = () => {
  editEmployees("delete", formData.value.managerId, "");
  setTimeout(() => {
    router.go(-1);
  }, 200);
};
//реактивная функция удаления
const removeEmployeeRequestObject = reactive({
  fetch: removeEmployee,
});

// Запрос на получения информации о сотруднике по ID
const getEmployeeInfoById = (callback) => {
  let requestClass = new ManagersGetManager();
  requestClass.managerId = employeeId.value;
  // Установление флага прелоадера
  isLoading.value = true;
  requestClass.request(
    "/managers/get_manager.php",
    "manager",
    function (response) {
      if (response.success === "1") {
        callback(response.info);
        //успешный результат
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
};

// Создание нового / редактирование Сотрудника
function editEmployees(action, managerId, managerData) {
  saveLoad.value = true;
  let requestClass = new EmployeesSetEmployees();

  requestClass.action = action;
  requestClass.managerId = managerId;
  requestClass.set = managerData;

  isLoading.value = true;
  requestClass.request(
    "/managers/set_manager.php",
    "manager",
    function (response) {
      //успешный результат
      if (response.success === "1") {
        isLoading.value = false;
        successMessage.value = "Данные успешно сохранены!";
        successSave.value = "1";
        saveLoad.value = false;
      } else {
        errorMessage.value = err;
        successSave.value = "0";
      }
    },
    function (err) {
      //неуспешный результат
      successSave.value = "0";
      successMessage.value = err;
      saveLoad.value = false;
      errorMessage.value = err;
      isLoading.value = false;
    }
  );
}
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
.employee-edit__select-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.employee-edit__SelectlabelName {
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
}
</style>
