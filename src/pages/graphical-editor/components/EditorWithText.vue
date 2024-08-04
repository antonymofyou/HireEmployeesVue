<template>
  <div id="my-toolbar">
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-strike"></button>
    <button @click="callbacks.saveText" class="save">Save</button>
  </div>

  <v-stage ref="konvaRef" :config="stageConfig">
    <v-layer>
      <v-group
        :config="{
          draggable: true,
          width: 150,
          height: 150,
        }"
        @dblclick="callbacks.startInputText"
        @click="callbacks.startTransform"
      >
        <v-rect
          :config="{
            height: 150,
            width: 150,
            fill: '#00ff00',
          }"
        />
        <v-image
          :config="{
            height: 150,
            width: 150,
          }"
          ref="imageRef"
        />
      </v-group>

      <v-transformer ref="transformerRef" />
    </v-layer>
  </v-stage>

  <QuillEditor ref="textEditorRef" toolbar="#my-toolbar"></QuillEditor>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import html2canvas from 'html2canvas';
import { JSONToHTML, HTMLToJSON } from 'html-to-json-parser';

const stageConfig = {
  width: window.innerWidth,
  height: 300,
};

// Ссылка на ноду редактора
const textEditorRef = ref(null);
// Ссылка на канву
const konvaRef = ref(null);
// Ссылка на картинку в канве
const imageRef = ref(null);
// Ссылка на трансформер
const transformerRef = ref(null);

// Вводим ли сейчас текст
const isTextInputNow = ref(false);

// Убираем редактор, когда текст не вводится
watchEffect(() => {
  if (!textEditorRef.value) return;

  // Нода редактора
  const editor = textEditorRef.value.getEditor();
  if (!isTextInputNow.value) editor.style.display = 'none';
});

// Убираем проверку орфографии
watch(textEditorRef, () => {
  if (!textEditorRef.value) return;
  textEditorRef.value.getEditor().setAttribute('spellcheck', 'false');
});

const callbacks = {
  /**
   * Начать процесс ввода текста
   * @param {Object} e - Событие
   */
  startInputText: (e) => {
    // Группа, в которой находится фигура
    const group = e.target.parent;
    // Фигура
    const shape = group.children[0];
    // Картинка
    const image = group.children.at(-1);
    // Нода редактора
    const editor = textEditorRef.value.getEditor();

    // Координаты группы относительно канвы
    const groupAbsolutePosition = group.getAbsolutePosition();

    // Координаты канвы относительно документа
    const stageDocumentPosition = konvaRef.value.getStage().container().getBoundingClientRect();

    // Координаты группы относительно всего документа
    const groupDocumentPosition = {
      x: window.scrollX + stageDocumentPosition.x + groupAbsolutePosition.x,
      y: window.scrollY + stageDocumentPosition.y + groupAbsolutePosition.y,
    };

    isTextInputNow.value = true;
    image.image(null);

    // Показываем редактор на фигуре
    editor.style.display = 'block';
    editor.style.position = 'absolute';
    editor.style.width = shape.width() + 'px';
    editor.style.height = shape.height() + 'px';
    editor.style.left = groupDocumentPosition.x + 'px';
    editor.style.top = groupDocumentPosition.y + 'px';
  },

  /**
   * Сохранить текст
   */
  saveText: async () => {
    const editor = textEditorRef.value.getEditor();
    const html = textEditorRef.value.getHTML(); 
    const json = await HTMLToJSON(html);
    
    const canvas = await html2canvas(editor, {
      backgroundColor: 'rgba(0,0,0,0)',
    });
    imageRef.value.getNode().image(canvas);
    isTextInputNow.value = false;
  },

  /**
   * Начать трансформацию
   * @param {Object} e - Событие
   */
  startTransform: (e) => {
    const group = e.target.parent;
    const shape = group.children[0];

    transformerRef.value.getNode().nodes([group]);

    group.on('transform', () => {
      console.log(group.width(), group.height(), group.scaleX(), group.scaleY());

      const correctWidth = group.width() * group.scaleX();
      const correctHeight = group.height() * group.scaleY();
      
      group.width(correctWidth);
      group.height(correctHeight);
      
      shape.width(correctWidth);
      shape.height(correctHeight);

      group.scaleX(1);
      group.scaleY(1);
    });
  },
};
</script>

<style scoped>
.sep {
  height: 300px;
  background: #ff0000;
}
</style>
