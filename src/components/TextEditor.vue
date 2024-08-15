<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

import BoldIcon from 'vue-material-design-icons/FormatBold.vue';
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue';
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue';
import H1Icon from 'vue-material-design-icons/FormatHeader1.vue';
import H2Icon from 'vue-material-design-icons/FormatHeader2.vue';
import ListIcon from 'vue-material-design-icons/FormatListBulleted.vue';
import OrderedListIcon from 'vue-material-design-icons/FormatListNumbered.vue';
import BlockquoteIcon from 'vue-material-design-icons/FormatQuoteClose.vue';
import HorizontalRuleIcon from 'vue-material-design-icons/Minus.vue';
import UndoIcon from 'vue-material-design-icons/Undo.vue';
import RedoIcon from 'vue-material-design-icons/Redo.vue';

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
  },
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  extensions: [StarterKit, Underline],
  editorProps: {
    attributes: {
      class: 'text-editor-content-inside',
    },
  },
});
</script>

<template>
  <div v-if="props.label" class="text-editor__label">
    {{ props.label }}
  </div>
  <div
    :id="id"
    class="text-editor__container"
    :class="{
      'text-editor-size-big': props.size === 'big',
      'text-editor-size-medium': props.size === 'medium',
    }"
    @click="editor.chain().focus().run()"
  >
    <section class="text-editor__button-group">
      <button
        type="button"
        :class="{ 'text-editor__is-active': editor?.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <BoldIcon title="Bold" />
      </button>
      <button
        type="button"
        :class="{ 'text-editor__is-active': editor?.isActive('italic') }"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <ItalicIcon title="Italic" />
      </button>
      <button
        type="button"
        :class="{ 'text-editor__is-active': editor?.isActive('underline') }"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <UnderlineIcon title="Underline" />
      </button>
      <button
        type="button"
        :class="{
          'text-editor__is-active': editor?.isActive('heading', { level: 1 }),
        }"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <H1Icon title="H1" />
      </button>
      <button
        type="button"
        :class="{
          'text-editor__is-active': editor?.isActive('heading', { level: 2 }),
        }"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <H2Icon title="H2" />
      </button>
      <button
        type="button"
        :class="{ 'text-editor__is-active': editor?.isActive('bulletList') }"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <ListIcon title="Bullet List" />
      </button>
      <button
        type="button"
        :class="{ 'text-editor__is-active': editor?.isActive('orderedList') }"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <OrderedListIcon title="Ordered List" />
      </button>
      <button
        type="button"
        :class="{ 'text-editor__is-active': editor?.isActive('blockquote') }"
        @click="editor?.chain().focus().toggleBlockquote().run()"
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
        :disabled="!editor?.can().chain().focus().undo().run()"
        @click="editor?.chain().focus().undo().run()"
      >
        <UndoIcon title="Undo" />
      </button>
      <button
        type="button"
        :disabled="!editor?.can().chain().focus().redo().run()"
        @click="editor?.chain().focus().redo().run()"
      >
        <RedoIcon title="Redo" />
      </button>
    </section>
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
.text-editor__label {
  margin-bottom: 10px;
  font-weight: 600;
}

.text-editor__container {
  cursor: text;

  padding: 10px;

  font-family: Arial, sans-serif;

  border: 0;
  border-radius: 10px;
  outline: 1px solid var(--light-gray);
}

.text-editor__container blockquote {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 3px solid var(--light-gray);
}

.text-editor__container code {
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;

  font-family: JetBrainsMono, monospace;
  color: var(--white);

  background: var(--shark);
  border-radius: 0.5rem;
}

.text-editor-size-big {
  min-height: 250px;
}

.text-editor-size-medium {
  min-height: 150px;
}

.text-editor__container:focus-within {
  outline: 2px solid rgb(0 0 252 / 60%);
}

.text-editor__button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 20px;
}

.text-editor__button-group button {
  cursor: pointer;

  margin: 0;

  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.15;
  color: var(--shark);

  background: var(--milk);
  border: none;
  border-radius: 0.5rem;

  transition: all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);
}

.text-editor__button-group button.text-editor__is-active {
  color: var(--white);
  background: var(--light-violet);
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
