<template>
  <Modal
      class="vacancy-edit__modal"
      :show="indicators.isAdd || indicators.isEdit"
      @click.self="
        indicators.isAdd = false;
        indicators.isEdit = false;
      "
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
        v-if="statusMod.action === 'update'"
        class="status-entity"
      >
        <span class="status-entity__title">Менеджеры:</span>

        <div class="status-entity__body">
          <template v-if="props.managersInList.length > 0">
            <ul class="managers-list">
              <li
                class="managers-list__item"
                v-for="manager in props.managersInList"
                :key="manager.id"
                @click="onManagerDelete(manager.id)"
              >
                {{ manager.name }}
              </li>
            </ul>
          </template>

          <span v-else class="status-entity__notifier">Менеджеры отсутствуют</span>
        </div>
        
        <div class="entity-actions">
          <span class="entity-actions__title">
            Добавить менеджера:
          </span>

          <div class="entity-actions__body">
            <SelectMain
              v-model="managerToAddId"
              :options="props.managersInSelect"
            />
  
            <ButtonMain
              :isDisabled="isAddManagerBtnDisabled"
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
import { computed, ref } from 'vue';

import Modal from '@/components/Modal.vue';
import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';
import SelectMain from '@/components/SelectMain.vue';

const props = defineProps({
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
});
const emit = defineEmits(['managerAdd', 'managerDelete']);

// ID менеджера, которого хотим добавить к статусу
const managerToAddId = ref(0);

// Задизейблена ли кнопка добавления менеджера
const isAddManagerBtnDisabled = computed(() => {
  return !managerToAddId.value;
});

/**
 * Обработчик клика по кнопке добавления менеджера
 */
const onManagerAdd = () => {
  emit('managerAdd', managerToAddId.value);
  managerToAddId.value = 0;
};

/**
 * Обработчик клика по менеджеру, его удаления
 * @param {Number} managerId - ID менеджера
 */
const onManagerDelete = (managerId) => {
  emit('managerDelete', managerId);
};
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

/* Список менеджеров */
.managers-list {
  display: flex;
  list-style-type: none;
  gap: 3px;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  max-width: 255px
}

.managers-list__item {
  word-break: break-all;
  padding: 5px 15px;
  border: 1px solid #000;
  border-radius: 24px;
  font-size: 14px;
  /* Иконка мусорки (trash-icon) в base64 */
  cursor: url("data:image/svg+xml,%3Csvg width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 16C7.26522 16 7.51957 15.8946 7.70711 15.7071C7.89464 15.5196 8 15.2652 8 15V9C8 8.73478 7.89464 8.48043 7.70711 8.29289C7.51957 8.10536 7.26522 8 7 8C6.73478 8 6.48043 8.10536 6.29289 8.29289C6.10536 8.48043 6 8.73478 6 9V15C6 15.2652 6.10536 15.5196 6.29289 15.7071C6.48043 15.8946 6.73478 16 7 16ZM17 4H13V3C13 2.20435 12.6839 1.44129 12.1213 0.87868C11.5587 0.316071 10.7956 0 10 0H8C7.20435 0 6.44129 0.316071 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H1C0.734784 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5C0 5.26522 0.105357 5.51957 0.292893 5.70711C0.48043 5.89464 0.734784 6 1 6H2V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V6H17C17.2652 6 17.5196 5.89464 17.7071 5.70711C17.8946 5.51957 18 5.26522 18 5C18 4.73478 17.8946 4.48043 17.7071 4.29289C17.5196 4.10536 17.2652 4 17 4ZM7 3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H10C10.2652 2 10.5196 2.10536 10.7071 2.29289C10.8946 2.48043 11 2.73478 11 3V4H7V3ZM14 17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H5C4.73478 18 4.48043 17.8946 4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17V6H14V17ZM11 16C11.2652 16 11.5196 15.8946 11.7071 15.7071C11.8946 15.5196 12 15.2652 12 15V9C12 8.73478 11.8946 8.48043 11.7071 8.29289C11.5196 8.10536 11.2652 8 11 8C10.7348 8 10.4804 8.10536 10.2929 8.29289C10.1054 8.48043 10 8.73478 10 9V15C10 15.2652 10.1054 15.5196 10.2929 15.7071C10.4804 15.8946 10.7348 16 11 16Z' fill='%23D85B53'/%3E%3C/svg%3E%0A"), auto;
  transition: border-color 0.2s ease, color 0.1s ease;
}

.managers-list__item:hover {
  color: red;
  border-color: red;
}

.managers-list__item:active {
  opacity: 0.4;
}
</style>
