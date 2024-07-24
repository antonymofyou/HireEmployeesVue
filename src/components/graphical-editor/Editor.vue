<template>
  <div @pointerdown.stop @pointerup="props.stagePointerUp">
    <v-stage
      :config="configKonva"
      @click="props.stagePointerDown"
      @pointerdown="props.canvasPointerDown"
      @pointermove="props.canvasPointerMove"
      @pointerup="props.canvasPointerUp"
      ref="konva"
    >
      <v-layer>
        <v-group
          v-for="shape in props.shapes"
          :config="{
            draggable: props.shapesDraggable
          }"
          @pointerenter="props.groupPointerEnter"
          @dragstart="props.groupDragStart"
          @dragend="props.groupDragEnd"
          @pointerleave="props.groupPointerLeave"
          @dblclick="props.startTransform"
        >
          <component    
            :key="shape.id"
            :config="{
              ...TransformerEditor.transformConfigToKonvaCorrect(shape),
              image: TransformerEditor.shapeReducer(shape) === 'v-image' ? helpers.buildImage(shape) : null,
            }"
            :is="TransformerEditor.shapeReducer(shape)"
          />

          <!-- Рендерим текст -->
          <template
            v-for="textInfo in shape.text"
          >
            <v-text
              v-for="textRecord in textInfo.text"
              :config="{
                x: shape.x,
                y: shape.y,
                rotation: shape.rotation,
                width: shape.width,
                height: shape.height,
                align: textInfo.alignment,
                verticalAlign: shape.textVerticalAlignment,
                ...TransformerEditor.transformTextConfigToConvaCorrect(textRecord),
              }">
            </v-text>
          </template>
        </v-group>

        <v-group v-if="currentDrawingShape">
          <component
            v-if="TransformerEditor.shapeReducer(currentDrawingShape) !== 'v-arrow' || currentShapeConfig.points.length > 0"
            :is="TransformerEditor.shapeReducer(currentDrawingShape)"
            :config="currentShapeConfig"
          />
        </v-group>

      <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { TransformerEditor } from './js/TransformClasses';

const props = defineProps({
  shapes: {
    type: Array,
    required: false,
    default: [],
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true
  },
  draggable: {
    type: Boolean,
    required: false,
    default: false,
  },
  shapesDraggable: {
    type: Boolean,
    required: false,
    default: false,
  },
  currentDrawingShape: {
    type: [String, null],
    required: false,
    default: null,
  },
  currentShapeConfig: {
    type: Object,
    required: false,
    default: {},
  },
  stagePointerUp: {
    type: Function,
    required: false,
    default: () => {},
  },
  stagePointerDown: {
    type: Function,
    required: false,
    default: () => {},
  },
  canvasPointerDown: {
    type: Function,
    required: false,
    default: () => {},
  },
  canvasPointerMove: {
    type: Function,
    required: false,
    default: () => {},
  },
  canvasPointerUp: {
    type: Function,
    required: false,
    default: () => {},
  },
  groupPointerEnter: {
    type: Function,
    required: false,
    default: () => {},
  },
  groupDragStart: {
    type: Function,
    required: false,
    default: () => {},
  },
  groupDragEnd: {
    type: Function,
    required: false,
    default: () => {},
  },
  groupPointerLeave: {
    type: Function,
    required: false,
    default: () => {},
  },
  startTransform: {
    type: Function,
    required: false,
    default: () => {},
  },
});

const konva = ref(null);
const transformer = ref(null);

defineExpose({
  inner: konva,
  transformer: transformer,
});

const configKonva = {
  width: props.width,
  height: props.height,
  draggable: props.draggable,
};

// Вспомогательные функции
const helpers = {
  /**
   * Фабрика картинок
   * @param {Object} shape Объект фигуры изображения
   * @returns {HTMLImageElement} Изображение
   */
   buildImage: (shape) => {
    const image = new Image();
    image.src = shape.src;
    return image;
  },
};

</script>