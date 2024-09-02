<template>
  <button 
    class="multi__button"
    :class="{
      'invisible': !props.isVisible
    }"
  >
    <div class="multi__button-box">
      <slot name="icon"> <img class="multi__button-icon" :src="icon" alt="иконка" /></slot>
    </div>
  </button>
</template>

<script setup>

// Объявляем пропс для получения иконки
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: false,
    default: true
  }
});
</script>

<style scoped>
.multi__button {
  max-width: 40px;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--milk);
  transition: 0.3s;

  padding: 0;
  border: 0;
  cursor: pointer;
}

.multi__button.invisible {
  visibility: hidden
}

.multi__button-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.multi__button:hover {
  background-color: var(--white);
}

.multi__button-icon {
  opacity: 0.6;
  width: 25px;
  height: 25px;
}
</style>
