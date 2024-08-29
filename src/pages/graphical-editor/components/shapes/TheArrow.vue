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

import {computed, onBeforeUnmount, ref} from 'vue';

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
const isDragging = ref(false);
const isResizing = ref(false);
const isRotating = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
const startHeight = ref(0);
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

// Выбор объекта
const selectArrow = () => {
  emits('select-shape', {
    id: props.params.id,
  });
}

// Начало перемещения
const startDragging = (event) => {
  if (!isEditMode.value) return;

  isDragging.value = true;
  offsetX.value = event.clientX - props.params.x;
  offsetY.value = event.clientY - props.params.y;

  document.addEventListener('mousemove', onDragging);
  document.addEventListener('mouseup', stopDragging);
};

// Функция для перемещения
const onDragging = (event) => {
  if (isDragging.value) {
    const newX = event.clientX - offsetX.value;
    const newY = event.clientY - offsetY.value;

    emits('updateShape', props.params.id, 'x', newX);
    emits('updateShape', props.params.id, 'y', newY);
  }
};

// Завершение процесса перемещения
const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDragging);
  document.removeEventListener('mouseup', stopDragging);
};

// Начало изменения размера
const startResizing = (handle) => {
  if (handle.isRotateHandle) {
    startRotating(event);
  } else {
    isResizing.value = true;
    startX.value = props.params.x;
    startY.value = props.params.y;
    startWidth.value = props.params.width;
    startHeight.value = props.params.height;
    offsetX.value = event.clientX;
    offsetY.value = event.clientY;

    document.addEventListener('mousemove', onResizing(handle));
    document.addEventListener('mouseup', stopResizing);
  }
};

//Функция для изменения размера
const onResizing = (handle) => (event) => {
  if (isResizing.value) {
    let newWidth = startWidth.value;
    let newX = startX.value;

    // Обработка изменения размера по горизонтали
    if (handle.position.includes('left')) {
      newWidth = startWidth.value - (event.clientX - offsetX.value);
      if (newWidth > 0) {
        newX = startX.value + (event.clientX - offsetX.value);
      } else {
        newX = startX.value + startWidth.value;
        newWidth = Math.abs(newWidth);
      }
    } else if (handle.position.includes('right')) {
      newWidth = startWidth.value + (event.clientX - offsetX.value);
      if (newWidth < 0) {
        newX = startX.value + newWidth;
        newWidth = Math.abs(newWidth);
      }
    }

    // Обновляем свойства фигуры
    emits('updateShape', props.params.id, 'width', newWidth);
    emits('updateShape', props.params.id, 'x', newX);
  }
};

// Завершение процесса изменения размера
const stopResizing = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResizing);
  document.removeEventListener('mouseup', stopResizing);
}

// Начало вращения
const startRotating = () => {
  isRotating.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;

  document.addEventListener('mousemove', onRotating);
  document.addEventListener('mouseup', stopRotating);
};

// Функция для вращения
const onRotating = (event) => {
  if (isRotating.value) {
    const centerX = props.params.x + props.params.width / 2;
    const centerY = props.params.y + props.params.height / 2;
    let angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);

    // Привязка углов вращения, если зажата клавиша Shift
    if (event.shiftKey) {
      angle = Math.round(angle / 15) * 15;
    }

    emits('updateShape', props.params.id, 'rotation', angle);
  }
};

// Завершение процесса вращения объекта
const stopRotating = () => {
  isRotating.value = false;
  document.removeEventListener('mousemove', onRotating);
  document.removeEventListener('mouseup', stopRotating);
};

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