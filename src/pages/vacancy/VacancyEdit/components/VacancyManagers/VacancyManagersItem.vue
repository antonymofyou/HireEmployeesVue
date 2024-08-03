<template>
  <div>
    <div @click="handleManagerClick(manager)" class="manager-item__box">
      <ManagerAssigned :ManagerText="manager.name" class="manager-item__name" />
      <ButtonIcon
        class="manager-item__btn"
        v-if="indicators.isHandled && props.managerMod.managerId === manager.id"
        @click="handleManagerDeleteClick"
      >
        <template v-slot:icon>
          <IconDelete class="manager-item__icon" />
        </template>
      </ButtonIcon>
    </div>
  </div>
</template>

<script setup>
import ManagerAssigned from "@/components/ManagerAssigned.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import IconDelete from "@/assets/icons/close.svg?component";

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
//Отображение крестика для удаления
const handleManagerClick = (manager) => {
  props.indicators.isHandled === true &&
  props.managerMod.managerId !== manager.id
    ? (props.managerMod.managerId = manager.id)
    : (props.indicators.isHandled = !props.indicators.isHandled);
  props.managerMod.managerId = manager.id;
};

// Открытие попапа для удаления
const handleManagerDeleteClick = () => {
  props.indicators.isDelete = true;
};
</script>

<style scoped>
.manager-item__box {
  display: flex;
  user-select: none;
  padding: 7px 13px;
  border: 1px solid gray;
  border-radius: 20px;
  display: flex;
  transition: opacity 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  align-items: center;
  position: relative;
}
.manager-item__box:hover {
  background-color: #d3d3d3;
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
