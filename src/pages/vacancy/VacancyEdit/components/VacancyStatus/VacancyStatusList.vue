<template>
  <div class="vacancy-edit__statuslist">
    <div>Статусы: {{ statusList.statuses.length || 'Статусы не заданы' }}</div>
    <div class="statuslist__list-box"
>
      <VacancyStatusItem
          v-for="(status, index) in statusList.statuses"
          :key="status.statusName"
          :status="status"
          :statusList="statusList"
          :indicators="indicators"
          :statusMod="statusMod"
          :handleModification="handleModification"
          :requestSortVacancyStatus="requestSortVacancyStatus"
          :vacancyId="vacancyId"
          :class="{'dragging': dragIndex === index, 'drag-over': dragOverIndex === index}"

          :draggable="true"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @dragenter="onDragEnter(index)"
          @dragend="onDragEnd"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';


import VacancyStatusItem from './VacancyStatusItem.vue'

const props = defineProps({
  // Массив статусов
  statusList: {
    type: [Array, Object, Array],
    required: true,
  },
  // Информация об изменяемом статусе
  statusMod: {
    type: Object,
    required: true,
  },
  // Индикаторы кнопок
  indicators: {
    type: Object,
    required: true,
  },
  // Обработчик изменения статуса
  handleModification: {
    type: Function,
    required: true,
  },
  // Айди вакансии
  vacancyId: {
    type: String,
    required: true,
  },
  // Перемещение статусов
  requestSortVacancyStatus: {
    type: Function,
    required: true,
  },
});

const dragIndex = ref(null);
const dragOverIndex = ref(null);

const dragIndexServer = ref(null);
const dragOverIndexServer = ref(null);

const onDragStart = (index) => {
  dragIndex.value = index;
  dragIndexServer.value = index;
};

const onDragEnter = (index) => {
  dragOverIndexServer.value = index
  // Проверяем, изменился ли индекс, и только тогда выполняем перемещение
  if (dragOverIndex.value !== index) {
    dragOverIndex.value = index;

    const draggedStatus = props.statusList.statuses[dragIndex.value];
    props.statusList.statuses.splice(dragIndex.value, 1);
    props.statusList.statuses.splice(dragOverIndex.value, 0, draggedStatus);
    
    dragIndex.value = dragOverIndex.value
  }
};

const onDragEnd = () => {
  if (dragIndexServer.value !== null && dragOverIndexServer.value !== null) {
    // Вычисляем направление (разница в индексах)
    const direction = dragOverIndexServer.value - dragIndexServer.value;
    const movedStatusName = props.statusList.statuses[dragOverIndexServer.value].statusName;
    // Если элемент переместился
    if (direction !== 0) {
      // Отправляем запрос на сервер для изменения порядка
      props.requestSortVacancyStatus(props.vacancyId, movedStatusName, direction);
    }
  }

  // Сбрасываем индексы
  dragIndex.value = null;
  dragOverIndex.value = null;

  // Сбрасываем индексы
  dragIndexServer.value = null;
  dragOverIndexServer.value = null;
};



</script>

<style scoped>
.vacancy-edit__statuslist {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.statuslist__list-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.drag-over {
  visibility: hidden;
}
.dragging {
  opacity: 0.5;
}
</style>