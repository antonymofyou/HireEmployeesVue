<template>
  <v-stage :config="configKonva">
    <v-layer>
      <component
        v-for="shape in data.shapes"
        :key="shape.id"
        :config="transformConfigToKonvaCorrect(shape)"
        :is="shapeReducer(shape)"
        @pointerenter="handlers.pointerEnter"
        @dragstart="handlers.dragStart"
        @dragend="handlers.dragEnd"
        @pointerleave="handlers.pointerLeave"
      />
    </v-layer>
  </v-stage>
</template>

<script setup>
import { reactive, toValue, watchEffect } from 'vue';
import { data } from './mock';

const configKonva = {
  width: window.innerWidth,
  height: window.innerHeight
};

const handlers = {
  dragStart: () => {
    document.body.style.cursor = 'grabbing';
  },
  dragEnd: ({ target }) => {
    document.body.style.cursor = 'default';
    console.group('DragEnd');
    console.log('Coordinates after drag:');
    console.log(target.attrs);
    console.groupEnd('DragEnd');
  },
  pointerLeave: (event) => {
    document.body.style.cursor = 'default';
  },
  pointerEnter: () => {
    document.body.style.cursor = 'grab';
  },
};

/**
 * Преобразование конфига с бэка в корректный конфиг vue-konva
 * @param {Object} config Конфиг с бэка
 * @returns {Object} Конфиг для vue-konva
 */
function transformConfigToKonvaCorrect(config) {
  const correctConfig = { ...config, draggable: true };

  if (correctConfig.color) {
    correctConfig.fill = correctConfig.color;
    delete correctConfig.color;
  }

  if (correctConfig.borderColor) {
    correctConfig.stroke = correctConfig.borderColor;
    delete correctConfig.borderColor;
  }

  if (correctConfig.borderWidth) {
    correctConfig.strokeWidth = correctConfig.borderWidth;
    delete correctConfig.borderWidth;
  }

  const reactiveCorrectConfig = reactive(correctConfig);
  
  watchEffect(() => {
    console.log(toValue(reactiveCorrectConfig));
  });

  return reactiveCorrectConfig;
}

/**
 * Редьюсер для выдачи корректного имени компонента vue-konva
 * @param {Object} shape Объект фигуры
 */
function shapeReducer(shape) {
  switch (shape.type) {
    case 'rectangle': return 'v-rect';
    case 'circle': return 'v-circle';
    case 'image': return 'v-image';
    case 'text': return 'v-text';
    case 'arrow': return 'v-arrow';
  }
}

</script>