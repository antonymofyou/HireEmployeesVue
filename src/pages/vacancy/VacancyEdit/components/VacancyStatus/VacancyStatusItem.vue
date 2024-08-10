<template>
  <div class="statuslist__list-items">
    <div
        class="statuslist__list-status"
        :ref="`status-${status.statusName}`"
        @click="toggleStatus(status, 'handlers')"
    >
    <div class="status-item__arrows">
      <button @click.stop="moveStatus('up')" :disabled="isFirst" class="arrow top" :class="{ 'disabled-class': isFirst }">
      </button>
      <button @click.stop="moveStatus('down')" :disabled="isLast" class="arrow bottom" :class="{ 'disabled-class': isLast }">
      </button>
    </div>
      <div class="status-container" :style="{ backgroundColor: status.statusColor }">
        <StatusColored
            :statusText="status.statusName"
            :statusColor="status.statusColor"
            class="status-colored-full-width"
        />
        <ButtonIcon
            class="statuslist__list-btn"
            @click="editStatus(status)"
        >
          <template v-slot:icon
          ><IconEdit
              :class="getIconClass(status, 'edit')"
          /></template>
        </ButtonIcon>
        <ButtonIcon
            class="statuslist__list-btn"
            @click="handleModification(status.statusName, 'delete')"
        >
          <template v-slot:icon
          ><IconDelete
              :class="getIconClass(status, 'delete')"
          /></template>
        </ButtonIcon>
        <div
            class="statuslist__list-comment-tooltip"
        >
          {{ status.statusComment || 'Нет комментария' }}
        </div>
      </div>
    </div>
    <div v-if="statusList.transferStatuses[status.statusName].length">
      <IconArrowSharp class="statuslist__list-arrow" />
    </div>
    <div
        v-if="statusList.transferStatuses[status.statusName].length"
        class="statuslist__list-transfers"
        :ref="`transfers-${status.statusName}`"
    >
      <div
          class="statuslist__list-transfers-box"
          v-for="transfer in statusList.transferStatuses[status.statusName]"
          :key="transfer"
      >
        <div
            class="statuslist__list-transfers-item"
            :style="{
                backgroundColor: statusList.statuses.find(
                  (s) => s.statusName === transfer
                ).statusColor,
              }"
            @click="() => { toggleStatus(status, 'transfer'); setActiveTransfer(status.statusName, transfer); }"
        >
          <StatusColored
              :statusText="transfer"
              :statusColor="statusList.statuses.find((s) => s.statusName === transfer).statusColor"
              class="status-colored-full-width"
          />
          <ButtonIcon
              v-if="statusMod.activeTransfer === transfer && statusMod.name === status.statusName"
              class="statuslist__list-btn"
              @click="
                  handleModification(
                    status.statusName,
                    'delete',
                    true,
                    transfer
                  )
                "
          >
            <template v-slot:icon
            ><IconDelete
                :class="getIconClass(status, 'transfer')"
            /></template>
          </ButtonIcon>
        </div>
      </div>
    </div>
    <ButtonIcon
        class="statuslist__list-btn"
        @click="
           handleStatusClick(status)
          "
    >
      <template v-slot:icon
      ><IconAdd class="statuslist__list-icon"
      /></template>
    </ButtonIcon>
    <SelectMain
        v-if="indicators.isTransfer && statusMod.name === status.statusName"
        class="statuslist__list-select"
        v-model="statusMod.toName"
        :options="
            statusList.statusesSelect.filter(
              (el) =>
                el.id !== status.statusName &&
                statusList.transferStatuses[status.statusName].indexOf(
                  el.id
                ) === -1
            )
          "
        @update:model-value="
            handleModification(status.statusName, 'create', true)
          "
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import StatusColored from '@/components/StatusColored.vue';
import IconEdit from '@/assets/icons/edit.svg?component';
import IconDelete from '@/assets/icons/close.svg?component';
import IconArrowSharp from '@/assets/icons/arrow-sharp.svg?component';
import IconAdd from '@/assets/icons/add.svg?component';
import SelectMain from '@/components/SelectMain.vue';

const props = defineProps({
  // Статус
  status:{
    type: Object,
    required: true
  },
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
  // Функция для обновления статусов
  requestSortVacancyStatus: {
    type: Function,
    required: true,
  },
  // Id вакансии
  vacancyId: {
    type: String,
    required: true,
  },
});

const statusRefs = ref({});
const transferRefs = ref({});

