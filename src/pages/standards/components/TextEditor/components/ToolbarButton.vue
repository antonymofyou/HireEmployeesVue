<template>
  <button 
      class="toolbar-button" 
      :disabled="props.disabled" 
      :class="activeClass"
  >
      <slot></slot>
  </button>
</template>

<script setup>

import { computed } from 'vue';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false,
    }
});

const activeClass = computed(() => {
    return {
        'toolbar-button--active': props.active,
    }
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
  background: var(--milk);
}

.toolbar-button--active {
  background: var(--milk);
}
</style>