<template>
  <section class="employees">
    <h1 class="employee__title">Сотрудники</h1>
    <TopSquareButton
      v-if="isAdmin()"
      class="employees__add-employees-btn"
      @click="showModal = true"
      :icon="plusIcon"
    >
    </TopSquareButton>
    <div class="employees__box-employees" v-click-outside>
      <EmployeeCard
        v-for="employee in employees"
        :key="employee.managerId"
        :employee="employee"
        :requestEmployeesModification="editEmployees"
        :indicators="indicators"
        @updateIsHandled="updateIsHandled"
        :deleteFunction="editEmployees"
      />
    </div>

    <!-- Отображение прелоадера  -->
    <SpinnerMain v-if="isLoading" style="width: 50px" />
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
    >
      <template #header>
        <div class="modal__close">
          <button class="modal__close-btn" @click="showModal = false">
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
        <InputSimple
          v-model="formData.userVkId"
          id="userVkId"
          labelName="VK-id сотрудника"
          inputType="input"
          :isLabelBold="true"
          :isTextBold="true"
        />
        <h1 class="employees__SelectlabelName">Роль сотрудника:</h1>
        <SelectMain v-model="formData.type" :options="SelectOptions" />
      </template>
      <template #footer-control-buttons>
        <div class="modal__submit">
          <ButtonMain @click="handleClick">
            <template v-slot:text>Добавить</template>
          </ButtonMain>
        </div>
      </template>
    </Modal>
    <!-- Вывод сообщения о ошибке -->
    <ErrorNotification v-if="errorMessage" :message="errorMessage" />
  </Teleport>
</template>

<script setup>
import { MainRequestClass } from "@/js/RootClasses";
import { onMounted, ref } from "vue";
import { isManager, isAdmin } from "@/js/AuthFunctions";
import { useRouter } from "vue-router";
import plusIcon from "@/assets/icons/plus.svg";
import EmployeeCard from "./components/EmployeeCard.vue";
import TopSquareButton from "@/components/TopSquareButton.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import SpinnerMain from "@/components/SpinnerMain.vue";
import ButtonMain from "@/components/ButtonMain.vue";
import Modal from "@/components/Modal.vue";
import InputSimple from "@/components/InputSimple.vue";
import SelectMain from "@/components/SelectMain.vue";
import { EmployeesSetEmployees } from "./js/ApiClassesEmployees";

const router = useRouter();
if (!isManager()) router.push({ name: "managerAuth" });

// Отображение ошибки
const errorMessage = ref("");

//Флаги загрузки данных
let isLoading = ref(false);

// Сотрудникик
const employees = ref([]);

//Флаги для модального окна
let showModal = ref(false);
let modalSuccess = ref(false);

//Индиквтор для открытия крестика удаления
const indicators = ref({
  isHandled: false,
  handledManagerId: "",
});

const updateIsHandled = (trigger) => {
  trigger === true && indicators.value.isHandled
    ? (indicators.value.isHandled = indicators.value.isHandled)
    : (indicators.value.isHandled = !indicators.value.isHandled);
};

//функция перехода к редактированию только что созданного сотрудника
const navigateToEdit = (createdEmployeeId) => {
  router.push({
    name: "employeeEdit",
    query: { employeeId: createdEmployeeId },
  });
};

// Директива для закрытия крестика удаления по клику снаружи
const vClickOutside = {
  beforeMount(el) {
    el.clickOutsideEvent = function (event) {
      // Проверка местоположения элемента
      if (
        !(el == event.target || el.contains(event.target)) &&
        indicators.value.isHandled === true
      ) {
        // Вызываем метод после срабатывания клика снаружи
        indicators.value.isHandled = false;
      }
    };
    // Добавляем обработчик нажатия
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    // Удаляем обработчик при размонтировании
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

// Данные Сотрудника: Имя, роль, id VK
const formData = ref({
  name: "",
  type: "",
  userVkId: "",
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

//Функция клика для создания нового сотрудника
const handleClick = () => {
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
  getAllEmployeesList();
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  width: fit-content;
}
.employees__add-employees-btn {
  position: sticky;
  align-self: flex-end;
  top: 60px;
  right: 20px;
  transform: translateY(-100%);
  display: flex;
}
.modal__close {
  display: flex;
  justify-content: end;
}

.modal__close-btn {
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
</style>
