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
        @click="
          !showCloseButtons[manager.id]
            ? showCloseButton(manager.id)
            : hideCloseButton(manager.id)
        "
      >
        {{ manager.name }}
        <ButtonIcon
          v-if="showCloseButtons[manager.id]"
          class="statuslist__list-btn"
          @click="requestManagersModification('delete', manager.id)"
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
  max-height: 35px;
  user-select: none;
  margin-top: 10px;
  padding: 7px;
  border: 1px solid gray;
  border-radius: 10px;
  align-items: center;
  display: flex;
  transition: opacity 0.3s ease;
  cursor: pointer;
}
.statuslist__list-btn {
  transition: opacity 0.3s ease;
}
</style>
