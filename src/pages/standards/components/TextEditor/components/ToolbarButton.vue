<template>
  <button @click="action" class="toolbar-button" :class="{ 'toolbar-button--active': isActive && isActive() }" :disabled="disabled && disabled()" v-show="isShow()">
    <component :is="icon" />
  </button>
</template>

<script setup>
// Иконка, действие по кнопке, активна ли кнопка, отключена ли кнопка
const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
  action: {
    type: Function,
    required: true,
  },
  isActive: {
    type: Function,
    required: false,
  },
  disabled: {
    type: Function,
    required: false,
  },
  isShow: {
    type: Function,
    required: false,
    default: () => true,
  },
});
</script>

<style scoped>
.toolbar-button {
  width: 32px;
  height: 32px;
  padding: 4px;
  background: none;
  border: none;
  color: var(--tundora);
  margin: 0;
  cursor: pointer;
  transition: all .15s ease-in-out;
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.toolbar-button:not([disabled]):hover {
  background: var(--light-gray);
  color: var(--shark);
}

.toolbar-button--active {
  background: var(--milk);
  color: var(--shark);
}
</style>