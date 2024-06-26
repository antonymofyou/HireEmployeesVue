<script setup>

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

import BoldIcon from 'vue-material-design-icons/FormatBold.vue'
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue'
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue'
import H1Icon from 'vue-material-design-icons/FormatHeader1.vue'
import H2Icon from 'vue-material-design-icons/FormatHeader2.vue'
import ListIcon from 'vue-material-design-icons/FormatListBulleted.vue'
import OrderedListIcon from 'vue-material-design-icons/FormatListNumbered.vue'
import BlockquoteIcon from 'vue-material-design-icons/FormatQuoteClose.vue'
import CodeIcon from 'vue-material-design-icons/CodeTags.vue'
import HorizontalRuleIcon from 'vue-material-design-icons/Minus.vue'
import UndoIcon from 'vue-material-design-icons/Undo.vue'
import RedoIcon from 'vue-material-design-icons/Redo.vue'
import {ref} from "vue";


const props = defineProps({
  modelValue: String,
  size: {
    type: String,
    default: 'medium',
  },
  staticToolbar: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  }
});



const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [StarterKit, Underline],
  editorProps: {
    attributes: {
      class:
        'text-editor-content-inside',
    },

  },
});


const toolbar = ref(props.staticToolbar);

//достаём панель инструментов по первому клику только
function showToolbar (editor)  {
  toolbar.value = true;
  editor.chain().focus().run()
}

// если клик вне блока, убираем панель инструментов
document.addEventListener('click', function(event) {
  let parentElement = props.id !== '' ? document.getElementById(props.id) : false;
  if (parentElement && (!parentElement.contains(event.target))) {
    toolbar.value = false;
  }
});


</script>

<template>
  <div v-if="props.label" class="text-editor__label">
    {{props.label}}
  </div>
  <div
    :id="id"
    class="text-editor__container"
    :class="{'text-editor-size-big': props.size === 'big',
    'text-editor-size-medium': props.size === 'medium',
    }"
    @click="showToolbar(editor)"
  >

      <section
        v-if="toolbar"
        class="text-editor__button-group"
      >
        <button
          type="button"
          @click="editor?.chain().focus().toggleBold().run()"
          :class="{ 'text-editor__is-active': editor?.isActive('bold') }"
        >
          <BoldIcon title="Bold" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="{ 'text-editor__is-active': editor?.isActive('italic') }"
        >
          <ItalicIcon title="Italic" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="{ 'text-editor__is-active': editor?.isActive('underline') }"
        >
          <UnderlineIcon title="Underline" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{
          'text-editor__is-active': editor?.isActive('heading', { level: 1 }),
        }"
        >
          <H1Icon title="H1" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{
          'text-editor__is-active': editor?.isActive('heading', { level: 2 }),
        }"
        >
          <H2Icon title="H2" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleBulletList().run()"
          :class="{ 'text-editor__is-active': editor?.isActive('bulletList') }"
        >
          <ListIcon title="Bullet List" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          :class="{ 'text-editor__is-active': editor?.isActive('orderedList') }"
        >
          <OrderedListIcon title="Ordered List" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :class="{ 'text-editor__is-active': editor?.isActive('blockquote') }"
        >
          <BlockquoteIcon title="Blockquote" />
        </button>
        <button

          type="button"
          @click="editor?.chain().focus().setHorizontalRule().run()"
        >
          <HorizontalRuleIcon title="Horizontal Rule" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().chain().focus().undo().run()"
        >
          <UndoIcon title="Undo" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().redo().run()"
          :disabled="!editor?.can().chain().focus().redo().run()"
        >
          <RedoIcon title="Redo" />
        </button>
      </section>
      <EditorContent
        :editor="editor"
      />
  </div>
</template>

<style>
.text-editor__label {
  margin-bottom: 10px;
  font-weight: 600;
}



.text-editor__container {
  border: 0;
  border-radius: 10px;
  outline: 1px solid var(--light-gray);
  padding: 10px;
  font-family: Arial, sans-serif;
  cursor: text;
}

.text-editor__container blockquote{
  border-left: 3px solid var(--light-gray);
  margin: 1.5rem 0;
  padding-left: 1rem;
}

.text-editor__container code {
  background: var(--shark);
  border-radius: .5rem;
  color: var(--white);
  font-family: JetBrainsMono, monospace;
  margin: 1.5rem 0;
  padding: .75rem 1rem;
}

.text-editor-size-big {
  min-height: 250px;
}

.text-editor-size-medium {
  min-height: 150px;
}

.text-editor__container:focus-within {
  outline: 2px solid rgba(0, 0, 252, .6);
}

.text-editor__button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 20px;

}

.text-editor__button-group button {
  background: var(--milk);
  border-radius: 0.5rem;
  border: none;
  color: var(--shark);
  font-family: inherit;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;
  cursor: pointer;
  transition: all .2s cubic-bezier(.65,.05,.36,1);
}

.text-editor__button-group button.text-editor__is-active {
  background: var(--light-violet);
  color: var(--white);
}

.text-editor-content-inside:focus {
  outline: none;
}

.text-editor-content-inside hr {
  opacity: 0.5;
}

.text-editor-content-inside p {
  white-space: pre-line;
}

</style>
