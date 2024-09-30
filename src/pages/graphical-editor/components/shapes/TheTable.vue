<template>
    <div
        @mousedown="startDragging($event), selectTable()"
        @touchstart="startDragging($event), selectTable()"
        @dblclick="toggleShapeEditMode"
        @touchend="handleTouchEnd"
        :style="tableStyles"
        :id="props.params.id"
        :class="{ 'shape-mode' : props.isSelected && isShapeMode }"
        class="table"
    >
        <EditorContent
            :style="{ pointerEvents: isShapeMode ? 'auto' : 'none' }"
            :editor="editor" 
            class="table__editor" 
        />
        <div v-if="props.isSelected && isEditMode" class="resize-handles" :style="resizeHandleStyles">
            <div
                v-for="handle in handles"
                :key="handle.position"
                :class="['handle', handle.position]"
                @mousedown.stop="startResizing(handle, $event)"
                @touchstart.stop="startResizing(handle, $event)"
            >
            </div>
      </div>
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed, onBeforeUnmount, watch, ref } from 'vue';

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size';
import Highlight from '@tiptap/extension-highlight';
import { useShape } from '../../assets/js/useShape';

const props = defineProps({
    params: {
        type: Object,
        required: true
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
const emits = defineEmits({
    'updateShape': null,
    'selectShape': null,
    'change-mode': null,
});

const isShapeMode = computed(() => {
  return props.mode.value === props.mode._shape;
});
const isEditMode = computed(() => {
  return props.mode.value === props.mode._edit;
});
const tableStyles = computed(() => {
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
        '--backgroundColorTable': props.params.color || '#fff',
        '--borderColorTable': props.params.borderColor || "#000",
        '--borderWidthTable': (props.params.borderWidth || 2) + 'px',
        // Mode styles
        cursor: isEditMode.value ? 'move' : 'text',
        userSelect: isShapeMode.value ? 'text' : 'none',
    }
});
const editor = useEditor({
    content: props.params.table,
    extensions: [
        StarterKit,
        Table.configure({
            HTMLAttributes: {
                class: 'table-editor',
            },
            cellMinWidth: 0,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Underline,
        TextStyle,
        FontSize,
        Color.configure({
            types: ['textStyle'],
        }),
        Highlight.configure({ multicolor: true }),
    ],
    onUpdate: () => {
        const json = editor.value.getJSON();

        emits('updateShape', props.params.id , 'text' , json);

        syncSize();
    },
    onCreate: () => {
        syncSize();

        if (props.isSelected) {
            selectTable();
        }
      calculateMinTableSize();
    },
    editable: isShapeMode.value,
});

watch(() => isShapeMode.value, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue);
  }
});

// Функция нахождения минимальных размеров таблицы
function calculateMinTableSize() {
  const tableElement = editor.value.$node('table')?.element?.closest('.table-editor');

  if (!tableElement) return { minWidth: 0, minHeight: 0 };

  const rows = tableElement.querySelectorAll('tr');

  let columnWidths = [];
  let maxHeight = 0;
  const context = document.createElement('canvas').getContext('2d');

  const fontSize = window.getComputedStyle(tableElement).fontSize;
  const fontFamily = window.getComputedStyle(tableElement).fontFamily;
  context.font = `${fontSize} ${fontFamily}`;

  const minCellWidth = 25;

  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    cells.forEach((cell, index) => {
      const textContent = cell.textContent.trim();
      const cellWidth = context.measureText(textContent).width;

      const paddingLeft = parseFloat(window.getComputedStyle(cell).paddingLeft) || 0;
      const paddingRight = parseFloat(window.getComputedStyle(cell).paddingRight) || 0;
      const borderLeft = parseFloat(window.getComputedStyle(cell).borderLeftWidth) || 0;
      const borderRight = parseFloat(window.getComputedStyle(cell).borderRightWidth) || 0;
      const totalCellWidth = cellWidth + paddingLeft + paddingRight + borderLeft + borderRight;

      const paddingTop = parseFloat(window.getComputedStyle(cell).paddingTop) || 0;
      const paddingBottom = parseFloat(window.getComputedStyle(cell).paddingBottom) || 0;
      const borderTop = parseFloat(window.getComputedStyle(cell).borderTopWidth) || 0;
      const borderBottom = parseFloat(window.getComputedStyle(cell).borderBottomWidth) || 0;
      const totalCellHeight = paddingTop + paddingBottom + borderTop + borderBottom + parseFloat(fontSize) * 1.2;

      if (columnWidths[index] === undefined) {
        columnWidths[index] = 0;
      }

      columnWidths[index] = Math.max(columnWidths[index], totalCellWidth, minCellWidth);
      maxHeight = Math.max(maxHeight, totalCellHeight);
    });
  });

  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  const borderWidth = parseFloat(getComputedStyle(tableElement).borderWidth) || 0;
  const padding = parseFloat(getComputedStyle(tableElement).padding) || 0;

  const minWidth = Math.ceil(totalWidth + 2 * borderWidth + 2 * padding);
  const minHeight = Math.ceil(maxHeight * rows.length + 2 * borderWidth + 2 * padding);

  return { minWidth, minHeight };
}

