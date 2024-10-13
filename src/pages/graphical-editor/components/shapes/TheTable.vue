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

import { defineProps, defineEmits, computed, onBeforeUnmount, watch, nextTick, ref } from 'vue';

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
const borderWidth = computed(() => {
    return props.params.borderWidth || 4;
});
const tableStyles = computed(() => {
    return {
        // Geometry
        top: props.params.y + 'px',
        left: props.params.x + 'px',
        zIndex: props.params.zIndex,
        transform: `rotate(${props.params.rotation}deg)`, 
        // Size
        height: props.params.height + 'px',
        // Style
        '--backgroundColorTable': props.params.color || '#fff',
        '--borderColorTable': props.params.borderColor || "#000",
        '--borderWidthTable': borderWidth.value + 'px',
        // Mode styles
        cursor: isEditMode.value ? 'move' : 'text',
        userSelect: isShapeMode.value ? 'text' : 'none',
    }
});
const cellMinWidth = 75;
const editor = useEditor({
    content: props.params.table,
    extensions: [
        StarterKit,
        Table.configure({
            cellMinWidth,
            resizable: true 
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

        updateSize();
    },
    onCreate: () => {
        if (props.isSelected) {
            selectTable();
        }
        
        updateSize();
    
        calculateMinTableSize(); 
    },
});

function selectTable() {
    emits('selectShape', {
        id: props.params.id,
        editor: editor.value,
    });
}

function updateSize() {
    const table = editor.value.$node('table')?.element?.closest('table') || {};

    emits('updateShape', props.params.id, 'width', table.offsetWidth);
    emits('updateShape', props.params.id, 'height', table.offsetHeight);
}

function recalculateSize() {
    const table = editor.value.$node('table');
    const rows = table.querySelectorAll('tableRow');
    const colwidthList = table.querySelector('tableRow').querySelectorAll('tableCell').reduce((acc, item) => {
        acc.push(...item.attributes.colwidth || [ cellMinWidth ]);

        return acc;
    }, []);
    const prevWidth = Math.round(colwidthList.reduce((acc, val) => acc + val, 0));
    const currentWidth = Math.round(props.params.width) - borderWidth.value;

    if (currentWidth == prevWidth) return;

    const recalculateColwidthList = prevWidth < currentWidth ? incWidthHandler() : decWidthHandler();

    rows.forEach((row) => {
        let idx = 0;

        row.querySelectorAll('tableCell').forEach((cell) => {
            const colspan = cell.attributes.colspan;
            const colwidth = colspan == 1 ? [ recalculateColwidthList[idx] ] : [ ...recalculateColwidthList.slice(idx, idx + colspan) ]

            idx += colspan;
            
            cell.attributes.colwidth = colwidth;

            cell.element.setAttribute('colwidth', colwidth.join(','));
        });
    })

    function incWidthHandler() {
        return colwidthList.map((colwidth) => {
            const newColwidth = +((((colwidth / prevWidth) * 100) * currentWidth) / 100).toFixed(1);

            return newColwidth;
        });
    }

    function decWidthHandler() {
        const minProp = cellMinWidth / currentWidth;
        const prop = colwidthList.map((item) => item / prevWidth).map((item) => Math.max(item, minProp));
        const sumProp = prop.reduce((acc, item) => acc += item, 0);
        const step = (+(sumProp - 1).toPrecision(2)) / (prop.filter((item) => item > minProp).length);

        return prop.map((item) => (item - step >= minProp ? item - step : minProp) * currentWidth);
    }
}

function calculateMinTableSize() {
    const editorContentJson = editor.value.getJSON();
    const tableContentJson = editorContentJson.content?.[0]?.content;
    const amountColumnTable = tableContentJson[0].content.reduce((acc, item) => acc + (item.attrs.colspan || 1), 0);
    const rows = editor.value.$node('table').querySelectorAll('tableRow');

    let minWidth = amountColumnTable * cellMinWidth;
    let minHeight = rows.reduce((height, row) => {
        const heightsCells = row.querySelectorAll('tableCell').map((cell) => {
            return cell.children.reduce((acc, item) => acc += item.element.offsetHeight, 0);
        });

        height += (Math.max(...heightsCells) + borderWidth.value)

        return height;
    }, 0);
    
    minHeight = minHeight + borderWidth.value;
    minWidth = minWidth + borderWidth.value;

    return { minWidth, minHeight };
}

watch(() => props.params.width, recalculateSize);

watch(() => props.params.borderWidth, () => {
    nextTick().then(() => {
        updateSize()
    });
});

/**
 * 
 * Логика перемещения , поворота
 * 
 */

 const resizeHandleStyles = computed(() => {
  return {
    width: props.params.width + 'px',
    height: props.params.height + 'px',
    top: 0,
    left: 0,
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
    font-size: 14px;
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
.table:deep(.tiptap),
.table:deep(.tableWrapper) {
    height: 100%;
}

.table:deep(table) {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    height: 100%;
    background-color: var(--backgroundColorTable);
}

.table:deep(.tiptap) {
    outline: none;
}

.table:deep(td),
.table:deep(th) {
    border: var(--borderWidthTable) solid var(--borderColorTable);
    box-sizing: border-box;
    position: relative;
    padding: 0;
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
    outline: 1px solid #1A73E8;
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