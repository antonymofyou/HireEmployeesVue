<template>
  <div v-if="isLoading && isAdmin()" class="employee-edit__loader">
    <SpinnerMain class="employee-edit__loader-spinner" />
  </div>
  <h1 class="employee__bad-access" v-if="!isAdmin()">
    Данная страница вам недоступна
  </h1>
  <section v-if="!isLoading && isAdmin()" class="employee-edit">
    <RouterLink
      class="employee-edit__back-link"
      :to="{ name: 'employeesList' }"
    >
      <TopSquareButton class="employee-edit__back-btn" :icon="iconBack" />
    </RouterLink>
    <div class="employee-edit__title">
      <h1>Редактирование сотрудника</h1>
    </div>
    <ButtonMain
      class="employee-edit__save-btn"
      @click="saveChanges"
      :success="successSave"
      :message="successMessage"
      :align="'end'"
      :isDisabled="!changedVK"
    >
      <template v-slot:text>Сохранить</template>
      <template v-slot:icon>
        <SaveIcon
          width="20px"
          height="20px"
          class="employee-edit__icon-button"
        />
      </template>
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
      <div class="employee-edit__vk-box">
        <InputSimple
          class="employee-edit__vk-input"
          v-model="handleVkId.userVklink"
          id="userVklink"
          labelName="Ссылка на VK сотрудника"
          inputType="input"
          :isLabelBold="true"
          :isTextBold="true"
        />
        <ButtonIcon
          class="employee-edit__btn-check-btn"
          v-if="!isVkidLoading"
          @click="getEmployeeVkId"
        >
          <template v-slot:icon>
            <CheckIcon class="employee-edit__btn-check-icon" />
          </template>
        </ButtonIcon>
        <SpinnerMain
          v-if="isVkidLoading"
          class="employees-edit__loading-check-btn"
        />
      </div>
      <a
        v-if="handleVkId.checked"
        :href="`https://vk.com/id${formData.userVkId}`"
        target="_blank"
        rel="noopener noreferrer"
        class="employees-edit__vk-link"
      >
        https://vk.com/id{{ formData.userVkId }}
      </a>
      <InputSimple
        v-model="formData.tgNickname"
        id="tgNickname"
        labelName="TG никнейм сотрудника"
        inputType="input"
        :isLabelBold="true"
        :isTextBold="true"
      />
      <div>
        <h1 class="employee-edit__SelectlabelName">Роль сотрудника:</h1>
        <SelectMain v-model="formData.type" :options="SelectOptions" />
      </div>
      <div
        v-if="errorMessage"
        class="employees-edit__errorMessage"
      >
        {{ errorMessage }}
      </div>
    </div>
    <ButtonMain
      class="employees-edit__delete-btn"
      v-if="isAdmin()"
      buttonColor="var(--cinnabar)"
      type="button"
      @click="showModalOnRemoveEmployee = true"
    >
      <template v-slot:text>Удалить сотрудника</template>
    </ButtonMain>
    <Teleport to="body">
      <ModalConfirmation
        v-model:show="showModalOnRemoveEmployee"
        confirmText="Удалить"
        text="Вы уверены, что хотите удалить Сотрудника? Это действие нельзя отменить"
        confirmButtonColor="var(--cinnabar)"
        :requestObject="removeEmployeeRequestObject"
        :show="saveLoad"
      />
    </Teleport>
  </section>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isAdmin } from "@/js/AuthFunctions";
import { isManager } from "@/js/AuthFunctions";
import { ManagersGetManager } from "./js/ApiClassesEmployeeInfo";
import {
  EmployeesSetEmployees,
  ManagersGetVkId,
} from "../EmployeesList/js/ApiClassesEmployees";
import TopSquareButton from "@/components/TopSquareButton.vue";
import CheckIcon from "@/assets/icons/check.svg?component";
import iconBack from "@/assets/icons/back.svg";
import SaveIcon from "@/assets/icons/save.svg?component";
import ButtonMain from "@/components/ButtonMain.vue";
import InputSimple from "@/components/InputSimple.vue";
import SelectMain from "@/components/SelectMain.vue";
import ModalConfirmation from "@/components/ModalConfirmation.vue";
import SpinnerMain from "@/components/SpinnerMain.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";

const router = useRouter();
const route = useRoute();

if (!isManager()) router.push({ name: "managerAuth" });

const successSave = ref(""); // при значении 1 делает текст успешного сохранения зеленым
const successMessage = ref(""); // текст успешного сохранения

// Отображение ошибки
const errorMessage = ref("");

// индикаторы загрузок для кнопок
let saveLoad = ref(false); // true когда идет сохранение

//Флаги загрузки данных
const isLoading = ref(false);

//Флаги загрузки данных vk id
let isVkidLoading = ref(false);

// Показ модального окна при удалении вакансии
const showModalOnRemoveEmployee = ref(false);

