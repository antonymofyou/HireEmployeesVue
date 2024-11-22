<template>
    <iframe
        ref="iframe"
        :src="srcIframe"
        :style="iframeStyles"
        class="iframe-content"
        sandbox="allow-popups allow-scripts"
    />
</template>
  
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import editorStyles from './TextEditor/css/editor-content.css?inline';
// Контент для html
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
const iframe = ref(null);
const srcIframe = ref('');
const heightIframe = ref(200);
const paddingIframe = ref(16);
const borderIframe = ref(1);
const iframeStyles = computed(() => {
  return {
    'height': heightIframe.value + (paddingIframe.value * 2) + (borderIframe.value * 2) + 'px',
  }
});
const updateIframeContent = () => {
  // Отмена предыдущего объекта URL, если он существует
  if (srcIframe.value) {
    URL.revokeObjectURL(srcIframe.value);
  }
  const cssVariables = `
      :root {
        --white: #FFFFFF;
        --silver: #C0C0C0;
        --dove-gray: #6D6D6D;
        --nobel: #B0B0B0;
        --periwinkle-opacity-04: rgba(204, 204, 255, 0.4);
        --periwinkle-opacity-06: rgba(204, 204, 255, 0.6);
      }
    `;
  const content = props.content.replace(/<code[^>]*>/g, '').replace(/<\/code>/g, '');
  // Оборачиваем контент в полноценный HTML-документ
  const fullContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
          <style>
            ${cssVariables}
            ${editorStyles}
            body { overflow: hidden; }
            .editor-content {
              font-family: 'Helvetica', sans-serif;
            }
          </style>
        </head>
        <body class='editor-content'>
          ${content}
          <script>
            const debounce = function (callback, delay) {
                let timer;
              
                return function (...args) {
                  clearTimeout(timer);
              
                  timer = setTimeout(() => {
                    callback.apply(this, args);
                  }, delay);
                };
            }
            const sendHeight = function () {
                let height = document.body.parentElement.offsetHeight;
                window.parent.postMessage(height, '*');  // отправляем высоту родительскому окну
            };
            const observer = new MutationObserver(debounce(sendHeight, 100));
            observer.observe(document.body, { childList: true, subtree: true });
  
            window.onload = () => {
              sendHeight();
  
              document.body.style.overflow = 'auto';
            };  // вызываем функцию при загрузке страницы
            window.onresize = sendHeight;  // вызываем функцию при изменении размера окна
          <\/script>
        </body>
      </html>
    `;
  // Создание нового Blob с типом 'text/html'
  const blob = new Blob([fullContent], { type: 'text/html' });
  // Создание объекта URL для Blob
  srcIframe.value = URL.createObjectURL(blob);
};
onMounted(() => {
  updateIframeContent();

  window.addEventListener('message', updateHeightIframe);

  paddingIframe.value = parseInt(window.getComputedStyle(iframe.value).padding) || paddingIframe.value;
  borderIframe.value = parseInt(window.getComputedStyle(iframe.value).borderWidth) || borderIframe.value;
});
function updateHeightIframe({ data }) {
  if (!data || isNaN(parseInt(data))) return;

  heightIframe.value = data;
}
watch(() => props.content, () => {
  updateIframeContent();
});
// Очистка объекта URL при уничтожении компонента
onBeforeUnmount(() => {
  if (srcIframe.value) {
    URL.revokeObjectURL(srcIframe.value);
  }

  window.addEventListener('message', updateHeightIframe);
});
</script>
  
<style scoped>
.iframe-content {
  width: 100%;
}
</style>