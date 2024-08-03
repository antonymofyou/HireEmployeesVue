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
          @drop="onDrop"
          @dragend="onDragEnd"
          @dragleave="onDragLeave"
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

const onDragStart = (index) => {
  dragIndex.value = index;
};

const onDragEnter = (index) => {
    dragOverIndex.value = index;
};

const onDragLeave = () => {
  dragOverIndex.value = null; 
}

const onDrop = () => {
  if (dragIndex.value !== dragOverIndex.value) {
    const draggedStatus = props.statusList.statuses.splice(dragIndex.value, 1)[0];
    props.statusList.statuses.splice(dragOverIndex.value, 0, draggedStatus);
  }
};

const onDragEnd = () => {
  if (dragIndex.value !== null && dragOverIndex.value !== null) {
    
    // Вычисляем направление (разница в индексах)
    const direction = dragOverIndex.value - dragIndex.value;
    const movedStatusName = props.statusList.statuses[dragOverIndex.value].statusName;

    // Если элемент переместился
    if (direction !== 0) {
      // Отправляем запрос на сервер для изменения порядка
      props.requestSortVacancyStatus(props.vacancyId, movedStatusName, direction);
    }
  }

  // Сбрасываем индексы
  dragIndex.value = null;
  dragOverIndex.value = null;
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
  outline: 2px dashed #000000;
  background-color: #ecf0f1;
}

.dragging {
  opacity: 0.5;
}

</style>