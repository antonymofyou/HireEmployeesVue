<template>
  <header class="header">
    <div class="container">
      <div class="header__control-buttons">
        <TextControlButtons
          v-if="windowInnerWidth < breakpoint"
          v-show="isTextMode"
          :active-shape="activeShape"
          @update-shape="updateShape"
        />
        <BlockControlButtons
          v-show="isEditMode"
          :active-shape="activeShape"
          @update-shape="updateShape"
        />
        <MainControlButtons 
          :active-shape="activeShape"
          :mode="mode"
          @update-shape="updateShape"
          @add-shape="addShape"
          @change-mode="changeModeHandler"
        />
      </div>
    </div>
  </header>
  <main class="canvas">
    <template v-for="shape of formattedShapes" :key="shape.id">
      <TheRectangle
          :params="shape"
          :mode="mode"
          :is-selected="activeShape.id == shape.id"
          @update-shape="updateShape"
          @select-shape="handleSelectShape"
      />
    </template>
    <TooltipControlButtons
      v-if="windowInnerWidth >= breakpoint"
      :active-shape="activeShape"
      :mode="mode"
    >
      <template #content>
        <TextControlButtons 
          :active-shape="activeShape"
          @update-shape="updateShape"
        />
      </template>
    </TooltipControlButtons>
  </main>
</template>

<script setup>

import { reactive, computed, ref, onBeforeUnmount } from 'vue';

import TextControlButtons from './components/control-buttons/TextControlButtons.vue';
import BlockControlButtons from './components/control-buttons/BlockControlButtons.vue';
import MainControlButtons from './components/control-buttons/MainControlButtons.vue';
import TooltipControlButtons from './components/control-buttons/TooltipControlButtons.vue';
import TheRectangle from './components/shapes/TheRectangle.vue';

const formattedShapes = reactive({
    1: {
        "id": 1,
        "type": "rectangle",
        "x": 170,
        "y": 200,
        "width": 200,
        "height": 100,
        "color": "#FF5733",
        "borderColor": "#C70039",
        "borderStyle": 'solid',
        "zIndex": 1,
        "cornerRadius": 5,
        "borderWidth": 5,
        "textVerticalAlignment": "top",
    },
    2: {
        "id": 2,
        "type": "rectangle",
        "x": 500,
        "y": 230,
        "width": 300,
        "height": 100,
        "color": "#F73324",
        "borderColor": "#C70039",
        "borderStyle": 'solid',
        "zIndex": 2,
        "textVerticalAlignment": "center",
        "text": [
            {
                "alignment": "left",
                "text": [
                    {
                        "text": "Hello",
                        "type": ["bold", "italic", "underline"],
                        "backgroundColor": "#032034",
                        "fontColor": "#fff",
                    },
                    {
                        "text": " This is a test text.",
                        "fontSize": 18,
                    }
                ]
            },
            {
                "alignment": "right",
                "text": [
                    {
                        "text": "Hello",
                        "type": ["bold"],
                        "fontColor": "#333333"
                    },
                    {
                        "text": " This is a test text.",
                        "fontSize": 18,
                        "fontColor": "#333333"
                    }
                ]
            }
        ],
        "borderWidth": 5
    },
    3: {
        "id": 3,
        "type": "rectangle",
        "x": 230,
        "y": 277,
        "width": 200,
        "height": 100,
        "color": "#F33413",
        "borderColor": "#C70039",
        "borderStyle": 'solid',
        "zIndex": 3,
        "textVerticalAlignment": "bottom",
        "borderWidth": 5
    }
});
let activeShape = reactive({
    id: undefined,
    editor: undefined,
    shape: computed(() => {
        return formattedShapes[activeShape.id];
    }),
});
/**
 * move - перемещение
 * edit - редактирование
 * text - текст
 */
let mode = reactive({
  value: 'move',
  _move: 'move',
  _edit: 'edit',
  _text: 'text',
});
const isEditMode = computed(() => {
    return mode.value === mode._edit;
});
const isTextMode = computed(() => {
    return mode.value === mode._text && !!activeShape.editor;
});
// Ширина экрана
let windowInnerWidth = ref(window.innerWidth);
// Ширина экрана при которой будет скрываться TooltipControlButtons
let breakpoint = 768;

// Функция для обновления ширины экрана
const updateWindowInnerWidth = debounce(function() {
  windowInnerWidth.value = window.innerWidth;
}, 400);

/**
 * 
 * Результат декоратора debounce(callback, delay) – это обёртка, которая откладывает вызовы callback, 
 * пока не пройдёт delay миллисекунд бездействия (без вызовов), 
 * а затем вызывает callback один раз с последними аргументами.
 * 
*/

function debounce(callback, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

window.addEventListener('resize', updateWindowInnerWidth);

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowInnerWidth);
})

// Функция для генерации уникального ID для новой формы
const generateUniqueId = () => {
  return Math.max(...Object.keys(formattedShapes).map(id => Number(id))) + 1;
}

// Функция для добавления нового прямоугольника
const addShape = () => {
  const newId = generateUniqueId();

  formattedShapes[newId] = {
    id: newId,
    type: 'rectangle',
    x: 100,
    y: 100,
    width: 150,
    height: 100,
    color: '#6aa1f3',
    borderColor: '#000000',
    borderStyle: 'solid',
    zIndex: newId,
    textVerticalAlignment: 'center',
    borderWidth: 2
  };

  activeShape.id = newId;
}

// Функция для обновления свойств формы
const updateShape = (id, key, value) => {
    formattedShapes[id][key] = value;
}

// Функция для обработки выбора формы
const handleSelectShape = ({id, editor = undefined} = {}) => {
  activeShape.id = id;
  activeShape.editor = editor;
}

// Функция для обработки изменения режима
const changeModeHandler = (event) => {
  mode.value = event;
}

</script>

<style scoped>
.container {
    padding: 24px 16px;
    margin: 0 auto;
    max-width: 90%;
}

.header__control-buttons {
  display: flex;
  gap: 48px;
}

.header__control-buttons > * {
  display: flex;
  gap: 16px;
}

.control-buttons-main {
  margin-left: auto;
}

:deep(.control-buttons-button),
:deep(.control-buttons-value-picker),
:deep(.control-buttons-color-picker),
:deep(.dropdown__trigger) {
  background-color: var(--milk);
  padding: 6px;
  border-radius: 8px;
}

:deep(.control-buttons-color-picker::before) {
  border-radius: 0 0 8px 8px;
}

:deep(svg){
  display: block;
  width: 21px;
  height: 21px;
}

:deep(.select-box-main){
  flex: 0 0 32px;
}

:deep(.control-buttons-color-picker svg) {
  fill: var(--mine-shaft) !important;
}

:deep(.control-buttons-value-picker input) {
  width: 50px;
}

.canvas {
  position: relative;
}

.tooltip-control-buttons {
  box-shadow: 0px 5px 10px 2px var(--milk);
  background-color: var(--white);
  padding: 8px;
  border-radius: 8px;
  z-index: 999;
}

.tooltip-control-buttons .control-buttons-text {
  display: flex;
  gap: 16px;
}

</style>