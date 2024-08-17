<template>
  <div ref="domNodeStatusManager">
    <div
      @click="handleManagerClick"
      class="manager-item__box"
    >
      <ManagerAssigned
        :managerName="manager.name"
        class="manager-item__name"
      />

      <ButtonIcon
        v-if="props.isRenderDeleteButton"
        @click="handleManagerDeleteClick"
        class="manager-item__btn"
      >
        <template v-slot:icon>
          <IconDelete class="manager-item__btn-icon" />
        </template>
      </ButtonIcon>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import ManagerAssigned from "@/components/ManagerAssigned.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import IconDelete from "@/assets/icons/close.svg?component";

const props = defineProps({
  // Менеджер
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
  // Рендерить ли кнопку удаления
  isRenderDeleteButton: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['clickManager', 'clickDelete']);

// Обработка клика по менеджеру
const handleManagerClick = () => {
  emit('clickManager', props.manager.id);
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

.manager-item__btn {
  height: 12px;
  width: 12px;
  display: block;
  position: absolute;
  top: 2px;
  right: 4px;
  padding: 0 0 0 1px;
}

.manager-item__btn-icon {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
