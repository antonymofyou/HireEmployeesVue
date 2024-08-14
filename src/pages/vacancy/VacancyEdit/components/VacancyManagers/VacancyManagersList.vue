<template>
  <div class="manager-list__box">
    <div class="manager-list__header">
      Менеджеры вакансии: {{ managerList.length || "менеджеры не заданы" }}
    </div>
    <div class="manager-list__items-box">
      <div class="manager-list__item-box" v-click-outside>
        <VacancyManagersItem
          v-for="manager in managerList"
          :key="manager.id"
          :manager
          :indicators
          :managerMod
        ></VacancyManagersItem>
				<ButtonIcon
          v-if="isAdmin()"
          @click="openAddManagersModal"
          class="manager-list__add-btn"
        >
        <template v-slot:icon>
          <IconAdd class="manager-list__list-icon" />
        </template>
      </ButtonIcon>
      </div>
    </div>
  </div>
</template>

<script setup>
import VacancyManagersItem from "./VacancyManagersItem.vue";
import IconAdd from "@/assets/icons/add.svg?component";
import ButtonIcon from "@/components/ButtonIcon.vue";
import { isAdmin } from '@/js/AuthFunctions'; 

const props = defineProps({
  // Массив менеджеров
  managerList: {
    type: Array,
    required: true,
  },
  //Функция удаленния менеджера
  requestManagersModification: {
    type: Function,
    required: true,
  },
  // Индикаторы
  indicators: {
    type: Object,
    required: true,
  },
  // Информация об изменяемом менеджере
  managerMod: {
    type: Object,
    required: true,
  },
});

//Открытия попапа добаления менеджеров
const openAddManagersModal = () => {
  props.indicators.isAdd = true;
};

// Директива для закрытия крестика удаления по клику снаружи
const vClickOutside = {
  beforeMount(el) {
    el.clickOutsideEvent = function (event) {
      // Проверка местоположения элемента
      if (
        !(el == event.target || el.contains(event.target)) &&
        props.indicators.isHandled === true
      ) {
        // Вызываем метод после срабатывания клика снаружи
        props.indicators.isHandled = false;
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
</script>

<style scoped>
.manager-list__box {
  margin-top: 40px;
  user-select: none;
}
.manager-list__items-box {
  display: flex;
  margin: 20px 0;
}
.manager-list__add-btn {
  padding: 0;
}
.manager-list__list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
}
.manager-list__item-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.manager-list__header{
  font-weight: bold;
}
</style>
