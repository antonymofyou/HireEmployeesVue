<template>
  <Modal
    :show="props.show"
    @click.self="resetIndicatorsAndErrors"
  >
    <template v-slot:header>
      <div>
        {{ modalTitle }}
      </div>
      <p v-if="indicators.isDelete">
        {{ managerName(managerMod.managerId) }}
      </p>
    </template>

    <template v-slot:body>
      <SelectMain
        v-if="indicators.isAdd"
        class="manager-edit__modal-select"
        v-model="formData.id"
        :options="managerList"
      />

      <ButtonMain
        class="manager-edit__modal-btn-add"
        @click="
          indicators.isAdd
            ? requestManagersModification('create', formData.id)
            : requestManagersModification('delete', managerMod.managerId)
        "
        :isActive="request"
        :message="errorMessage.error"
      >
        <template v-slot:text>
          {{ indicators.isAdd ? "Добавить" : "Удалить" }}
        </template>
      </ButtonMain>
    </template>
  </Modal>
</template>

<script setup>
import { computed } from "vue";

import Modal from "@/components/Modal.vue";
import ButtonMain from "@/components/ButtonMain.vue";
import SelectMain from "@/components/SelectMain.vue";

const props = defineProps({
  // Показывать ли модалку
  show: {
    type: Boolean,
    required: true,
  },
  // Заголовок модалки
  title: {
    type: String,
    required: false,
    default: null,
  },
  // Создаваемый/изменяемый статус
  managerMod: {
    type: Object,
    required: true,
  },
  // Индикаторы
  indicators: {
    type: Object,
    required: true,
  },
  // Массив менеджеров
  managerList: {
    type: Array,
    required: true,
  },
  managerListAssigned: {
    type: Array,
    required: true,
  },

  //Функция Добавления менеджера
  requestManagersModification: {
    type: Function,
    required: true,
  },
  // Сообщение об ошибке
  errorMessage: {
    type: [Object, String],
    required: false,
    default: {}
  },
  // Флаг запроса
  request: {
    type: Boolean,
    default: false,
  },
  //Данные с SelectMain
  formData: {
    type: Object,
    required: false,
  },
});

// Заголовок модалки
const modalTitle = computed(() => {
  // props.title имеет приоритет над иными вычисляемыми значениями
  if (props.title) return props.title;

  // Вычисляем заголовок исходя из индикаторов
  if (props.indicators.isAdd)
    return 'Добавить менеджера вакансии';
  else if (props.indicators.isDelete)
    return 'Удалить менеджера'
});

/**
 * Функция поиска имени менеджера по его ID
 * @param {Number} managerId - ID менеджера
 */
const managerName = (managerId) => {
  const manager = props.managerListAssigned?.find(
    (manager) => manager.id === managerId
  );
  return manager ? `${manager.name}?` : "";
};

/**
 * Сброс индикаторов и сообщения об ошибке
 */
const resetIndicatorsAndErrors = () => {
  props.indicators.isAdd = false;
  props.indicators.isDelete = false;
  props.errorMessage.error = '';
};
</script>

<style scoped>
* {
  user-select: none;
}

.manager-edit__modal-select {
  align-self: center;
}
.manager-edit__modal-btn-add {
  align-self: center;
  margin-top: 15px;
  align-items: center;
}
</style>
