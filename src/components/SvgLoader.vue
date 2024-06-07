<!-- Компонент предназначен для встраивания svg в html для последующего управления иконкой -->
<template>
  <div :class="iconClass" v-html="iconContent" :style="{ width, height }"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// относительный путь до иконки, ширина, высота, класс для иконки
const props = defineProps({
  path: {
    type: String,
    required: true
  },
  width: {
    type: String,
    required: false,
    default: '24px'
  },
  height: {
    type: String,
    required: false,
    default: '24px'
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
    // Корректировка пути для использования относительных путей и алиасов
    let svgPath;
    if (props.path.startsWith('@/')) {
      svgPath = new URL(props.path.replace('@/', '/src/'), import.meta.url).href;
    } else {
      svgPath = new URL(props.path, import.meta.url).href;
    }
    // Получаем svg
    const response = await fetch(svgPath);
    if (response.ok) {
      // Преобразуем svg
      const svgContent = await response.text();
      // Если путь корректный и содержит с <svg, добавляем контент к иконке
      if (svgContent.includes('<svg')) {
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
}
</style>