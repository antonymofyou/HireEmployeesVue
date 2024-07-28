<template>
  <div class="manager-list__box">
    <div>
      Менеджеры вакансии: {{ managerList.length || "менеджеры не заданы" }}
    </div>
    <div class="manager-list__item-box">
      <VacancyManagersItem
        v-for="manager in managerList"
        :key="manager.id"
        :manager
        :indicators
        :managerMod
      >
      </VacancyManagersItem>
    </div>
  </div>
</template>

<script setup>
import VacancyManagersItem from "./VacancyManagersItem.vue";
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
  managerMod: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.manager-list__box {
  margin-top: 40px;
  user-select: none;
}
.manager-list__item-box {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0;
}
</style>
