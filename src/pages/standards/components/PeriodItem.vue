<template>
  <div class="period">
    <div class="period__header">
      <p class="period__text">
        <span class="period__highlight">
          {{ props.date }}
        </span>
      </p>
    </div>

    <div class="period__body">
      <p class="period__text">
        Начало: {{ props.startTime }}
      </p>
      <p class="period__text">
        Конец: {{ props.endTime }}
      </p>
      <p class="period__text">
        Наличие отчёта: {{ props.isReportExist ? 'Есть' : 'Отсутствует' }}
      </p>
      <p
        v-if="props.isReportExist"
        class="period__text"
      >
        Текст отчёта: {{ props.reportText }}
      </p>
    </div>

    <div class="period__footer">
      <ButtonIcon
        class="button-icon"
        @click="handleEditButtonClick"
      >
        <template #icon>
          <EditIcon
            class="button-icon__icon"
          />
        </template>
      </ButtonIcon>

      <ButtonIcon
        class="button-icon"
        @click="handleDeleteButtonClick"
      >
        <template #icon>
          <DeleteIcon
            class="button-icon__icon button-icon__icon--delete"
          />
        </template>
      </ButtonIcon>
    </div>
  </div>
</template>

<script setup>
import ButtonIcon from '@/components/ButtonIcon.vue';

import EditIcon from '@/assets/icons/edit.svg?component';
import DeleteIcon from '@/assets/icons/delete.svg?component';

const props = defineProps({
  // Время для отображения в шапке
  date: {
    type: String,
    required: true
  },
  // Начало периода
  startTime: {
    type: String,
    required: true
  },
  // Конец периода
  endTime: {
    type: String,
    required: true
  },
  // Существует ли отчёт
  isReportExist: {
    type: Boolean,
    required: true,
  },
  // Текст отчёта
  reportText: {
    type: String,
    required: false
  }
});

const emit = defineEmits(['editClick', 'deleteClick']);

/**
 * Обработка клика по кнопке редактирования
 */
function handleEditButtonClick() {
  emit('editClick');
}

/**
 * Обработка клика по кнопке удаления
 */
function handleDeleteButtonClick() {
  emit('deleteClick');
}
</script>

<style scoped>
.period {
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  background: #fff;
  padding: 10px 30px 15px;
  border-radius: 10px;
}

.period__highlight {
  font-weight: bold;
}

.period__header {
  text-align: center;
}

.period__footer {
  display: flex;
  column-gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
.button-icon:hover {
  opacity: 0.7;
}

.button-icon:active {
  opacity: 0.3;
}

.button-icon__icon--delete {
  transform: scale(1.75);
}
</style>