const editStatus = (status) => {
  props.indicators.isEdit = true;
  Object.assign(props.statusMod, {
    action: 'update',
    name: status.statusName,
    comment: status.statusComment,
    color: status.statusColor
  });
};
// Функция для получения класса иконки
const getIconClass = (status, type) => {
  const isActive = type === 'transfer'
      ? props.indicators.activeTransfer
      : props.indicators.activeHandlers;

  return {
    'statuslist__list-icon-edit': type === 'edit',
    'statuslist__list-icon-delete': type === 'delete',
    'statuslist__list-icon-transfer': type === 'transfer',
    'active': isActive && props.statusMod.name === status.statusName,
  };
};
// Универсальная функция переключения статусов
const toggleStatus = (status, type) => {
  if (type === 'handlers') {
    props.indicators.activeHandlers = !props.indicators.activeHandlers || props.statusMod.name !== status.statusName;
    if (props.indicators.activeHandlers) {
      props.indicators.activeTransfer = false;
    }
  } else if (type === 'transfer') {
    props.indicators.activeTransfer = !props.indicators.activeTransfer || props.statusMod.name !== status.statusName;
    if (props.indicators.activeTransfer) {
      props.indicators.activeHandlers = false;
    }
  }
  props.statusMod.name = status.statusName;
  updateRefs();
  document.addEventListener('click', handleOutsideClick);
};
// Обрабатывает клики вне области статусов и трансферов.
const handleOutsideClick = (event) => {
  const isClickOutside = (element) => element && !element.contains(event.target);

  const allStatusClickedOutside = Object.values(statusRefs.value).every(isClickOutside);
  const allTransferClickedOutside = Object.values(transferRefs.value).every(isClickOutside);

  if (allStatusClickedOutside && allTransferClickedOutside) {
    props.indicators.activeHandlers = false;
    props.indicators.activeTransfer = false;
    props.statusMod.activeTransfer = '';
    document.removeEventListener('click', handleOutsideClick);
  }
};
// Обрабатывает клики по статусу, переключая отображение трансферов.
const handleStatusClick = (status) => {
  if (props.indicators.isTransfer && props.statusMod.name !== status.statusName) {
    props.statusMod.name = status.statusName;
  } else {
    props.indicators.isTransfer = !props.indicators.isTransfer;
    props.statusMod.name = status.statusName;
    props.statusMod.activeTransfer = '';
    updateRefs();
    document.addEventListener('click', handleOutsideClick);
  }
};

const isLast = computed(() =>{
  return props.statusList.statuses[props.statusList.statuses.length - 1].statusName === props.status.statusName
})

const isFirst = computed(() =>{
  return props.statusList.statuses[0].statusName === props.status.statusName
})

const moveStatus = (direction) =>{
  const movement = direction === "up" ? -1 : 1

  props.requestSortVacancyStatus(props.vacancyId, props.status.statusName, movement);
}
// Устанавливает активный трансфер для указанного статуса.
const setActiveTransfer = (statusName, transfer) => {
  props.statusMod.name = statusName;
  props.statusMod.activeTransfer = transfer;
};
// Обновляет ссылки на элементы статусов и трансферов в DOM.
const updateRefs = () => {
  statusRefs.value = Object.fromEntries(
      Array.from(document.querySelectorAll('.statuslist__list-status'))
          .map(el => [el.querySelector('.status-container').innerText.trim(), el])
  );

  transferRefs.value = Object.fromEntries(
      Array.from(document.querySelectorAll('.statuslist__list-transfers'))
          .map(el => [el.parentElement.querySelector('.status-container').innerText.trim(), el])
  );
};

onMounted(() => {
  updateRefs();
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>

.statuslist__list-arrow {
  height: fit-content;
  display: flex;
  fill: black;
  width: 25px;
  height: 25px;
}

.statuslist__list-items {
  display: flex;
  gap: 10px;
  align-items: center;
  user-select: none;
}

.statuslist__list-status {
  display: flex;
  cursor: pointer;
}

.arrow{
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  opacity: 0.5;
}
.disabled-class{
  display: none;
}
.top{
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}
.bottom{
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.top:hover{
  opacity: 1;
  cursor: pointer;
}
.bottom:hover{
  opacity: 1;
  cursor: pointer;
}
.status-item__arrows{
  display: flex;
  flex-direction: column;
  margin: 6px 10px;
}
.statuslist__list-transfers {
  display: flex;
  gap: 5px;
  cursor: pointer;
}

.statuslist__list-transfers-box {
  display: flex;
  align-items: end;

  &::after {
    content: ',';
  }

  &:last-child::after {
    content: '';
  }
}

.statuslist__list-transfers-item {
  display: flex;
  padding: 5px;
  border-radius: 10px;
  color: white;
  padding: 7px 14px;
}

.statuslist__list-comment-tooltip {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  margin: 0;
  margin-top: 0px;
  margin-left: 30px;
  max-width: 200px;
  max-height: 100px;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  background-color: var(--cornflower-blue);
  color: var(--white);
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
}

.status-container:hover .statuslist__list-comment-tooltip {
  visibility: visible;
}

.status-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 25px;
  color: white;
  border-radius: 10px;
  padding: 5px 12px;
}

.statuslist__list-btn {
  display: flex;
  padding: 0;
  width: fit-content;
}

.statuslist__list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;

  &:hover {
    transform: scale(1.3);
  }
}

.statuslist__list-select {
  font-size: 13px;
  height: 20px;
}

.statuslist__list-icon-edit,
.statuslist__list-icon-delete,
.statuslist__list-icon-transfer {
  display: none;
  position: relative;
  margin: 0;
  margin-top: -15px;
  height: 12px;
  width: 12px;
  fill: white;

  &.active {
    display: block;
  }
}

.statuslist__list-icon-edit {
  margin-left: 5px;
}

.status-colored-full-width{
  padding: 0;
}
</style>