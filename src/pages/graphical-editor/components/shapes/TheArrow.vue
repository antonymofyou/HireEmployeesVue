<template>
  <div
      :id="props.params.id"
      :style="arrowStyles"
      class="arrow-container"
      @click="selectArrow"
      @mousedown="startDragging"
  >
    <svg
        :height="props.params.height"
        :width="props.params.width"
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
          :x1="0"
          :x2="props.params.width"
          marker-end="url(#arrowhead)"
          stroke-width="2"
      />
    </svg>
    <!-- Показать манипуляторы только если объект выбран -->
    <div v-if="props.isSelected && isEditMode" class="resize-handles">
      <div
          v-for="handle in handles"
          :key="handle.position"
          :class="['handle', handle.position]"
          @mousedown.stop="startResizing(handle)"
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
const arrowStyles = computed(() => {
    return {
        // Geometry
        top: props.params.y + 'px',
        left: props.params.x + 'px',
        zIndex: props.params.zIndex,
        transform: `rotate(${props.params.rotation}deg)`,
        // Size
        width: props.params.width + 'px',
        height: props.params.height + 'px',
        // Style
        stroke: props.params.color,
    }
});

// Список манипуляторов
const handles = [
  { position: 'left', cursor: 'ew-resize' },
  { position: 'right', cursor: 'ew-resize' },
  { position: 'rotate', cursor: 'url("@/assets/icons/rotate.svg?component"), auto', isRotateHandle: true },
];

const { startDragging, stopDragging, startResizing, stopResizing, stopRotating} = useShape(emits, props);

const selectArrow = () => {
  emits('select-shape', {
    id: props.params.id,
  });
}

onBeforeUnmount(() => {
  stopDragging();
  stopResizing();
  stopRotating();
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
  background-color: white;
  border: 1px solid black;
  pointer-events: all;
  cursor: pointer;
}

.handle.left { top: calc(50% - 5px); left: -5px; cursor: ew-resize; }
.handle.right { top: calc(50% - 5px); right: -5px; cursor: ew-resize; }

.handle.rotate {
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: url("@/assets/icons/rotate.svg?component"), auto;
  border-radius: 8px;
  pointer-events: all;
}
</style>