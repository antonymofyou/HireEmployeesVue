<template>
  <div class="manager-list__box">
    <div>
      Список Менеджеров: {{ managerList.length || "менеджеры не заданы" }}
    </div>
    <div class="manager-list__item-box">
      <div
        class="manager-list__item"
        v-for="manager in managerList"
        :key="manager.id"
        @mouseover="showCloseButton(manager.id)"
        @mouseout="hideCloseButton(manager.id)"
      >
        {{ manager.name }}
        <ButtonIcon
          class="statuslist__list-btn"
          @click="requestManagersModification('delete', manager.id)"
          :style="{
            opacity: showCloseButtons[manager.id] ? 1 : 0,
          }"
        >
          <template v-slot:icon>
            <IconDelete class="statuslist__list-icon-delete" />
          </template>
        </ButtonIcon>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonIcon from "@/components/ButtonIcon.vue";
import IconDelete from "@/assets/icons/close.svg?component";
import { ref } from "vue";
const props = defineProps({
  // Массив менеджеров
  managerList: {
    type: Array,
    required: true,
  },
  //Функция удаленния менеджера
  requestManagersModification: {
    type: Function,
    required: true,
  },
});
const showCloseButtons = ref({}); // Объект для хранения состояния кнопок

// Функция, которая устанавливает `showCloseButtons[managerId]` в `true`
// Это означает, что кнопка "Закрыть" для менеджера с `managerId` должна быть отображена
const showCloseButton = (managerId) => {
  showCloseButtons.value[managerId] = true;
};

// Функция, которая устанавливает `showCloseButtons[managerId]` в `false`
// Это означает, что кнопка "Закрыть" для менеджера с `managerId` должна быть скрыта
const hideCloseButton = (managerId) => {
  showCloseButtons.value[managerId] = false;
};
</script>

<style scoped>
.manager-list__box {
  margin-top: 40px;
}
.manager-list__item-box {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin: 10px 0;
}
.manager-list__item {
  margin-top: 10px;
  padding: 7px;
  border: 1px solid gray;
  border-radius: 10px;
  align-items: center;
  cursor: pointer;
  display: flex;
  transition: opacity 0.3s ease;
}
.statuslist__list-btn {
  transition: opacity 0.3s ease;
}
</style>
