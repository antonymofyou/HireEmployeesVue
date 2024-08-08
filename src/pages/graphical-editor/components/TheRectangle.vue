<template>
    <div :id="props.params.id" :style="rectangleStyles" class="rectangle">
        <EditorContent class="text-editor" :editor="editor" />
    </div>
</template>

<script setup>

import { defineProps, computed } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

const props = defineProps({
    params: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits(['updateText', 'activeEditor']);
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
    }
});
const editor = useEditor({
    content: props.params.text,
    extensions: [StarterKit, Underline],
    onUpdate: () => {
        emits('updateText', {
            id: props.params.id,
            text: editor.value.getJSON(),
        });
    },
    onFocus: () => {
        emits('activeEditor', editor);
    }
});

</script>

<style scoped>

.rectangle {
    position: absolute;
}

.text-editor {
    width: 100%;
    height: 100%;
}

.text-editor * {
    margin: 0;
    padding: 0;
    outline: none;
    border: 0;
}

.text-editor:deep(.tiptap) {
    max-height: 100%;
    height: 100%;
    overflow: auto;
}

</style>