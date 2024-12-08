<template>
    <div v-click-outside="close" :class="{ 'active': isOpen, 'disabled': disabled }" class="dropdown">
        <ToolbarButton
            @pointerup="toggle"
            @keydown.enter.space="toggle"
            :aria-expanded="isOpen"
            class="dropdown__trigger"
        >
            <slot name="trigger"></slot>
        </ToolbarButton>
        <div class="dropdown__content">
            <slot name="content" :close="close"></slot>
        </div>
    </div>
</template>
  
<script setup>

import ToolbarButton from './ToolbarButton.vue';
import { ref } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  }
});

const isOpen = ref(false);

// Переключает dropdown
function toggle() {
  if (props.disabled) return;

  isOpen.value = !isOpen.value;
}

// Закрывает dropdown
function close() {
    isOpen.value = false;
}

// Директива для закрытия селекта по клику снаружи
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

</script>
  
<style scoped>
.dropdown {
    position: relative;
    transition: opacity .2s;
}

.dropdown.disabled {
  opacity: 0.5;
}

.dropdown__content {
    position: absolute;
    transition-property: opacity, visibility;
    transition-duration: 0.2s;
    visibility: hidden;
    opacity: 0;
    z-index: 10;
}

.dropdown.active > .dropdown__content {
    visibility: visible;
    opacity: 1;
}

.dropdown__trigger {
    position: relative;
    z-index: 1;
    border: 0;
    outline: 0;
}
</style>