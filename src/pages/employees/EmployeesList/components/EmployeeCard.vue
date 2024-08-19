<template>
  <div @click="onOpenHendleDelete" class="employee">
    <div class="employee__box">
      <div class="employee__info">
        <div class="employee__name">
          {{ employee.name }}
          <a
            class="employee__vk-link"
            :href="`https://vk.com/id${employee.userVkId}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://vk.com/id{{ employee.userVkId }}
          </a>
        </div>
        <div class="employee__type" :style="{ color: getColor(employee.type) }">
          <RouterLink
            :to="{
              name: 'employeeInfo',
              query: { employeeId: employee.managerId },
            }"
          >
            <ButtonIcon class="employee__btn-edit-btn">
              <template v-slot:icon>
                <Person :style="{ color: getColor(employee.type) }" />
              </template>
            </ButtonIcon>
          </RouterLink>
          {{ employee.type }}
        </div>
      </div>
      <div class="employee__left-side">
        <div class="employee__id">
          <span :style="{ color: getColor(employee.type) }">
            id: {{ employee.managerId }}</span
          >
        </div>
        <RouterLink
          :to="{
            name: 'employeeEdit',
            query: { employeeId: employee.managerId },
          }"
          class="employee__btn-edit"
        >
          <ButtonIcon class="employee__btn-edit-btn">
            <template v-slot:icon>
              <EditIcon class="employee__btn-edit-icon" />
            </template>
          </ButtonIcon>
        </RouterLink>
      </div>
    </div>
    <ButtonIcon
      class="manager-item__btn"
      v-if="
        props.indicators.isHandled &&
        props.indicators.handledManagerId === props.employee.managerId &&
        isAdmin()
      "
      @click="showModalOnRemoveEmployee = true"
    >
      <template v-slot:icon>
        <IconDelete class="manager-item__icon" />
      </template>
    </ButtonIcon>
    <Teleport to="body">
      <Modal
        :show="showModalOnRemoveEmployee"
        @click.self="showModalOnRemoveEmployee = false"
      >
        <template v-slot:header>
          <div>Удалить сотрудника?</div>
          <div>{{ employee.name }}</div>
        </template>
        <template v-slot:body>
          <ButtonMain
            class="employee-edit__modal-btn-add"
            @click="removeEmployee"
          >
            <template v-slot:text> Удалить </template>
          </ButtonMain>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup>
import { isAdmin } from "@/js/AuthFunctions";
import { ref } from "vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import EditIcon from "@/assets/icons/edit.svg?component";
import IconDelete from "@/assets/icons/close.svg?component";
import Person from "@/assets/icons/person.svg?component";
import ModalConfirmation from "@/components/ModalConfirmation.vue";
import ButtonMain from "@/components/ButtonMain.vue";
import Modal from "@/components/Modal.vue";

const props = defineProps({
  employee: {},
  indicators: {
    type: Object,
    require: true,
  },
  deleteFunction: {
    type: Function,
    require: true,
  },
});

// Показ модального окна при удалении вакансии
const showModalOnRemoveEmployee = ref(false);

//Выбор цвета взависимости от типа сотрудника
const getColor = (type) => {
  switch (type) {
    case "Админ":
      return "green";
    case "Менеджер":
      return "#ff9044";
    case "Сотрудник":
      return "blue";
    default:
      return "black"; // Default color if type is unknown
  }
};

//Передача данных к родителю
const emit = defineEmits(["updateIsHandled"]);

//Переменная для проверки открытия кнопки удаления на другой карточке
let swithManagerId = "";

//Открытие крестика удаления
const onOpenHendleDelete = () => {
  let trigger = false;
  swithManagerId === props.indicators.handledManagerId
    ? (trigger = false)
    : (trigger = true);
  props.indicators.handledManagerId = props.employee.managerId;
  swithManagerId = props.indicators.handledManagerId;
  emit("updateIsHandled", trigger); // Отправка события "updateIsHandled"
};

//функция удаления
const removeEmployee = () => {
  props.deleteFunction("delete", props.employee.managerId, "");
};
</script>

<style scoped>
.employee {
  max-width: 500px;
  width: 100%;
  margin: auto;
  position: relative;
  cursor: pointer;
}
.employee__box {
  padding: 10px 30px 15px;
  height: 80px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  transition: box-shadow 0.2s;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: #111;
}
.employee__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.employee__id {
  margin: 0 -5% -4%;
  font-size: 13px;
  line-height: 22px;
  font-weight: 400;
}
.employee__name {
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 15px;
  line-height: 20px;
}
.employee__type {
  font-size: 15px;
  line-height: 20px;
  display: flex;
  gap: 10px;
}
.employee__vk-link {
  text-decoration: none;
  font-size: 14px;
  color: blue;
}
.employee__vk-link:hover {
  text-decoration: underline;
}
.employee__left-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
  gap: 10px;
}
.employee__btn-edit {
  display: flex;
  margin-right: -5%;
}
.employee__btn-edit-btn {
  padding: 0;
}
.employee__box:hover {
  box-shadow: 0 5px 20px rgba(112, 103, 103, 0.5);
}
.employee__type[data-type="Админ"] {
  color: red;
}

.employee__type[data-type="Менеджер"] {
  color: blue;
}

.employee__type[data-type="Сотрудник"] {
  color: green;
}
.button__triangle {
}
.employee__router-buttons {
  display: flex;
  gap: 10px;
}
.manager-item__icon {
  height: 12px;
  width: 12px;
  display: block;
  position: absolute;
  top: 4px;
  right: 3px;
}
.manager-item__btn {
  padding: 0 0 0 1px;
}
.employee-edit__modal-btn-add {
  margin: auto;
}
</style>
