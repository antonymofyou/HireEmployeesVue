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
import {computed, onMounted, ref} from "vue";


const props = defineProps({
  modelValue: String,
  size: {
    type: String,
    default: 'medium',
  },
  staticToolbar: {
    type: Boolean,
    default: false,
  }
});



const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    // console.log(editor.getHTML())
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [StarterKit, Underline],
  editorProps: {
    attributes: {
      class:
        'editor-content-inside',
    },
  },
});

const firstClick = ref(true);
const toolbar = ref(false);



function showToolbar (editor)  {
  if (firstClick.value) {
    toolbar.value = !toolbar.value;
    firstClick.value = false;
  }
  editor.chain().focus().run()

}



</script>

<template>
  <div
    class="my-editor__container"
    :class="{'editor-size-big': props.size === 'big',
    'editor-size-medium': props.size === 'medium',
    }"
    @click="showToolbar(editor)"
  >

      <section
        v-if="toolbar"
        class="my-editor__button-group"
      >
        <button
          type="button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'my-editor__is-active': editor.isActive('bold') }"
          class="p-1"
        >
          <BoldIcon title="Bold" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'my-editor__is-active': editor.isActive('italic') }"
          class="p-1"
        >
          <ItalicIcon title="Italic" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'my-editor__is-active': editor.isActive('underline') }"
          class="p-1"
        >
          <UnderlineIcon title="Underline" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{
          'my-editor__is-active': editor.isActive('heading', { level: 1 }),
        }"
          class="p-1"
        >
          <H1Icon title="H1" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{
          'my-editor__is-active': editor.isActive('heading', { level: 2 }),
        }"
          class="p-1"
        >
          <H2Icon title="H2" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'my-editor__is-active': editor.isActive('bulletList') }"
          class="p-1"
        >
          <ListIcon title="Bullet List" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'my-editor__is-active': editor.isActive('orderedList') }"
          class="p-1"
        >
          <OrderedListIcon title="Ordered List" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'my-editor__is-active': editor.isActive('blockquote') }"
          class="p-1"
        >
          <BlockquoteIcon title="Blockquote" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'my-editor__is-active': editor.isActive('code') }"
          class="p-1"
        >
          <CodeIcon title="Code" />
        </button>
        <button

          type="button"
          @click="editor.chain().focus().setHorizontalRule().run()"
          class="p-1"
        >
          <HorizontalRuleIcon title="Horizontal Rule" />
        </button>
        <button
          type="button"
          class="p-1 disabled:text-gray-400"
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
        >
          <UndoIcon title="Undo" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
          class="p-1 disabled:text-gray-400"
        >
          <RedoIcon title="Redo" />
        </button>
      </section>

    <EditorContent
      :editor="editor"
      class="editor-content"
      ref="childElement"
    />
  </div>
</template>

<style>



.my-editor__container {
  border: 0;
  border-radius: 10px;
  outline: 1px solid var(--light-gray);
  padding: 10px;
  font-family: Arial, sans-serif;
  cursor: text;
}

.editor-size-big {
  min-height: 250px;
}

.editor-size-medium {
  min-height: 150px;
}

.my-editor__container:focus-within {
  outline: 2px solid rgba(0, 0, 252, .6);
}

.my-editor__button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 20px;

}

.my-editor__button-group button {
  background: var(--milk);
  border-radius: 0.5rem;
  border: none;
  color: var(--shark);
  font-family: inherit;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;

  transition: all .2s cubic-bezier(.65,.05,.36,1);
}

.my-editor__button-group button.my-editor__is-active {
  background: var(--light-violet);
  color: var(--white);
}

.editor-content-inside {
  height: 100%;
}

.editor-content-inside:focus {
  outline: none;
}




</style>
