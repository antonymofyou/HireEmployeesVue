<template>
  <div ref="domNodeStatusManager">
    <div
      @click="handleManagerClick"
      class="manager-item__box"
    >
      <ManagerAssigned :ManagerText="manager.name" class="manager-item__name" />
      <ButtonIcon
        v-if="indicators.isHandled && props.managerMod.managerId === manager.id && isAdmin()"
        @click="handleManagerDeleteClick"
        class="manager-item__btn"
      >
        <template v-slot:icon>
          <IconDelete class="manager-item__icon" />
        </template>
      </ButtonIcon>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import ManagerAssigned from "@/components/ManagerAssigned.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import IconDelete from "@/assets/icons/close.svg?component";
import { isAdmin } from '@/js/AuthFunctions'; 

const props = defineProps({
  // менеджер
  manager: {
    type: Object,
    required: true,
  },
  // Индикаторы кнопок
  indicators: {
    type: Object,
    required: true,
  },
  // Информация об изменяемом менеджере
  managerMod: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['clickDelete']);

// Дом-нода менеджера статуса
const domNodeStatusManager = ref(null);

// Получим через ref доступ к дом-ноде компонента
defineExpose({
  domNode: domNodeStatusManager
});

// Отображение крестика для удаления
const handleManagerClick = () => {
  // Если манипулируем менеджером и текущий модифицируемый не равен тому, что в компоненте
  if (props.indicators.isHandled && props.managerMod.managerId !== props.manager.id)
    // Меняем модифицируемого менеджера
    props.managerMod.managerId = props.manager.id;
  else
    props.indicators.isHandled = !props.indicators.isHandled;

  props.managerMod.managerId = props.manager.id;
};

/**
 * Обработчик клика по кнопке удаления
 */
const handleManagerDeleteClick = () => {
  emit('clickDelete');
};
</script>

<style scoped>
.manager-item__box {
  display: flex;
  user-select: none;
  display: flex;
  cursor: pointer;
  align-items: center;
  position: relative;
}
.manager-item__icon {
  height: 12px;
  width: 12px;
  display: block;
  position: absolute;
  top: 4px;
  right: 3px;
}
.manager-item__btn {
  padding: 0 0 0 1px;
}
</style>
