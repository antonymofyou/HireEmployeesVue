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
      <div
        v-click-outside="resetCurrentModManager"
        class="modal-body"
      >
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
                'visible': isRequestingNow
              }"
            >
              <SpinnerMain width="30" />
            </div>

            <div
              :class="{
                'by-visible-toggler': true,
                'visible': !isRequestingNow
              }"
            >
              <VacancyStatusManagersList
                v-if="props.managersInList.length > 0"
                :managers="props.managersInList"
                :managerMod="props.managerMod"
                :indicators="props.indicators"
                :renderAddBtn="isAdmin() && props.managersInSelect.length > 0"
                :fillItOnRender="setOfDomNodesStatusManagers"
                @addNewManager="showModalAddManager"
              />
    
              <span v-else class="status-entity__notifier">
                Менеджеры статуса отсутствуют
              </span>

              <div class="action-wrapper">
                <VacancyStatusAddManagerBtn
                  v-if="props.managersInList.length === 0"
                  @click="showModalAddManager"
                />
              </div>
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

import VacancyStatusManagersList from './VacancyStatusManagersList.vue';
import VacancyStatusAddManagerBtn from './VacancyStatusAddManagerBtn.vue';

import { isAdmin } from '@/js/AuthFunctions';

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
  // Идёт ли сейчас добавление менеджера
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

// ID выбранного на добавление менеджера
const managerAddId = ref('');

// Множество с дом-нодами менеджеров статуса
const setOfDomNodesStatusManagers = ref(new Set());

// Идёт ли сейчас запрос
const isRequestingNow = computed(() => {
  return props.isAddingManagerRequestNow || props.isDeletingManagerRequestNow;
});

// Будем сбрасывать выбранного менеджера по истечению загрузки на удаление / добавление
watch(() => props.isDeletingManagerRequestNow, () => {
  if (props.isDeletingManagerRequestNow || props.isAddingManagerRequestNow) return;
  managerAddId.value = 0;
});

/**
 * Сброс индикаторов на добавление и редактирование
 */
const resetAddAndSetIndicators = () => {
  props.indicators.isAdd = false;
  props.indicators.isEdit = false;
};

/**
 * Показать модалку с выбором менеджера
 */
const showModalAddManager = () => {
  props.indicators.isManagerAdd = true;
};

/**
 * Сбросить текущего модифицируемого менеджера
 */
const resetCurrentModManager = () => {
  props.managerMod.managerId = '';
};

// Директива, позволяющая выполнить функцию по клику вне дом-ноды
const vClickOutside = {
  mounted(el, binding) {
    el.clickListener = (e) => {
      // Достаём дом-ноду по координатам клика
      const domNode = document.elementFromPoint(e.clientX, e.clientY);
      // Флаг - кликнули ли мы внутри этой ноды
      let isClickedInsideDomNode = false;

      for (const statusDomNode of setOfDomNodesStatusManagers.value) {
        if (statusDomNode?.contains(domNode)) isClickedInsideDomNode = true;
      }

      // Кликнули внутри - ничего не делаем
      if (isClickedInsideDomNode) return;

      // Т.к. работает с дом-нодами - ставим в очередь, чтобы все остальные, кто полагается на изменяемые значение - успешно завершились
      requestIdleCallback(() =>  binding.value?.());
    };

    window.addEventListener('click', el.clickListener, { capture: true });
  },

  unmounted(el) {
    window.removeEventListener('click', el.clickListener, { capture: true });
  },
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

.status-entity__body {
  display: flex;
  flex-direction: column;
  position: relative;
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

/* Тело модалки */
.modal-body {
  display: contents;
}
</style>
