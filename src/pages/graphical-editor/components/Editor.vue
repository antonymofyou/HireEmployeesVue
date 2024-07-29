<template>
  <div
    class="canvas-wrapper"
    @pointerdown.stop @pointerup="props.stagePointerUp"
    ref="canvasWrapper"
  >
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
          :key="shape.id"
          :config="{
            draggable: props.shapesDraggable,
            zIndex: shape.zIndex,
            x: shape.x,
            y: shape.y,
            scaleX: shape.scaleX,
            scaleY: shape.scaleY,
            rotation: shape.rotation,
            width: shape.width,
            height: shape.height
          }"
          @pointerenter="props.groupPointerEnter"
          @dragstart="props.groupDragStart"
          @dragend="props.groupDragEnd"
          @pointerleave="props.groupPointerLeave"
          @click="props.startTransform"
          @tap="props.startTransform"
        >
          <component    
            :key="shape.id"
            :config="{
              ...TransformerEditor
              .transformConfigToKonvaCorrect(
                shape,
                // Передаём параметры для удаления для избежания увеличения значения на само себя
                // Т.к. стейт конвы и наш - синхронизирован не полностью, мы, после изменения стейта конвы,
                // Пишем в свой стейт значения. Написали значения - конва ререндерит компоненты
                ['scaleX', 'scaleY', 'x', 'y', 'rotation']
              ),
              image: TransformerEditor.shapeReducer(shape) === 'v-image' ? helpers.buildImage(shape.imageId) : null,
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
                width: shape.width,
                height: shape.height,
                align: textInfo.alignment,
                verticalAlign: shape.textVerticalAlignment,
                ...TransformerEditor.transformTextConfigToConvaCorrect(textRecord),
              }">
            </v-text>
          </template>
        </v-group>
        
        <v-transformer ref="transformer" />
      </v-layer>

      <v-layer>
        <v-group v-if="currentDrawingShape">
          <component
            v-if="TransformerEditor.shapeReducer(currentDrawingShape) !== 'v-arrow' || currentShapeConfig.points.length > 0"
            :is="TransformerEditor.shapeReducer(currentDrawingShape)"
            :config="currentShapeConfig"
          />
        </v-group>
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { TransformerEditor } from '../js/TransformClasses';

const props = defineProps({
  onlyView: {
    type: Boolean,
    required: false,
    default: true,
  },
  shapes: {
    type: Array,
    required: true,
  },
  imageDictionary: {
    type: Object,
    required: true,
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
const canvasWrapper = ref(null);

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
   * @param {Object} imageId ID картинки
   * @returns {HTMLImageElement} Изображение
   */
  buildImage: (imageId) => {
    const imageBase64 = props.imageDictionary[imageId];
    const image = new Image();
    image.src = imageBase64;
    return image;
  },
};

// Эффект, в котором достигаем того, что содержимое канвы на всех экранах будет одинаковым
watchEffect((onCleanup) => {
  if (!canvasWrapper.value) return;

  const resizeHandler = () => {
    const containerWidth = canvasWrapper.value.offsetWidth;
    const containerHeight = canvasWrapper.value.offsetHeight;
    
    const scale = containerWidth / props.width;
    const stage = konva.value.getStage();

    stage.width(containerWidth);
    stage.height(containerHeight);
    stage.scale({ x: scale, y: scale });
  };
  resizeHandler();

  window.addEventListener('resize', resizeHandler, { passive: true });

  onCleanup(() => window.removeEventListener('resize', resizeHandler));
});

// onMounted(() => {
//   canvasWrapper.value.style.width = 1400 + 'px';
//   canvasWrapper.value.style.height = 460 + 'px';
// });
</script>

<style scoped>
.canvas-wrapper {
  margin-bottom: 1rem;
  border-radius: 24px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
</style>