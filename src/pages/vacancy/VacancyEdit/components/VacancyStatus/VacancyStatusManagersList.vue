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
      <ButtonIcon
        v-if="isAdmin() && props.managers.length > 0"
        @click="showModalAddManager"
        class="item-action__button"
      >
        <template #icon>
          <IconAdd class="item-action__icon" />
        </template>
      </ButtonIcon>
    </li>
  </ul>
</template>

<script setup>
import ButtonIcon from '@/components/ButtonIcon.vue';

import { isAdmin } from '@/js/AuthFunctions';

import IconAdd from "@/assets/icons/add.svg?component";

import VacancyManagersItem from '../VacancyManagers/VacancyManagersItem.vue';

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
});

/**
 * Показать модалку с добавлением менеджера
 */
 const showModalAddManager = () => {
  props.indicators.isManagerAdd = true;
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

.item-action__button:hover {
  opacity: 0.7;
}

.item-action__button:active {
  opacity: 0.3;
}

.item-action__icon {
  width: 25px;
  height: 25px;
}
</style>