<template>
    <div
        @pointerdown="selectTable"
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

import { defineProps, defineEmits, computed, onBeforeUnmount } from 'vue';

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

const props = defineProps({
    params: {
        type: Object,
        required: true
    }
});
const emits = defineEmits({
    'updateShape': null,
    'selectShape': null,
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
    }
});
const editor = useEditor({
    content: props.params.table,
    extensions: [
        StarterKit,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
    ],
    onUpdate: () => {
        const json = editor.value.getJSON();

        emits('updateShape', props.params.id , 'text' , json);
    },
});

function selectTable() {
    emits('selectShape', {
        id: props.params.id,
        editor: editor.value,
    });
}

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
}

.table:deep(.tiptap) {
    outline: none;
}

.table:deep(td),
.table:deep(th) {
    border: 1px solid var(--mine-shaft);
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