<template>
    <div
        @mousedown="startDragging"
        @click="selectRectangle"
        :id="props.params.id"
        :style="rectangleStyles"
        :class="['rectangle', { selected: isSelected }]"
    >
        <EditorContent v-if="editor" class="text-editor" :editor="editor" />

    <!-- Показать манипуляторы только если объект выбран -->
    <div v-if="isSelected" class="resize-handles">
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
import { defineProps, computed, onBeforeUnmount, ref, onMounted } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size';

import { convertTo, convertFrom } from '../assets/js/convert';

const props = defineProps({
    params: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits(['updateShape', 'activeEditor', 'select-shape']);
const isDragging = ref(false);
const isSelected = ref(false);
const isResizing = ref(false);
const isRotating = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
const startHeight = ref(0);

const paramsTextVerticalAlignment = {
    'top': 'flex-start',
    'center': 'center',
    'bottom': 'flex-end',
};
const rectangleStyles = computed(() => {
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
        backgroundColor: props.params.color,
        borderRadius: props.params.cornerRadius + 'px',
        borderWidth: props.params.borderWidth + 'px',
        borderStyle: props.params.borderStyle,
        borderColor: props.params.borderColor,
        // Text vertical align
        justifyContent: paramsTextVerticalAlignment[props.params.textVerticalAlignment],
    }
});
const editor = useEditor({
    content: convertFrom(props.params.text),
    extensions: [
        StarterKit, 
        Underline,
        TextStyle,
        FontSize,
        TextAlign.configure({
            types: ['paragraph'],
        }),
        Color.configure({
            types: ['textStyle'],
        })
    ],
    onUpdate: () => {
        const json = editor.value.getJSON();

        emits('updateShape', props.params.id , 'text' , convertTo(json));
    },
    onFocus: () => {
        emits('activeEditor', editor);
    }
});

// Список манипуляторов
const handles = [
  { position: 'top-left', cursor: 'nwse-resize' },
  { position: 'top-right', cursor: 'nesw-resize' },
  { position: 'bottom-left', cursor: 'nesw-resize' },
  { position: 'bottom-right', cursor: 'nwse-resize' },
  { position: 'left', cursor: 'ew-resize' },
  { position: 'right', cursor: 'ew-resize' },
  { position: 'top', cursor: 'ns-resize' },
  { position: 'bottom', cursor: 'ns-resize' },
  { position: 'rotate', cursor: 'grab', isRotateHandle: true },
];

// Выбор объекта
const selectRectangle = () => {
  emits('select-shape', props.params.id);
  isSelected.value = true;
  if (editor && editor.chain) {
    editor.chain().focus().run();
  }
};

// Начало перемещения
const startDragging = (event) => {
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
    let newHeight = startHeight.value;
    let newX = startX.value;
    let newY = startY.value;

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

    // Обработка изменения размера по вертикали
    if (handle.position.includes('top')) {
      newHeight = startHeight.value - (event.clientY - offsetY.value);
      if (newHeight > 0) {
        newY = startY.value + (event.clientY - offsetY.value);
      } else {
        newY = startY.value + startHeight.value;
        newHeight = Math.abs(newHeight);
      }
    } else if (handle.position.includes('bottom')) {
      newHeight = startHeight.value + (event.clientY - offsetY.value);
      if (newHeight < 0) {
        newY = startY.value + newHeight;
        newHeight = Math.abs(newHeight);
      }
    }

    // Обновляем свойства фигуры
    emits('updateShape', props.params.id, 'width', newWidth);
    emits('updateShape', props.params.id, 'height', newHeight);
    emits('updateShape', props.params.id, 'x', newX);
    emits('updateShape', props.params.id, 'y', newY);
  }
};

// Завершение процесса изменения размера
const stopResizing = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResizing);
  document.removeEventListener('mouseup', stopResizing);
}

// Начало вращения
const startRotating = (event) => {
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

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  editor.value.destroy();
  stopDragging();
  stopResizing();
  stopRotating();
});

// Обработчик кликов вне объекта для снятия выделения
const handleClickOutside = (event) => {
  if (!event.target.closest(`[id="${props.params.id}"]`)) {
    isSelected.value = false;
  }
};
</script>

<style scoped>

.rectangle {
    position: absolute;
    display: flex;
    flex-direction: column;
    cursor: move;
    user-select: none;
}

.resize-handles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px dashed gray;
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

.handle.top-left { top: -5px; left: -5px; cursor: nwse-resize; }
.handle.top-right { top: -5px; right: -5px; cursor: nesw-resize; }
.handle.bottom-left { bottom: -5px; left: -5px; cursor: nesw-resize; }
.handle.bottom-right { bottom: -5px; right: -5px; cursor: nwse-resize; }
.handle.left { top: calc(50% - 5px); left: -5px; cursor: ew-resize; }
.handle.right { top: calc(50% - 5px); right: -5px; cursor: ew-resize; }
.handle.top { top: -5px; left: calc(50% - 5px); cursor: ns-resize; }
.handle.bottom { bottom: -5px; left: calc(50% - 5px); cursor: ns-resize; }

.handle.rotate {
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;
}

.text-editor {
    width: 100%;
}

.text-editor * {
    margin: 0;
    padding: 0;
    outline: none;
    border: 0;
}

</style>