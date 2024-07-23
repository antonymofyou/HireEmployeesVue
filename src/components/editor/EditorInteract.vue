<template>
  <h1 class="title">Редактор</h1>

  <v-stage :config="configKonva" @pointerdown="callbacks.stagePointerDown">
    <v-layer>
      <component
        v-for="shape in data.shapes"
        :key="shape.id"
        :config="transformConfigToKonvaCorrect(shape)"
        :is="shapeReducer(shape)"
        @pointerenter="callbacks.pointerEnter"
        @dragstart="callbacks.dragStart"
        @dragend="callbacks.dragEnd"
        @pointerleave="callbacks.pointerLeave"
        @dblclick="callbacks.startTransform"
      />
      <v-transformer ref="transformer" />
    </v-layer>
  </v-stage>

  <Transition name="actions-animation" v-show="selectedShape">
    <div class="actions">
      <div class="actions__colors">
        <div class="action">
          <label>
            Основной цвет: <b>(fill)</b>
            <input
              type="color"
              :value="selectedShape?.fill()"
              @input="selectedShape?.fill($event.target.value)"
            />
          </label>
        </div>

        <div class="action">
          <label>
            Цвет границ: <b>(stroke)</b>
            <input
              type="color"
              :value="selectedShape?.stroke()"
              @input="selectedShape?.stroke($event.target.value)"
            />
          </label>
        </div>
      </div>

      <div class="actions__corners" v-if="selectedShape?.attrs.type === 'rectangle'">
        <label>
          Скругление: <b>cornerRadius</b>
          <input
            type="range"
            :min="0"
            :max="100"
            :value="selectedShape?.cornerRadius()"
            @input="selectedShape?.cornerRadius(Number($event.target.value))"
          />
          <b>{{ selectedShape?.cornerRadius() }}</b>
        </label>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, watchEffect, toValue } from 'vue';
import { data } from './mock';

const transformer = ref(null);
const selectedShape = ref(null);

const configKonva = {
  width: window.innerWidth,
  height: window.innerHeight / 2
};

// Переиспользуемые функции
const callbacks = {
  dragStart: () => {
    document.body.style.cursor = 'grabbing';
  },
  dragEnd: (e) => {
    const { target } = e;

    document.body.style.cursor = 'default';
    console.group('DragEnd');
    console.log('Coordinates after drag:');
    console.log(target.attrs);
    console.groupEnd('DragEnd');
  },
  pointerLeave: () => {
    document.body.style.cursor = 'default';
  },
  pointerEnter: () => {
    document.body.style.cursor = 'grab';
  },
  startTransform: (e) => {
    const { target } = e;
    const transformerNode = transformer.value.getNode();
    const stage = transformerNode.getStage();
    const selectedNode = stage.findOne(`#${target.id()}`);
    
    if (target === selectedShape.value) {
      selectedShape.value = null;
      transformerNode.nodes([]);
      return;
    }
    if (transformerNode.node() === selectedNode) return;
    
    if (selectedNode) {
      selectedShape.value = selectedNode;
      transformerNode.nodes([selectedNode]);
    }
    else {
      selectedShape.value = null;
      transformerNode.nodes([]);
    }
  },
  
  stagePointerDown: (e) => {
    const { target } = e;

    if (target === target.getStage()) {
      selectedShape.value = null;
      const transformerNode = transformer.value.getNode();
      transformerNode.nodes([]);
    }
  },
};

watchEffect(() => {
  console.group('Active Shape');

  console.log(toValue(selectedShape));

  console.groupEnd('Active Shape');
});

/**
 * Преобразование конфига с бэка в корректный конфиг vue-konva
 * @param {Object} config Конфиг с бэка
 * @returns {Object} Конфиг для vue-konva
 */
function transformConfigToKonvaCorrect(config) {
  const correctConfig = { ...config, id: String(config.id), draggable: true };

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

  return reactive(correctConfig);
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

<style scoped>
.title {
  text-align: center;
}

.actions__colors {
  display: flex;
  column-gap: 30px;
}

.actions-animation-enter-active,
.actions-animation-leave-active {
  transition: opacity 0.5s ease;
}

.actions-animation-enter-from,
.actions-animation-leave-to {
  opacity: 0;
}
</style>
