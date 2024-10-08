<template>
  <Modal
    :show="props.show"
    @click.self="handleModalBackClick"
    class="vacancy-edit__modal"
  >
    <template v-slot:header>
      <div class="vacancy-edit__modal__title">
        {{ indicators.isAdd ? 'Добавление статуса' : 'Изменение статуса' }}
      </div>
    </template>

    <template v-slot:body>
      <InputSimple
          v-if="indicators.isAdd"
          v-model="statusMod.name"
          id="statusEdit"
          inputType="input"
          placeholder="Название статуса"
      />

      <InputSimple
          v-model="statusMod.comment"
          id="statusEdit"
          inputType="textarea"
          placeholder="Комментарий"
      />

      <div
          v-if="statusMod.action !== 'delete'"
          class="vacancy-edit__modal-select"
      >
        <div>Цвет:</div>
        <select
            v-model="statusMod.color"
            class="vacancy-edit__modal-select-color"
            :style="{ backgroundColor: statusMod.color }"
        >
          <option
              v-for="color in colors"
              :key="color.value"
              :value="color.value"
              :style="{ backgroundColor: color.value }"
          >
            {{ color.value }}
          </option>
        </select>
      </div>

      <ButtonMain
        :isActive="request"
        :message="errorMessage"
        class="vacancy-edit__modal-btn-add"
        @click="handleMainActionButtonClick"
      >
        <template #text>
          {{ mainActionButtonText }}
        </template>
      </ButtonMain>

      <div
        v-if="statusMod.action === 'update'"
        class="status-entity"
      >
        <span class="status-entity__title">
          Менеджеры статуса: {{ props.managersInList.length || '' }}
        </span>

        <div
          ref="listNode"
          class="status-entity__body"
        >
          <div
            class="status-entity__spinner-wrapper"
            :class="{
              'by-visible-toggler': true,
              'visible': props.isLoading
            }"
          >
            <SpinnerMain width="30" />
          </div>

          <div
            :class="{
              'by-visible-toggler': true,
              'visible': !props.isLoading
            }"
            class="status-entity__list-wrapper"
          >
            <VacancyManagersList
              :managerList="props.managersInList"
              :managerMod="props.managerMod"
              :indicators="props.indicators"
              :isShowTitle="false"
              @clickManager="setHandledManager"
              @clickAdd="startProcessManagerAdd"
              @clickDelete="startProcessManagerDelete"
              @resetHandled="resetIsHandled"
            />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import Modal from '@/components/Modal.vue';
import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';

import VacancyManagersList from '../VacancyManagers/VacancyManagersList.vue';

const props = defineProps({
  // Открыта ли модалка
  show: {
    type: Boolean,
    required: true,
  },
  // Создаваемый/изменяемый статус
  statusMod: {
    type: Object,
    required: true
  },
  // Индикаторы
  indicators: {
    type: Object,
    required: true
  },
  // Цвета
  colors: {
    type: Array,
    required: true
  },
  // Обработчик изменения статуса
  handleModification: {
    type: Function,
    required: true
  },
  // Сообщение об ошибке
  errorMessage: {
    type: String,
    default: ''
  },
  // Флаг запроса
  request: {
    type: Boolean,
    default: false
  },
  // Менеджеры (для списка)
  managersInList: {
    type: Array,
    required: false,
    default: [],
  },
  // Менеджеры (для селекта)
  managersInSelect: {
    type: Array,
    required: false,
    default: [],
  },
  // Состояние загрузки
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Информация об изменяемом менеджере
  managerMod: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'close',
  'startManagerAdd',
  'startManagerDelete',
  'resetHandled',
  'startManagerModify',
  'toggleHandledIndicator',
]);

// ID выбранного на добавление менеджера
const managerAddId = ref('');

// Текст в главной кнопке
const mainActionButtonText = computed(() => {
  return props.indicators.isAdd ? 'Добавить' : 'Изменить';
});

/**
 * Обработка клика по главной кнопке действия в модалке
 */
const handleMainActionButtonClick = () => {
  if (props.indicators.isAdd)
    props.handleModification(props.statusMod.name, 'create')
  else  
    props.handleModification(props.statusMod.name, 'update')
};

/**
 * Обработка клика по заднику модалки
 */
const handleModalBackClick = () => {
  emit('close');
};

/**
 * Установка менеджера, которым манипулируем в данный момент
 * @param {Number} managerId - ID менеджера, на которого кликнули
 */
const setHandledManager = (managerId) => {
  // Если манипулируем менеджером и текущий модифицируемый не равен тому, что в компоненте
  if (!props.indicators.isHandled || props.managerMod.managerId === managerId)
    emit('toggleHandledIndicator')

  emit('startManagerModify', managerId);
};

/**
 * Обработка добавления менеджера
 */
const startProcessManagerAdd = () => {
  emit('startManagerAdd');
};

/**
 * Обработка удаления менеджера
 */
const startProcessManagerDelete = () => {
  emit('startManagerDelete');
};

/**
 * Сброс индикатора обработки
 */
const resetIsHandled = () => {
  emit('resetHandled');
};

// Будем сбрасывать выбранного менеджера по истечению загрузки на удаление / добавление
watch(() => props.isDeletingManagerRequestNow, () => {
  if (props.isDeletingManagerRequestNow || props.isAddingManagerRequestNow)
    return;

  managerAddId.value = 0;
});
</script>

<style scoped>
.vacancy-edit__modal-btn-add {
  align-self: center;
  margin: 10px 0;
}

.vacancy-edit__modal-select {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.vacancy-edit__modal-select-color {
  -webkit-appearance: none;
  appearance: none;
  width: 90px;
  height: 20px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
}

/* Отдельная сущность статуса */
.status-entity__title {
  margin-bottom: 15px;
  display: block;
}

.status-entity__list-wrapper {
  max-width: 300px;
}

/* Обёртка спиннера */
.status-entity__spinner-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Переключатели прозрачности */
.by-visible-toggler {
  opacity: 0;
  pointer-events: none;
}

.visible {
  opacity: 1;
  pointer-events: all;
}

/* Контейнер с кнопкой */
.action-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
}
</style>
