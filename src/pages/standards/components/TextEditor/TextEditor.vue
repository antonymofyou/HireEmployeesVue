<template>
  <div :class="{ 'code': isCode }" class="text-editor__container">
    <Toolbar
      :is-code="isCode"
      @openLinkPopup="setLink"
      @updateCode="isCode = $event"
    />
    <EditorContent class="editor-content" :editor="editor" />
    <LinkPopUp
      v-if="isOpenLinkPopUp"
      :link="linkUrl"
      @closePopUp="toggleLinkPopUp"
      @inputLink="applyLink"
    />
  </div>
</template>

<script setup>
import { ref, provide, watch, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from 'tiptap-extension-font-size';
import IframeNode from './extensions/IframeNode';

import './css/editor-content.css';
import editorStyles from './css/editor-content.css?inline';

import Toolbar from './components/Toolbar.vue';
import LinkPopUp from './components/LinkPopUp.vue';

// modelValue для изменения
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
    required: true,
  }
})

// Возвращает строку без тегов iframe и code (для editor)
function getEditorContent(str) {
  return str.replace(/<iframe[^>]*>.*?<\/iframe>/gis, '').replace(/<code[^>]*>.*?<\/code>/gis, '');
}

// Возвращает строку состоящую из тегов code (для iframe)
function getIframeContent(str) {
  return str.match(/<code[^>]*>.*?<\/code>/gis, '')?.join('\n') || '';
}

// Возвращает строку из содержимого тегов code
function removeTagCode(str) {
  return str.replace(/<code[^>]*>/g, '').replace(/<\/code>/g, '');
}

// Генерирует iframe и возвращает путь до него
function getIframeSrc(content) {
  if (!content.trim()) {
    return;
  }

  const fullContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
      </head>
      <style>
        :root {
          --contrast-white-color: #FFFFFF;
          --silver: #C0C0C0;
          --dove-gray: #6D6D6D;
          --nobel: #B0B0B0;
          --periwinkle-opacity-04: rgba(204, 204, 255, 0.4);
          --periwinkle-opacity-06: rgba(204, 204, 255, 0.6);
        }

        body { overflow: auto; }

        ${editorStyles}
      </style>
      <body class='editor-content'>
        ${content}
      </body>
    </html>
  `;

  const blob = new Blob([fullContent], { type: 'text/html' });

  return URL.createObjectURL(blob);
}

const emit = defineEmits(['update:modelValue']);

const srcIframe = ref('');
// Объект редактора
const editor = useEditor({
  content: getEditorContent(props.modelValue),
  onUpdate: ({ editor }) => {
    const content = isCode.value ? convertFrom(editor.getJSON()) : getEditorContent(editor.getHTML()) + getIframeContent(props.modelValue);

    emit('update:modelValue', content);
  },
  onCreate: ({ editor }) => {
    const iframeContent = removeTagCode(getIframeContent(props.modelValue));
    const src = getIframeSrc(iframeContent);

    if (!src) return;

    srcIframe.value = src;
    editor.commands.setIframe({ src });
  },
  extensions: [
    StarterKit.configure({
      code: false,
    }),
    Underline,
    Link.extend({
      inclusive: false
    })
      .configure({
        openOnClick: false
      }),
    Table.configure({
      resizable: true,
      cellMinWidth: 75,
    }),
    TableRow,
    TableHeader,
    TableCell,
    TextStyle,
    Color,
    FontSize,
    IframeNode,
  ],
  editorProps: {
    attributes: {
      class:
        'text-editor-content-inside',
    },
  },
});

// Для передачи объекта редактора дочерним компонентам
provide('editor', editor)

// Управление модальным окном ссылки
const isOpenLinkPopUp = ref(false);
const linkUrl = ref('');

const toggleLinkPopUp = () => {
  isOpenLinkPopUp.value = !isOpenLinkPopUp.value;
}

// Установка ссылки
const setLink = () => {
  // Получаем текущий URL ссылки под курсором
  const { href } = editor.value.getAttributes('link');
  // Устанавливаем значение ссылки в модальном окне
  linkUrl.value = href || '';
  // Открываем модальное окно
  toggleLinkPopUp();
};

// Действия с ссылкой
const applyLink = (url) => {
  if (url) {
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  } else {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
  }
  toggleLinkPopUp();
}

const isCode = ref(false);

watch(() => isCode.value, function () {
  const newContent = isCode.value ? convertTo(props.modelValue) : convertFrom(editor.value.getJSON());

  if (isCode.value) {
    editor.value.commands.setContent(newContent, false);

    if (srcIframe.value) {
      URL.revokeObjectURL(srcIframe.value);
    }

    return;
  }

  editor.value.commands.setContent(getEditorContent(newContent), false);

  const iframeContent = removeTagCode(getIframeContent(props.modelValue));
  const src = getIframeSrc(iframeContent);

  if (src) {
    srcIframe.value = src;
    editor.value.commands.setIframe({ src });
  };
});

const convertTo = (str = '') => {
  return {
    "type": "doc",
    "content": str.split('\n').filter((item) => item.trim()).map((item) => {
      return {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": item.trim(),
          }
        ]
      };
    })
  };
}

const convertFrom = (object = {}) => {
  return object.content.map((item) => {
    if (!item || !item.content) {
      return '';
    }

    return item.content.reduce((code, item) => {
      if (item.type == "text") {
        code += item.text || '';
      }

      return code;
    }, '');
  }).join('\n');
}

onBeforeUnmount(() => {
  if (srcIframe.value) {
    URL.revokeObjectURL(srcIframe.value);
  }

  editor.value.destroy();
});

</script>

<style scoped>
.text-editor__container {
  border: 0;
  outline: 1px solid var(--transparent-blue);
  border-radius: 16px;
  padding: 10px;
  cursor: text;
}

.editor-content {
  overflow: auto;
}

.text-editor__container.code:deep(.tiptap *){
  font-size: 14px;
}

.text-editor__container:focus-within {
  outline: 2px solid var(--transparent-blue);
}

:deep(.text-editor-content-inside) {
  padding: 0 8px;
}

:deep(.text-editor-content-inside:focus) {
  outline: none;
}

.text-editor__container:deep(iframe) {
  border: 1px solid var(--transparent-blue);
  border-radius: 16px;
  padding: 10px;
}

:deep(.resize-cursor) {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>