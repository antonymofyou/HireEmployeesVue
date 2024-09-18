<template>
    <div
        :style="[geometryStyles, sizeStyles]"
        :id="props.params.id"
        class="table"
    >
        <EditorContent :editor="editor" />
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue';

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
});

const geometryStyles = computed(() => {
    return {
        top: props.params.y + 'px',
        left: props.params.x + 'px',
        zIndex: props.params.zIndex,
        transform: `rotate(${props.params.rotation}deg)`, 
    }
});
const sizeStyles = computed(() => {
    return {
        width: props.params.width + 'px',
        height: props.params.height + 'px',  
    }
})

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

</script>