function syncSize() {
    const { offsetWidth, offsetHeight } = editor.value.$node('table')?.element?.closest('.table-editor') || {};

    emits('updateShape', props.params.id, 'width', offsetWidth);
    emits('updateShape', props.params.id, 'height', offsetHeight);
}

function selectTable() {
    emits('selectShape', {
        id: props.params.id,
        editor: editor.value,
    });
}

/**
 * 
 * Логика перемещения , поворота
 * 
 */

 const resizeHandleStyles = computed(() => {
  const borderWidth = parseFloat(tableStyles.value.borderWidth) || 0;

  return {
    width: tableStyles.value.width,
    height: tableStyles.value.height,
    top: `-${borderWidth}px`,
    left: `-${borderWidth}px`,
  };
});

// Список манипуляторов
const handles  = computed(() => {
  return [
  { position: 'top-left', cursor: 'nwse-resize' },
  { position: 'top-right', cursor: 'nesw-resize' },
  { position: 'bottom-left', cursor: 'nesw-resize' },
  { position: 'bottom-right', cursor: 'nwse-resize' },
  { position: 'left', cursor: 'ew-resize' },
  { position: 'right', cursor: 'ew-resize' },
  { position: 'top', cursor: 'ns-resize' },
  { position: 'bottom', cursor: 'ns-resize' },
  { position: 'rotate', cursor: 'url("@/assets/icons/rotate.svg?component"), auto', isRotateHandle: true },
]
});

const { startDragging, stopDragging, startResizing, stopResizing, stopRotating } = useShape(emits, props, calculateMinTableSize);

const lastTap = ref(0);

// Обработка двойного тапа для смены режимов
const handleTouchEnd = (event) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap.value;

  if (tapLength < 300 && tapLength > 0) {
    toggleShapeEditMode();
  }
  lastTap.value = currentTime;
};

// Переключение режима по двойному клику или тапу
const toggleShapeEditMode = () => {
  if (isShapeMode.value) {
    emits('change-mode', props.mode._edit);
  } else { 
    emits('change-mode', props.mode._shape);
    editor.value.chain().focus().run();
  }
};

onBeforeUnmount(() => {
  editor.value.destroy();
  stopDragging();
  stopResizing();
  stopRotating();
});
</script>

<style scoped>

.table {
    position: absolute;
    cursor: default;
}

.table.shape-mode::before {
    content: '\A1';
    position: absolute;
    top: 0;
    left: 50%;
    padding: 1px 8px 4px 7px;
    font-size: 12px;
    color: var(--white);
    justify-content: center;
    transform: translateX(-50%) translateY(-125%);
    background-color: var(--transparent-blue);
    border-radius: 100%;
}

.table * {
    margin: 0;
}

.table:deep(.table__editor),
.table:deep(.tiptap) {
    height: 100%;
}

.table:deep(table) {
    border-collapse: collapse;
    table-layout: auto;
    min-width: 100%;
    width: 100%;
    height: 100%;
    background-color: var(--backgroundColorTable);
}

.table:deep(.tiptap) {
    outline: none;
}

.table:deep(td),
.table:deep(th) {
    border: var(--borderWidthTable) solid var(--borderColorTable);
    position: relative;
    min-width: 25px;
}

.table:deep(th) {
    font-weight: bold;
}

.table:deep(.resize-cursor) {
    cursor: col-resize;
}

.table:deep(.selectedCell::after) {
    background: var(--backgroundColorTable);
    content: "";
    left: 0; 
    right: 0; 
    top: 0; 
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
    opacity: 0.25;
    filter: invert(1);
}

.resize-handles {
    position: absolute;
    border: 1px solid #1A73E8;
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

.handle.top-left { top: -5px; left: -5px; cursor: nwse-resize; }
.handle.top-right { top: -5px; right: -5px; cursor: nesw-resize; }
.handle.bottom-left { bottom: -5px; left: -5px; cursor: nesw-resize; }
.handle.bottom-right { bottom: -5px; right: -5px; cursor: nwse-resize; }
.handle.left { top: calc(50% - 5px); left: -5px; cursor: ew-resize; }
.handle.right { top: calc(50% - 5px); right: -5px; cursor: ew-resize; }
.handle.top { top: -5px; left: calc(50% - 5px); cursor: ns-resize; }
.handle.bottom { bottom: -5px; left: calc(50% - 5px); cursor: ns-resize; }

.handle.rotate {
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    cursor: url("@/assets/icons/rotate.svg?component"), auto;
    border-radius: 8px;
    pointer-events: all;
}

.handle.rotate::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 17px;
    background-color: black;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
}
</style>