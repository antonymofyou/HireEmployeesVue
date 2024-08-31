<template>
  <h1 class="employee__bad-access" v-if="!isAdmin()">
    Данная страница вам недоступна
  </h1>
  <section class="employees" v-if="isAdmin()">
    <h1 class="employee__title">Сотрудники</h1>
    <TopSquareButton
      v-if="isAdmin()"
      class="employees__add-employees-btn"
      @click="showModal = true"
      :icon="plusIcon"
    ></TopSquareButton>
    <div class="employees__box-employees">
      <EmployeeCard
        v-for="employee in employees"
        :key="employee.managerId"
        :employee="employee"
        :requestEmployeesModification="editEmployees"
      />
    </div>

    <!-- Отображение прелоадера  -->
    <SpinnerMain v-if="isLoading && modalSuccess" style="width: 50px" />
    <div v-if="employees.length === 0 && !isLoading">
      На данный момент сотрудников нет
    </div>
  </section>

  <!-- Встраивание компонента Modal в DOM -->
  <Teleport to="body">
    <!-- Открытие модального окна добавления вакансии -->
    <Modal
      :show="showModal"
      v-if="!modalSuccess"
      @click.self="showModal = false"
      class="employees__modal"
    >
      <template #header>
        <div class="employees__modal-close">
          <button class="employees__modal-close-btn" @click="showModal = false">
            &times;
          </button>
        </div>

        <h3>Добавление сотрудника</h3>
      </template>

      <template #body v-if="!modalSuccess">
        <InputSimple
          v-model="formData.name"
          id="name"
          labelName="ФИО сотрудника"
          inputType="input"
          :isLabelBold="true"
          :isTextBold="true"
        />
        <div class="employees__vk-box">
          <InputSimple
            v-model="formData.userVklink"
            id="userVklink"
            labelName="Ссылка на VK сотрудника"
            inputType="input"
            :isLabelBold="true"
            :isTextBold="true"
          />
          <ButtonIcon
            v-if="!isVkidLoading"
            class="employees__btn-check-btn"
            @click="getEmployeeVkId"
          >
            <template v-slot:icon>
              <CheckIcon class="employees__btn-check-icon" />
            </template>
          </ButtonIcon>
          <SpinnerMain
            v-if="isVkidLoading"
            class="employees__loading-check-btn"
          />
        </div>
        <a
          v-if="handleVkId.checked"
          class="employee__vk-link"
          :href="`https://vk.com/id${handleVkId.userVkId}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://vk.com/id{{ handleVkId.userVkId }}
        </a>
        <div v-if="errorMessage != undefined" class="employees__errorMessage">
          {{ errorMessage }}
        </div>
        <h1 class="employees__SelectlabelName">Роль сотрудника:</h1>
        <SelectMain v-model="formData.type" :options="SelectOptions" />
      </template>
      <template #footer-control-buttons>
        <div class="modal__submit" v-if="handleVkId.checked">
          <ButtonMain @click="handleAddEmployee" :isActive="isLoading">
            <template v-slot:text>Добавить</template>
          </ButtonMain>
        </div>
      </template>
    </Modal>
    <!-- Вывод сообщения о ошибке -->
    <ErrorNotification
      v-if="errorMessage && modalSuccess"
      :message="errorMessage"
    />
  </Teleport>
</template>

<script setup>
import { MainRequestClass } from "@/js/RootClasses";
import { onMounted, ref } from "vue";
import { isManager, isAdmin } from "@/js/AuthFunctions";
import { useRouter } from "vue-router";
import plusIcon from "@/assets/icons/plus.svg";
import CheckIcon from "@/assets/icons/check.svg?component";
import EmployeeCard from "./components/EmployeeCard.vue";
import TopSquareButton from "@/components/TopSquareButton.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import SpinnerMain from "@/components/SpinnerMain.vue";
import ButtonMain from "@/components/ButtonMain.vue";
import Modal from "@/components/Modal.vue";
import InputSimple from "@/components/InputSimple.vue";
import SelectMain from "@/components/SelectMain.vue";
import {
  EmployeesSetEmployees,
  ManagersGetVkId,
} from "./js/ApiClassesEmployees";
import ButtonIcon from "@/components/ButtonIcon.vue";

const router = useRouter();
if (!isManager()) router.push({ name: "managerAuth" });

// Отображение ошибки
const errorMessage = ref("");

//Флаги загрузки данных
let isLoading = ref(false);

//Флаги загрузки данных vk id
let isVkidLoading = ref(false);

