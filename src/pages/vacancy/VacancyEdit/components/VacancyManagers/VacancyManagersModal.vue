<template>
  <Modal
    :show="props.show"
    @click.self="handleModalBackClick"
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
      <div class="select-wrapper">
        <SelectMain
          v-if="indicators.isAdd || indicators.isManagerAdd"
          class="manager-edit__modal-select"
          v-model="formData.id"
          :options="managerList"
        />
      </div>

      <ButtonMain
        @click="actionFn"
        :isActive="request"
        :message="errorMessage.error"
        :isDisabled="isActionButtonDisabled"
        class="manager-edit__modal-btn-add"
      >
        <template v-slot:text>
          {{ actionBtnText }}
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
    type: String,
    required: false,
    default: '',
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

const emit = defineEmits(['close']);

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

// Текст в кнопке действия
const actionBtnText = computed(() => {
  if (props.indicators.isAdd || props.indicators.isManagerAdd) return 'Добавить';
  else if (props.indicators.isDelete) return 'Удалить';
});

// Задизейблена ли кнопка действия
const isActionButtonDisabled = computed(() => {
  // Если идёт процесс добавления, но так и не было ничего выбрано - то дизейблим
  if ((props.indicators.isAdd || props.indicators.isManagerAdd) && !props.formData.id)
    return true;

  return false;
});

// Действие по клику на кнопку
const actionFn = computed(() => {
  if (props.indicators.isAdd || props.indicators.isManagerAdd)
    return () => props.requestManagersModification('create', props.formData.id);
  else if (props.indicators.isDelete)
    return () => props.requestManagersModification('delete', props.managerMod.managerId)
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
 * Обработка клика по заднику модалки
 */
const handleModalBackClick = () => {
  emit('close');
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

.manager-edit__modal-select {
  align-items: center
}
</style>
