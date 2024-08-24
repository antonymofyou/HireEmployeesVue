<template>
    <div v-click-outside="close" :class="{ 'active': isOpen }" class="dropdown">
        <button 
            @pointerup="toggle"
            @keydown.enter.space="toggle"
            :aria-expanded="isOpen"
            class="dropdown__trigger"
        >
            <slot name="trigger"></slot>
        </button>
        <div class="dropdown__content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
  
<script setup>

import { ref } from 'vue';

const isOpen = ref(false);

function toggle() {
   isOpen.value = !isOpen.value;
}

function close() {
    isOpen.value = false;
}

// Директива для закрытия селекта по клику снаружи
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      // Проверка местоположения элемента
      if (!(el === event.target || el.contains(event.target))) {
        // Вызываем метод после срабатывания клика снаружи
        binding.value(event);
      }
    };
    // Добавляем обработчик нажатия
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    // Удаляем обработчик при размонтировании
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

</script>
  
<style scoped>
.dropdown {
    position: relative;
}

.dropdown__content {
    position: absolute;
    transition-property: opacity, visibility;
    transition-duration: 0.2s;
    visibility: hidden;
    opacity: 0;
}

.dropdown.active .dropdown__content {
    visibility: visible;
    opacity: 1;
}

.dropdown__trigger {
    background-color: transparent;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    cursor: pointer;
}
</style>