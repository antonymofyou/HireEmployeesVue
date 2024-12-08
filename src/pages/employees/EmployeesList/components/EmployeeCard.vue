<template>
  <div @click="onOpenHendleDelete" class="employee">
    <div class="employee__box">
      <div class="employee__info">
        <div class="employee__name">
          {{ employee.name }}
          <a
            v-if="employee.userVkId"
            class="employee__social-link"
            :href="`https://vk.com/id${employee.userVkId}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            vk
          </a>
          <a
            v-if="employee.tgNickname"
            class="employee__social-link"
            :href="`https://t.me/${employee.tgNickname}`"
            target="_blank" 
            rel="noopener noreferrer"
          >
          tg
          </a>
        </div>
        <div class="employee__type" :style="{ color: getColor(employee.type) }">
          {{ employee.type }}
        </div>
      </div>
      <div class="employee__right-side">
        <div class="employee__id">id: {{ employee.managerId }}</div>
        <RouterLink
          :to="{
            name: 'employeeEdit',
            params: { id: employee.managerId },
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import EditIcon from "@/assets/icons/edit.svg?component";
import Person from "@/assets/icons/person.svg?component";

const props = defineProps({
  employee: {},
  indicators: {
    type: Object,
    require: true,
  },
});

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
</script>

<style scoped>
.employee {
  width: 100%;
  position: relative;
}
.employee__box {
  padding: 10px 30px 15px;
  height: 70px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  transition: box-shadow 0.2s;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: #111;
  align-items: center;
  gap: 7px;
}
.employee__info {
  display: flex;
  gap: 10px;
  align-items: center;
}
.employee__id {
  margin: 0 -5% -4%;
  font-size: 11px;
  line-height: 22px;
  font-weight: 400;
  color: gray;
  max-height: 20px;
}
.employee__name {
  gap: 10px;
  overflow: hidden;
  word-break: break-all;
  font-size: 15px;
}
.employee__type {
  font-size: 15px;
  line-height: 20px;
  display: flex;
  gap: 10px;
}
.employee__social-link {
  text-decoration: none;
  font-size: 14px;
  color: blue;
  min-width: fit-content;
  white-space: pre-wrap;
  word-break: break-word;
}
.employee__social-link:hover {
  text-decoration: underline;
}
.employee__right-side {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 10px;
}
.employee__btn-edit-btn {
  padding: 0;
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
.employee__icon-delete {
  height: 12px;
  width: 12px;
  display: block;
  position: absolute;
  top: 4px;
  right: 3px;
}
.employee__btn-delete {
  padding: 0 0 0 1px;
}
.employee-edit__modal-btn-add {
  margin: auto;
}
@media screen and (max-width: 480px) {
  .employee__info {
    flex-direction: column;
    gap: 5px;
    align-items: self-start;
  }
}
@media screen and (max-width: 370px) {
  .employee__name {
    flex-wrap: wrap;
    gap: 5px;
  }
  .employee__box {
    height: 85px;
  }
  .employee__right-side {
    flex-direction: column;
    white-space: nowrap;
  }
}
@media screen and (max-width: 312px) {
  .employee__name {
  }
}
</style>
