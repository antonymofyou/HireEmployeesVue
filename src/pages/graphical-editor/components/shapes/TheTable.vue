<template>
    <div
        @pointerdown="selectTable"
        @dblclick="toggleShapeEditMode"
        @touchend="handleTouchEnd"
        :style="tableStyles"
        :id="props.params.id"
        class="table"
    >
        <EditorContent
            :editor="editor" 
            class="table__editor" 
        />
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

const props = defineProps({
    params: {
        type: Object,
        required: true
    },
    mode: {
      type: Object,
      required: true
    },
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
        Table,
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
    },
    editable: isShapeMode.value,
});

function selectTable() {
    emits('selectShape', {
        id: props.params.id,
        editor: editor.value,
    });
}

/**
 * 
 * Логика смены режимов
 * 
 */

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

watch(() => isShapeMode.value, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue);
  }
});

onBeforeUnmount(() => {
    editor.value.destroy();
});

</script>

<style scoped>

.table {
    position: absolute;
    cursor: default;
}

.table:deep(table) {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    background-color: var(--backgroundColorTable);
}

.table:deep(.tiptap) {
    outline: none;
}

.table:deep(td),
.table:deep(th) {
    border: var(--borderWidthTable) solid var(--borderColorTable);
    position: relative;
}

.table:deep(th) {
    font-weight: bold;
}

.table:deep(.resize-cursor) {
    cursor: col-resize;
}

.table:deep(.column-resize-handle) {
    background-color: var(--transparent-blue);
    bottom: -2px;
    pointer-events: none;
    position: absolute;
    right: -3px;
    top: 0;
    width: 4px;
}
</style>