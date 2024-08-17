<template>
    <div 
        @click="editor.chain().focus().run()" 
        :id="props.params.id" 
        :style="rectangleStyles" 
        class="rectangle"
    >
        <EditorContent class="text-editor" :editor="editor" />
    </div>
</template>

<script setup>

import { defineProps, computed, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size';
import Highlight from '@tiptap/extension-highlight'

import { convertTo, convertFrom } from '../assets/js/convert';

/**
 * 
 * Объект с параметрами фигуры { width: 100, height: 200 ... }
 * 
 */
const props = defineProps({
    params: {
        type: Object,
        required: true,
    }
});
/**
 * 
 * activeEditor(editor) - передает экземпляр редактора при его активации (focus)
 * 
 * updateShape(ид-фигуры, обновляемый ключ , json) - передает содержимое редактора (json) при обновлении
 * 
 */
const emits = defineEmits(['updateShape', 'activeEditor']);
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
        }),
        Highlight.configure({ multicolor: true }),
    ],
    onUpdate: () => {
        const json = editor.value.getJSON();

        emits('updateShape', props.params.id , 'text' , convertTo(json));
    },
    onFocus: () => {
        emits('activeEditor', editor);
    }
});
onBeforeUnmount(() => {
    editor.value.destroy();
});

</script>

<style scoped>

.rectangle {
    position: absolute;
    display: flex;
    flex-direction: column;
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