// Переменная для хранения предыдущего значения vk link для btn disabled
let previousVkId = null;

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
  tgNickname: "",
});

const handleVkId = ref({
  userVklink: "",
  checked: false,
});
const changedVK = ref(true);

onMounted(() => {
  if (isAdmin()) {
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
          tgNickname: employee.tgNickname,
        };
        handleVkId.value.userVklink = `https://vk.com/id${formData.value.userVkId}`;
      });
    } catch (err) {
      errorMessage.value = err;
    }
  }
});

//функция удаления и возвращения на страницу со списком сотрудников
const removeEmployee = () => {
  editEmployees("delete", formData.value.managerId, "");
};

//реактивная функция удаления
const removeEmployeeRequestObject = reactive({
  fetch: removeEmployee,
});

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
      tgNickname: formData.value.tgNickname.replace(/@/g, ''), // Из formData
    };
    return result;
  } else {
    // Если не найден, возвращаем пустой объект
    return {};
  }
};

//обработка клика для обновления данных о сотруднике
const saveChanges = () => {
  const result = fillManagerData(); // Получаем объект с данными
  if (result) {
    // Если объект не пустой
    editEmployees("update", formData.value.managerId, result);
  }
};

// Запрос на получения информации о сотруднике по ID
const getEmployeeInfoById = (callback) => {
  let requestClass = new ManagersGetManager();
  requestClass.managerId = route.params.id;
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
        isLoading.value = false;
      }
    },
    function (err) {
      //неуспешный результат
      errorMessage.value = err;
      isLoading.value = false;
    }
  );
};

//Получения vkid по ссылке на страницу vk
function getEmployeeVkId() {
  let requestClass = new ManagersGetVkId();

  isVkidLoading.value = true;
  requestClass.url = handleVkId.value.userVklink;
  requestClass.request(
    "/managers/get_vk_id.php",
    "manager",
    function (response) {
      //успешный результат
      if (response.success === "1") {
        formData.value.userVkId = response.vkInfo.vkId.toString();
        handleVkId.value.checked = true;
        changedVK.value = true;
        isVkidLoading.value = false;
        errorMessage.value = "";
      } else {
        errorMessage.value = err;
        isVkidLoading.value = false;
        handleVkId.value.checked = false;
      }
    },
    function (err) {
      //неуспешный результат
      errorMessage.value = err;
      isVkidLoading.value = false;
      handleVkId.value.checked = false;
    }
  );
}

// Создание нового / редактирование Сотрудника
function editEmployees(action, managerId, managerData) {
  action === "update" ? (saveLoad.value = true) : saveLoad.value;
  let requestClass = new EmployeesSetEmployees();

  requestClass.action = action;
  requestClass.managerId = managerId;
  requestClass.set = managerData;

  action === "delete" ? (isLoading.value = true) : isLoading.value;
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
        if (action === "delete") {
          router.go(-1);
        }
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

// Скрытие сообщения о удачном сохранении, при изменении данных
watch(
  formData,
  () => {
    successMessage.value = "";
  },
  { deep: true }
);

watch(
  handleVkId,
  () => {
    successMessage.value = "";
    previousVkId !== null &&
    previousVkId !== handleVkId.value.userVklink &&
    handleVkId.value.userVklink !==
      `https://vk.com/id${formData.value.userVkId}`
      ? ((changedVK.value = false), (handleVkId.value.checked = false))
      : (changedVK.value = true);
    // Обновление значения предыдущего VK ID
    previousVkId = handleVkId.value.userVklink;
  },
  { deep: true }
);
</script>

<style scoped>
.employee-edit {
  padding-bottom: 80px;
  max-width: 925px;
  width: 100%;
  margin: 20px auto 0;
  display: flex;
  flex-direction: column;
  align-items: end;
  position: relative;
}
.employee-edit__back-link {
  display: inline-block;
  position: absolute;
  left: 0;
}
.employee-edit__back-btn {
  position: sticky;
  top: 20px;
  width: 40px;
}
.employee-edit__title {
  width: 100%;
  text-align: center;
  margin-top: 4cap;
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
  width: 100%;
}
.employee-edit__SelectlabelName {
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
}
.employee-edit__loader {
  margin-top: 100px;
  text-align: center;
}

.employee-edit__loader-spinner {
  width: 50px;
}
.employee-edit__btn-check-btn {
  margin-bottom: 2px;
}
.employee-edit__vk-box {
  display: flex;
  align-items: end;
}
.employee-edit__vk-input {
  width: 100%;
}
.employees-edit__loading-check-btn {
  width: 20px;
  margin: 0 0 10px 10px;
}
.employees-edit__errorMessage {
  color: var(--error-color);
  font-size: 15px;
  text-align: end;
}
.employees-edit__vk-link {
  max-width: 270px;
}
.employees-edit__delete-btn {
  margin-top: 10px;
}
.employee__bad-access {
  width: fit-content;
  margin: 40px auto;
}
</style>
