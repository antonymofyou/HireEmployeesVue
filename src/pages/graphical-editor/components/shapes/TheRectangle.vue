<template>
    <div
        @mousedown="startDragging($event), selectRectangle()"
        @touchstart="startDragging($event), selectRectangle()"
        @dblclick="toggleTextEditMode"
        @click="selectRectangle"
        :id="props.params.id"
        :style="rectangleStyles"
        class="rectangle"
    >
      <EditorContent
          class="text-editor"
          :editor="editor"
      />
      <!-- @mousedown.stop="enterTextEditMode" обработчик клика по тексту без перехода в EditMode, находится в EditorContent -->

    <!-- Показать манипуляторы только если объект выбран -->
    <div v-if="props.isSelected && isEditMode" class="resize-handles" :style="resizeHandleStyles">
      <div
          v-for="handle in handles"
          :key="handle.position"
          :class="['handle', handle.position]"
          @mousedown.stop="startResizing(handle, $event)"
          @touchstart.stop="startResizing(handle, $event)"
      ></div>
    </div>
    <div v-show="props.isSelected && isTextMode" :style="resizeHandleStyles" class="text-mode">
      <FormatText class="text-mode__icon" />
    </div>
    </div>
</template>

<script setup>
import {computed, onBeforeUnmount, watch} from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { useShape } from '../../assets/js/useShape';
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size';
import Highlight from '@tiptap/extension-highlight';
import FormatText from 'vue-material-design-icons/FormatText.vue'

import { convertTo, convertFrom } from '../../assets/js/convert';

/**
 * 
 * Объект с параметрами фигуры { width: 100, height: 200 ... }
 * 
 */
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
const emits = defineEmits(['updateShape', 'select-shape', 'change-mode']);

const paramsTextVerticalAlignment = {
    'top': 'flex-start',
    'center': 'center',
    'bottom': 'flex-end',
};
const isTextMode = computed(() => {
  return props.mode.value === props.mode._text;
});
const isEditMode = computed(() => {
  return props.mode.value === props.mode._edit;
});
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
        padding: `${props.params.padding || 0}px`,
        // Style
        backgroundColor: props.params.color,
        borderRadius: props.params.cornerRadius + 'px',
        borderWidth: props.params.borderWidth + 'px',
        borderStyle: props.params.borderStyle,
        borderColor: props.params.borderColor,
        // Text vertical align
        justifyContent: paramsTextVerticalAlignment[props.params.textVerticalAlignment],
        // Mode styles
        cursor: isEditMode.value ? 'move' : 'text',
        userSelect: isTextMode.value ? 'text' : 'none',
    }
});
const resizeHandleStyles = computed(() => {
  const borderWidth = parseFloat(rectangleStyles.value.borderWidth) || 0;

  return {
    width: rectangleStyles.value.width,
    height: rectangleStyles.value.height,
    top: `-${borderWidth}px`,
    left: `-${borderWidth}px`,
  };
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
    editable: isTextMode.value,
});
watch(() => isTextMode.value, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue);
  }
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

const { startDragging, stopDragging, startResizing, stopResizing, stopRotating} = useShape(emits, props);

// Выбор объекта
const selectRectangle = () => {
  emits('select-shape', {
    id: props.params.id,
    editor: editor.value,
  });
};

// Вход в режим редактирования текста
const enterTextEditMode = () => {
  emits('change-mode', props.mode._text);
  editor.value.chain().focus().run();
};

// Переключение режима текста по двойному клику
const toggleTextEditMode = () => {
  if (props.mode.value === props.mode._text) {
    emits('change-mode', props.mode._edit);
  } else {
    enterTextEditMode();
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

.rectangle {
    position: absolute;
    display: flex;
    flex-direction: column;
}

.resize-handles {
  position: absolute;
  border: 1px solid #1A73E8;
  pointer-events: none;
}

.text-mode {
  position: absolute;
  border: 1px solid #1A73E8;
  pointer-events: none;
}

.text-mode__icon {
  position: absolute;
  top: -8px;
  right: 50%;
  transform: translateY(-100%) translateX(50%);
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