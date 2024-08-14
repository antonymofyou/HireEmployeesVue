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
  renderAddBtn: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const emit = defineEmits(['addNewManager']);

/**
 * Обработка клика по кнопке добавления
 */
const handleClickAdd = () => {
  emit('addNewManager');
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