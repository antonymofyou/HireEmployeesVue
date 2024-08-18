<template>
  <section class="employee-edit">
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
    <h1 class="employee-edit__SelectlabelName">Роль сотрудника:</h1>
    <SelectMain v-model="formData.type" :options="SelectOptions" />
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
        text="Вы уверены, что хотите удалить вакансию? Это действие нельзя отменить"
        confirmButtonColor="var(--cinnabar)"
        :requestObject="removeEmployeeRequestObject"
      />
    </Teleport>
  </section>
  <Teleport to="body">
    <!-- Вывод сообщения о ошибке -->
    <ErrorNotification v-if="errorMessage" :message="errorMessage" />
  </Teleport>
</template>

<script setup>
import { ref, reactive } from "vue";
import { isAdmin } from "@/js/AuthFunctions";
import { useRouter } from "vue-router";
import InputSimple from "@/components/InputSimple.vue";
import SelectMain from "@/components/SelectMain.vue";
import { EmployeesSetEmployees } from "../../EmployeesList/js/ApiClassesEmployees";
import ButtonMain from "@/components/ButtonMain.vue";
import SaveIcon from "@/assets/icons/save.svg?component";
import ModalConfirmation from "@/components/ModalConfirmation.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";

const router = useRouter();

const props = defineProps({
  // информации о сотруднике
  employeeInfo: {},
});
// Опции для SelectMain
const SelectOptions = [
  { name: "Админ", id: "1" },
  { name: "Менеджер", id: "2" },
  { name: "Сотрудник", id: "3" },
];

const formData = ref({
  name: props.employeeInfo.name,
  // Находим объект с нужным типом и берем его id
  type:
    SelectOptions.find((item) => item.name === props.employeeInfo.type)?.id ||
    "",
  userVkId: props.employeeInfo.userVkId,
});

const successSave = ref(""); // при значении 1 делает текст успешного сохранения зеленым
const successMessage = ref(""); // текст успешного сохранения

// индикаторы загрузок для кнопок
let saveLoad = ref(false); // true когда идет сохранение
//Флаги загрузки данных
let isLoading = ref(false);
// Отображение ошибки
const errorMessage = ref("");
// Показ модального окна при удалении вакансии
const showModalOnRemoveEmployee = ref(false);

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
    editEmployees("update", props.employeeInfo.managerId, result);
  }
};

//функция удаления и возвращения на страницу со списком сотрудников
const removeEmployee = () => {
  editEmployees("delete", props.employeeInfo.managerId, "");
  setTimeout(() => {
    router.go(-1);
  }, 200);
};
//реактивная функция удаления
const removeEmployeeRequestObject = reactive({
  fetch: removeEmployee,
});

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
  display: flex;
  flex-direction: column;
  gap: 30px;
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
.employee-edit__SelectlabelName {
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
}
</style>
