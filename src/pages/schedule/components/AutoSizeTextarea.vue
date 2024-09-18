<template>
  <textarea
    v-model="model"
    ref="textareaRef"
    class="textarea"
  ></textarea>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';

const model = defineModel({ default: '' });

// Реф на ноду инпута
const textareaRef = ref(null);

// Изначальная высота ноды инпута
const initialHeight = ref(null);

// Синхронизируем высоту под содержимое инпута
watchEffect(() => {
  if (!textareaRef.value || !model.value) return;
  autoSizeInput();
});

// Ставим изначальную высоту
onMounted(() => {
  if (!textareaRef.value) return;
  initialHeight.value = textareaRef.value.clientHeight;
});

/**
 * Сделать высоту инпута под его содержимое
 */
function autoSizeInput() {
  window.requestAnimationFrame(() => {
    textareaRef.value.style.height = initialHeight.value + 'px';
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
  });
};
</script>

<style scoped>
.textarea {
  resize: none;
  overflow: hidden;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  outline: 2px solid var(--cornflower-blue);
  border: none;
  font-size: 16px;
}

.textarea:focus {
  outline: 3px solid var(--cornflower-blue);
}

.textarea:disabled {
  background: rgb(243, 243, 243);
}
</style>