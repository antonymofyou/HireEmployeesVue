<template>
  <div class="manager-list__box">
    <div
      v-if="props.isShowTitle"
      class="manager-list__header"
    >
      Менеджеры вакансии: {{ managerList.length || "менеджеры не заданы" }}
    </div>
    <div
      v-click-outside="handleReset"
      class="manager-list__items-box"
    >
      <div class="manager-list__item-box">
        <VacancyManagersItem
          v-for="manager in managerList"
          :key="manager.id"
          :manager="manager"
          :indicators="props.indicators"
          :managerMod="props.managerMod"
          :isRenderDeleteButton="helpers.isRenderDeleteForThisManager(manager.id)"
          @clickManager="handleClickManager"
          @clickDelete="handleClickDelete"
          @onRender="handleVacancyManagerItemRender"
        />
				<ButtonIcon
          @click="handleClickAddBtn"
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
import { ref } from "vue";

import VacancyManagersItem from "./VacancyManagersItem.vue";
import IconAdd from "@/assets/icons/add.svg?component";
import ButtonIcon from "@/components/ButtonIcon.vue";
import { isAdmin } from "@/js/AuthFunctions";

const props = defineProps({
  // Массив менеджеров
  managerList: {
    type: Array,
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
  // Показывать ли заголовок
  isShowTitle: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(['clickManager', 'clickAdd', 'clickDelete', 'resetHandled']);

// Множество с дом-нодами менеджеров статуса
const setOfDomNodesStatusManagers = ref(new Set());

// Функции-хелперы
const helpers = {
  /**
   * Нужно ли рендерить кнопку удаления для менеджера
   * @param {Number} managerId - ID менеджера
   */
  isRenderDeleteForThisManager: (managerId) => {
    return props.indicators.isHandled && props.managerMod.managerId === managerId && isAdmin()
  },
};

/**
 * Обработка клика по менеджеру в списке
 * @param {Number} managerId - ID менеджера, на которого кликнули
 */
const handleClickManager = (managerId) => {
  emit('clickManager', managerId);
};

/**
 * Обработка клика по кнопке добавления
 */
const handleClickAddBtn = () => {
  emit('clickAdd');
};

/**
 * Обработка события удаления менеджера
 */
const handleClickDelete = () => {
  emit('clickDelete');
};

/**
 * Сброс обработки
 */
const handleReset = () => {
  emit('resetHandled');
};

/**
 * Обработка рендера менеджера
 * @param {HTMLElement} domNode - DOM-элемент менеджера
 */
const handleVacancyManagerItemRender = (domNode) => {
  setOfDomNodesStatusManagers.value.add(domNode);
};

// Директива, позволяющая выполнить функцию по клику вне дом-ноды
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
  user-select: none;
}
.manager-list__items-box {
  display: flex;
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
  margin-bottom: 20px;
}
</style>
