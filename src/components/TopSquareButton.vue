<template>
  <button class="multi__button">
    <div class="multi__button-box">
      <slot name="icon">
        <img class="multi__button-icon" :src="icon" alt="иконка"
      /></slot>
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
});
</script>

<style scoped>
.multi__button {
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 40px;
  height: 40px;
  padding: 0;

  background-color: var(--milk);
  border: 0;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgb(0 0 0 / 30%);

  transition: 0.3s;
}

.multi__button-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.multi__button:hover {
  background-color: var(--white);
}

.multi__button-icon {
  width: 25px;
  height: 25px;
  opacity: 0.6;
}
</style>
