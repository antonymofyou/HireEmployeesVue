<template>
  <Modal
    class="vacancy-edit__modal"
    :show="props.show"
    @click.self="resetAddAndSetIndicators"
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

      <div
        class="status-entity"
      >
        <span class="status-entity__title">Менеджеры статуса:</span>

        <div
          ref="listNode"
          class="status-entity__body"
        >
          <div v-if="isRequestingNow" class="status-entity__spinner-wrapper">
            <SpinnerMain width="30" />
          </div>

          <template v-else>
            <VacancyStatusManagersList
              v-if="props.managersInList.length > 0"
              :managers="props.managersInList"
              :managerMod="props.managerMod"
              :indicators="props.indicators"
            />

            <span v-else class="status-entity__notifier">Менеджеры статуса отсутствуют</span>
          </template>
        </div>
        
        <div class="entity-actions">
          <span class="entity-actions__title">
            Добавить менеджера:
          </span>

          <div class="entity-actions__body">
            <SelectMain
              v-model="managerAddId"
              :options="props.managersInSelect"
            />
  
            <ButtonMain
              :isDisabled="isAddManagerBtnDisabled"
              :isActive="props.isAddingManagerRequestNow"
              @click="onManagerAdd"
            >
              <template v-slot:text>
                Добавить
              </template>
            </ButtonMain>
          </div>
        </div>
      </div>

      <ButtonMain
          class="vacancy-edit__modal-btn-add"
          @click="
            indicators.isAdd
              ? handleModification(statusMod.name, 'create')
              : handleModification(statusMod.name, 'update')
          "
          :isActive="request"
          :message="errorMessage"
      >
        <template v-slot:text>{{
            indicators.isAdd ? 'Добавить' : 'Изменить'
          }}</template>
      </ButtonMain>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import Modal from '@/components/Modal.vue';
import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';
import SelectMain from '@/components/SelectMain.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';

import VacancyStatusManagersList from './VacancyStatusManagersList.vue';

import useResizer from '../../js/composables/useResizer';

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
  // Идёт ли сейчас добавление менеджера
  isAddingManagerRequestNow: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDeletingManagerRequestNow: {
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
const emit = defineEmits(['managerAdd', 'managerDelete']);

// ID выбранного на добавление менеджера
const managerAddId = ref('');

// Идёт ли сейчас запрос
const isRequestingNow = computed(() => {
  return props.isAddingManagerRequestNow || props.isDeletingManagerRequestNow;
});

// Задизейблена ли кнопка добавления менеджера
const isAddManagerBtnDisabled = computed(() => {
  return !managerAddId.value;
});

// Будем сбрасывать выбранного менеджера по истечению загрузки на удаление / добавление
watch(() => props.isDeletingManagerRequestNow, () => {
  if (props.isDeletingManagerRequestNow || props.isAddingManagerRequestNow) return;
  managerAddId.value = 0;
});

/**
 * Обработчик клика по кнопке добавления менеджера
 */
const onManagerAdd = () => {
  emit('managerAdd', managerAddId.value);
  managerAddId.value = '';
};

/**
 * Сброс индикаторов на добавление и редактирование
 */
const resetAddAndSetIndicators = () => {
  props.indicators.isAdd = false;
  props.indicators.isEdit = false;
};

// Реф на дом-ноду списка менеджеров
const listNode = ref(null);
// Настройки списка менеджеров
const options = ref({
  initMinWidth: 250,
  initMinHeight: 25,
  items: computed(() => props.managersInList),
});

// Используем в css для динамической привязки min-width и min-height
const { bindMinWidth, bindMinHeight } = useResizer(listNode, options);
</script>

<style scoped>

.vacancy-edit__modal-btn-add {
  display: flex;
  align-items: center;
  align-self: center;
  width: fit-content;
  gap: 5px;
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

.status-entity__notifier {
  text-decoration: underline;
  font-size: 13px;
  color: gray;
}

.status-entity__body {
  min-width: v-bind(bindMinWidth);
  min-height: v-bind(bindMinHeight);
  display: flex;
  flex-direction: column;
}

.status-entity__spinner-wrapper {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}

.entity-actions {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--cornflower-blue);
  display: flex;
  flex-direction: column;
}

.entity-actions__title {
  margin-bottom: 10px;
}

.entity-actions__body {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
</style>