// Сотрудникик
const employees = ref([]);

//Флаги для модального окна
let showModal = ref(false);
let modalSuccess = ref(false);

//функция перехода к редактированию только что созданного сотрудника
const navigateToEdit = (createdEmployeeId) => {
  router.push({
    name: "employeeEdit",
    params: { id: createdEmployeeId },
  });
};

// Данные Сотрудника: Имя, роль, id VK
const formData = ref({
  name: "",
  type: "",
  userVklink: "",
});

const handleVkId = ref({
  userVkId: "",
  checked: false,
});

// Опции для SelectMain
const SelectOptions = [
  { name: "Админ", id: "1" },
  { name: "Менеджер", id: "2" },
  { name: "Сотрудник", id: "3" },
];

//Заполняем массив set данными select и input
const fillManagerData = () => {
  const roleName = SelectOptions.find((item) => {
    return item.id === formData.value.type ? item.name : ""; // Проверяем только id
  });

  if (roleName) {
    const result = {
      userVkId: handleVkId.value.userVkId.toString(), // Из formData
      type: roleName.name, // id из найденного объекта
      name: formData.value.name, // Из formData
    };
    return result;
  } else {
    // Если не найден, возвращаем пустой объект
    return {};
  }
};

//Функция клика для создания нового сотрудника
const handleAddEmployee = () => {
  const result = fillManagerData(); // Получаем объект с данными
  if (result) {
    // Если объект не пустой
    editEmployees("create", "", result);
  }
};

// получение всех вакансий
function getAllEmployeesList() {
  let requestClass = new MainRequestClass();

  isLoading.value = true;
  requestClass.request(
    "/managers/get_managers.php",
    "manager",
    function (response) {
      //успешный результат
      if (response.success === "1") {
        employees.value = response.managers;
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

//Получения vkid по ссылке на страницу vk
function getEmployeeVkId() {
  let requestClass = new ManagersGetVkId();
  isVkidLoading.value = true;
  requestClass.url = formData.value.userVklink;
  requestClass.request(
    "/managers/get_vk_id.php",
    "manager",
    function (response) {
      //успешный результат
      if (response.success === "1") {
        handleVkId.value.userVkId = response.vkInfo.vkId;
        handleVkId.value.checked = true;
        isVkidLoading.value = false;
        errorMessage.value = "";
      } else {
        errorMessage.value = err;
        isVkidLoading.value = false;
      }
    },
    function (err) {
      //неуспешный результат
      errorMessage.value = err;
      isVkidLoading.value = false;
    }
  );
}

// Создание нового / редактирование Сотрудника
function editEmployees(action, managerId, managerData) {
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
        //сброс формы
        formData.value.userVkId = "";
        formData.value.name = "";
        formData.value.type = "";
        //закрытие модального окна создания и открытие модального окна успешного создания"
        showModal.value = false;
        modalSuccess.value = true;

        isLoading.value = false;

        //переход к редактированию созданного сотруника
        if (action === "create") {
          navigateToEdit(response.info.managerId);
        }

        getAllEmployeesList();
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
  if (isAdmin()) {
    getAllEmployeesList();
  }
});
</script>

<style scoped>
.employees {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  padding-bottom: 80px;
}

.employees__title {
  margin: 0;
  line-height: 42px;
}
.employees__box-employees {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  align-items: center;
}
.employees__add-employees-btn {
  position: sticky;
  align-self: flex-end;
  top: 60px;
  right: 20px;
  transform: translateY(-100%);
  display: flex;
  z-index: 10;
}
.employees__modal-close {
  display: flex;
  justify-content: end;
}

.employees__modal-close-btn {
  font-size: 30px;
  padding: 0;

  cursor: pointer;
  transition: 0.5s ease all;

  border: none;
  background: none;
}

.modal__close-btn:hover {
  filter: opacity(0.6);
}
.employees__SelectlabelName {
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
}
.modal__submit {
  width: 100%;
  display: flex;
  justify-content: center;
}

.modal__success {
  display: flex;
  align-items: center;
  gap: 10px;
}
.employees__new-employees-link {
  text-decoration: none;
}
.employees__btn-check-btn {
  margin-bottom: 2px;
}
.employees__vk-box {
  display: flex;
  align-items: end;
}
.employees__loading-check-btn {
  width: 20px;
  margin: 0 0 10px 10px;
}
.employees__errorMessage {
  color: var(--error-color);
  max-width: 320px;
  font-size: 15px;
}
.employee__bad-access {
  width: fit-content;
  margin: 40px auto;
}
</style>
