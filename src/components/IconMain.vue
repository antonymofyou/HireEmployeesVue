<template>
  <div :class="iconClass" v-html="iconContent"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// относительный путь до иконки, класс для иконки
const props = defineProps({
  path: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: false,
    default: ''
  }
});

// Итоговый класс иконки
const iconClass = ref(`icon ${props.class}`);
// Контент иконки
const iconContent = ref('');

// Выполняем запрос для получения иконки
onMounted(async () => {
  try {
    // Корректировка пути для использования относительных путей
    const svgPath = new URL(props.path, import.meta.url).href;
    // Получаем svg
    const response = await fetch(svgPath);
    if (response.ok) {
      // Преобразуем svg
      const svgContent = await response.text();
      // Если путь корректный и начинается с <svg, добавляем контент к иконке
      if (svgContent.startsWith('<svg')) {
        iconContent.value = svgContent;
      }
    }
  } catch (e) {  // если произошла ошибка, то контент иконки будет пустым
    iconContent.value = '';
  }
});
</script>
 
<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;

  width: 24px;
  height: 24px;
}
</style>