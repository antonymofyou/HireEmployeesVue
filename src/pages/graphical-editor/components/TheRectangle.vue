<template>
    <div
        @mousedown="startDragging"
        @click="editor.chain().focus().run()"
        :id="props.params.id"
        :style="rectangleStyles"
        class="rectangle"
    >
        <EditorContent class="text-editor" :editor="editor" />
    </div>
</template>

<script setup>
import { defineProps, computed, onBeforeUnmount, ref } from 'vue';
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
const emits = defineEmits(['updateShape', 'activeEditor']);
const isDragging = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);

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

// Функции для перемещения блока
const startDragging = (event) => {
  isDragging.value = true;
  offsetX.value = event.clientX - props.params.x;
  offsetY.value = event.clientY - props.params.y;

  document.addEventListener('mousemove', onDragging);
  document.addEventListener('mouseup', stopDragging);
};

const onDragging = (event) => {
  if (isDragging.value) {
    const newX = event.clientX - offsetX.value;
    const newY = event.clientY - offsetY.value;

    emits('updateShape', props.params.id, 'x', newX);
    emits('updateShape', props.params.id, 'y', newY);
  }
};

const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDragging);
  document.removeEventListener('mouseup', stopDragging);
};

onBeforeUnmount(() => {
    editor.value.destroy();
    stopDragging();
});

</script>

<style scoped>

.rectangle {
    position: absolute;
    display: flex;
    flex-direction: column;
    cursor: grab;
    user-select: none;
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