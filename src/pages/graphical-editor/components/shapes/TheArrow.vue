<template>
  <div
      :id="props.params.id"
      :style="arrowStyles"
      class="arrow-container"
      @click="selectArrow"
      @mousedown="startDragging($event), selectArrow()"
      @touchstart="startDragging($event), selectArrow()"
  >
    <svg
        :height="svgHeight"
        :width="svgWidth"
        class="arrow"
    >
      <defs>
        <marker
            id="arrowhead"
            class="marker"
            markerHeight="7"
            markerWidth="12"
            orient="auto"
            refX="9"
            refY="3.5"
        >
          <line
              stroke-linecap="round"
              x1="4"
              x2="9"
              y1="0"
              y2="3.5"
          />
          <line
              stroke-linecap="round"
              x1="4"
              x2="9"
              y1="7"
              y2="3.5"
          />
        </marker>
      </defs>
      <line
          :x1="props.params.x1"
          :y1="props.params.y1"
          :x2="props.params.x2"
          :y2="props.params.y2"
          marker-end="url(#arrowhead)"
          stroke-width="2"
      />
    </svg>
    <!-- Показать манипуляторы только если объект выбран -->
    <div v-if="props.isSelected && isEditMode" class="resize-handles">
      <div
          class="handle start"
          :style="{ left: props.params.x1 + 'px', top: props.params.y1 + 'px'}"
          @mousedown.stop="startResizingArrow('start', $event)"
          @touchstart.stop="startResizingArrow('start', $event)"
      ></div>
      <div
          class="handle end"
          :style="{ left: props.params.x2 + 'px', top: props.params.y2 + 'px'}"
          @mousedown.stop="startResizingArrow('end', $event)"
          @touchstart.stop="startResizingArrow('end', $event)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount} from 'vue';
import { useShape } from '../../assets/js/useShape';

const props = defineProps({
    params: {
        type: Object,
        required: true,
    },
    mode: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true,
    }
});
const emits = defineEmits(['updateShape', 'select-shape']);

const isEditMode = computed(() => {
  return props.mode.value === props.mode._edit;
});

// Рассчитываем ширину и высоту SVG-контейнера
const svgWidth = computed(() => Math.abs(props.params.x2 - props.params.x1) || 2);
const svgHeight = computed(() => Math.abs(props.params.y2 - props.params.y1) || 2);

const arrowStyles = computed(() => {
    return {
        // Geometry
        top: props.params.y + 'px',
        left: props.params.x + 'px',
        zIndex: props.params.zIndex,
        // Style
        stroke: props.params.color,
    }
});

const { startDragging, stopDragging, startResizingArrow, stopResizingArrow} = useShape(emits, props);

const selectArrow = () => {
  emits('select-shape', {
    id: props.params.id,
  });
}

onBeforeUnmount(() => {
  stopDragging();
  stopResizingArrow();
});
</script>

<style scoped>
.arrow-container {
    position: absolute;
    cursor: move;
}
.arrow {
    overflow: visible;
}

.resize-handles {
  position: absolute;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  top: -5px;
  left: -5px;
  pointer-events: none;
}

.handle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid black;
  pointer-events: all;
  cursor: pointer;
}

.handle.start { top: 0; left: 0; cursor: ew-resize; transform: translate(50%, 50%);}
.handle.end { top: calc(50% - 5px); right: -5px; cursor: ew-resize; transform: translate(50%, 50%);}

</style>