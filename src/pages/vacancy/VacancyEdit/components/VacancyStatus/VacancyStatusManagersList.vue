<template>
  <ul class="managers-list">
    <li
      v-for="manager in props.managers"
      :key="manager.id"
      class="managers-list__item"
    >
      <VacancyManagersItem
        :manager="manager"
        :managerMod="props.managerMod"
        :indicators="props.indicators"
        :ref="handleManagerItemRef"
      />
    </li>

    <li class="item-action">
      <VacancyStatusAddManagerBtn
        v-if="props.renderAddBtn"
        @click="handleClickAdd"
      />
    </li>
  </ul>
</template>

<script setup>
import VacancyManagersItem from '../VacancyManagers/VacancyManagersItem.vue';
import VacancyStatusAddManagerBtn from './VacancyStatusAddManagerBtn.vue';

const props = defineProps({
  // Массив менеджеров
  managers: {
    type: Array,
    required: true
  },
  // Модифицируемый менеджер
  managerMod: {
    type: Object,
    required: true,
  },
  // Индикатор (редактируем / удаляем)
  indicators: {
    type: Object,
    required: true,
  },
  // Рендерить ли кнопку добавления нового менеджера
  renderAddBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Множество, которое будем заполнять в процессе рендера
  fillItOnRender: {
    type: Set,
    required: false,
    default: () => new Set(),
  },
});

const emit = defineEmits(['addNewManager']);

/**
 * Обработка клика по кнопке добавления
 */
const handleClickAdd = () => {
  emit('addNewManager');
};

/**
 * Обработка рефа менеджера
 * @param {Object | null} managerRef - реф менеджера
 */
const handleManagerItemRef = (managerRef) => {
  if (!managerRef) return;
  props.fillItOnRender.add(managerRef.domNode);
};
</script>

<style scoped>
.managers-list {
  display: flex;
  list-style-type: none;
  gap: 3px;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  max-width: 300px;
}

/* Элемент с действием */
.item-action {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>