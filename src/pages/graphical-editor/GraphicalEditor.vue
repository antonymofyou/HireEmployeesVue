<template>
  <div
    @pointerdown="startGrabbingHandler($event) , defineTargetScale($event)"
    @pointermove="moveGrabbingHandler"
    @pointerup="cancelGrabbing"
    @contextmenu="cancelGrabbing"
    @wheel.prevent="scaleHandler"
    :style="{ cursor: isGrabbing ? 'grabbing' : 'grab' }"
    class="wrapper"
  >
    <header class="header">
      <div class="container">
        <div class="header__control-buttons">
          <TextControlButtons
            v-if="windowInnerWidth <= breakpoint"
            v-show="isTextMode && activeShape.id"
            :active-shape="activeShape"
            @update-shape="updateShape"
            @update-editor="updateEditor"
          />
          <BlockControlButtons
            v-if="windowInnerWidth <= breakpoint"
            v-show="isEditMode && activeShape.id"
            :active-shape="activeShape"
            @update-shape="updateShape"
          />
          <MainControlButtons
            :active-shape="activeShape"
            :scale="scale"
            @add-shape="addShapeHandler"
            @delete-shape="deleteShapeHandler"
            @copy-shape="copyShapeHandler"
            @update-scale="updateScaleHandler"
          />
        </div>
      </div>
    </header>
    <main :style="canvasStyle" class="canvas">
      <template v-for="shape of formattedShapes" :key="shape.id">
        <component 
            :is="shapeComponents[shape.type]"
            :params="shape"
            :mode="mode"
            :is-selected="activeShape.id == shape.id"
            @update-shape="updateShape"
            @select-shape="handleSelectShape"
            @change-mode="changeModeHandler"
          />
      </template>
      <TooltipControlButtons
        v-if="windowInnerWidth > breakpoint"
        :active-shape="activeShape"
      >
        <template #content>
          <TextControlButtons
            v-show="isTextMode"
            :active-shape="activeShape"
            @update-shape="updateShape"
            @update-editor="updateEditor"
          />
          <BlockControlButtons
            v-show="isEditMode"
            :active-shape="activeShape"
            @update-shape="updateShape"
          />
        </template>
      </TooltipControlButtons>
    </main>
  </div>
</template>

<script setup>

import {reactive, computed, ref, onBeforeUnmount, onMounted} from 'vue';

import TextControlButtons from './components/control-buttons/TextControlButtons.vue';
import BlockControlButtons from './components/control-buttons/BlockControlButtons.vue';
import MainControlButtons from './components/control-buttons/MainControlButtons.vue';
import TooltipControlButtons from './components/control-buttons/TooltipControlButtons.vue';
import TheRectangle from './components/shapes/TheRectangle.vue';
import TheArrow from './components/shapes/TheArrow.vue';

const shapeComponents = {
  'rectangle': TheRectangle,
  'arrow': TheArrow
};
const formattedShapes = reactive({
    1: {
        "id": 1,
        "type": "rectangle",
        "x": 170,
        "y": -200,
        "width": 200,
        "height": 100,
        "color": "#FF5733",
        "borderColor": "#C70039",
        "borderStyle": 'solid',
        "zIndex": 1,
        "cornerRadius": 5,
        "borderWidth": 5,
        "textVerticalAlignment": "top",
        "rotation": 0,
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
        "rotation": 100,
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
        "rotation": 0,
        "borderWidth": 5
    },
    4: {
        "id": 4,
        "type": "arrow",
        "x": 130,
        "y": 70,
        "width": 150,
        "height": 10,
        "color": "#330300",
        "zIndex": 3,
        "rotation": 0,
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
 * edit - перемещение / редактирование
 * text - текст
 */
let mode = reactive({
  value: 'edit',
  _edit: 'edit',
  _text: 'text',
});
const isEditMode = computed(() => {
    return mode.value === mode._edit;
});
const isTextMode = computed(() => {
    return mode.value === mode._text && !!activeShape.editor;
});
let isGrabbing = ref(false);
let scale = reactive({
  value: 100,
  _step: 10, // 10%
  _default: 100, // 100%
  _min: 50, // 50%
  _max: 200, // 200%
});
let xCoord = ref(0);
let yCoord = ref(0);
let xLastCoord = ref(0);
let yLastCoord = ref(0);
let aimScale = reactive({
  x: 0,
  y: 0,
});
const canvasStyle = computed(() => {
  return {
    transform: `translate(${xCoord.value}px, ${yCoord.value}px) scale(${(scale.value / 100).toFixed(1)})`,
  };
});
// Ширина экрана
let windowInnerWidth = ref(window.innerWidth);
// Высота экрана
let windowInnerHeight = ref(window.innerHeight);
// Ширина экрана при которой будет скрываться TooltipControlButtons
let breakpoint = 768;

// Функция для обновления ширины экрана
const updateWindowInnerWidth = debounce(function() {
  windowInnerWidth.value = window.innerWidth;
  windowInnerHeight.value = window.innerHeight;
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

// Добавление обработчика клика по документу
const handleDocumentClick = (event) => {
  if (
      !event.target.closest('.rectangle') &&
      !event.target.closest('.arrow-container') &&
      !event.target.closest('.control-buttons-main') &&
      !event.target.closest('.control-buttons-text') &&
      !event.target.closest('.control-buttons-block') &&
      !event.target.closest('.tooltip-control-buttons')
  ) {
    activeShape.id = null;
    activeShape.editor = undefined;
    mode.value = mode._edit;
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('resize', updateWindowInnerWidth);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
  window.removeEventListener('resize', updateWindowInnerWidth);
})

// Функция для генерации уникального ID для новой формы
const generateUniqueId = () => {
  const ids = Object.keys(formattedShapes).map(id => Number(id));

  if (ids.length > 0) {
    return Math.max(...ids) + 1;
  } else {
    return Date.now();
  }
}


// Функция для добавления нового прямоугольника
const addShapeHandler = () => {
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
    zIndex: 1,
    textVerticalAlignment: 'center',
    borderWidth: 2
  };

  handleSelectShape({
    id: newId,
  });
}

// Функция для удаления фигуры
const deleteShapeHandler = (id) => {
  handleSelectShape();

  delete formattedShapes[id];
}

// Функция для копирования активной фигуры
const copyShapeHandler = () => {
  if (!activeShape.shape) return;

  const copyShape = {
    ...activeShape.shape,
  };
  const id = generateUniqueId();

  copyShape.id = id;
  copyShape.x = 0;
  copyShape.y = 0;

  formattedShapes[id] = copyShape;

  handleSelectShape({
    id: id,
  });
}

// Функция для обновления свойств формы
const updateShape = (id, key, value) => {
    formattedShapes[id][key] = value;
}

// Функция для обработки выбора формы
const handleSelectShape = ({ id = undefined, editor = undefined } = {}) => {
  if (activeShape.id !== id && mode.value === mode._text) {
    mode.value = mode._edit;
  }

  activeShape.id = id;
  activeShape.editor = editor;
};

// Функция для обработки изменения режима
const changeModeHandler = (event) => {
  mode.value = event;
}

// Функция для обновления св-в текстового редактора
const updateEditor = (type, value) => {
  const handlers = {
    boldStyle() {
      activeShape.editor?.chain().focus().toggleBold().run();
    },
    italicStyle() {
      activeShape.editor?.chain().focus().toggleItalic().run();
    },
    underlineStyle() {
      activeShape.editor?.chain().focus().toggleUnderline().run();
    },
    colorText(color) {
      console.log(color);
      activeShape.editor?.chain().focus().setColor(color).run();
    },
    sizeText(size) {
      activeShape.editor?.chain().setFontSize(size + 'px').run();
    },
    addHighlight(color) {
      activeShape.editor?.chain().focus().setHighlight({ color: color }).run();
    },
    removeHighlight() {
      activeShape.editor?.chain().focus().unsetHighlight().run();
    },
    horizontalAlign(name) {
      activeShape.editor?.chain().focus().setTextAlign(name).run();
    },
  };
  const handler = handlers[type];

  handler(value);
}

const updateScaleHandler = (value) => {
  scale.value = value;

  xCoord.value = aimScale.x * (scale.value / 100);
  yCoord.value = aimScale.y * (scale.value / 100);
}

const startGrabbingHandler = (event) => {
  if (activeShape.id) return;

  isGrabbing.value = true;

  xLastCoord.value = event.clientX;
  yLastCoord.value = event.clientY;
}

const defineTargetScale = (event) => {
  if (
    event.target.closest('.control-buttons-main') ||
    event.target.closest('.control-buttons-text') || 
    event.target.closest('.control-buttons-block')
  ) return;

  let clientX = event.clientX;
  let clientY = event.clientY;
  let xCenter = windowInnerWidth.value / 2;
  let yCenter = windowInnerHeight.value / 2;
  let xCoordAim = 0;
  let yCoordAim = 0;

  let xOuterCanvas = xCoord.value > 0 ? 
    clientX < windowInnerWidth.value - (windowInnerWidth.value - xCoord.value) :
    clientX > windowInnerWidth.value + xCoord.value;
  let yOuterCanvas = yCoord.value > 0 ?
    clientY < windowInnerHeight.value - (windowInnerHeight.value - yCoord.value) :
    clientY > windowInnerHeight.value + yCoord.value;

  // Координаты x, y относительно canvas

  if (xCoord.value > 0 && xOuterCanvas) {
    xCoordAim = (xCoord.value - clientX) + xCenter;
  }

  if (xCoord.value <= 0 && xOuterCanvas) {
    xCoordAim = (xCoord.value + (windowInnerWidth.value - clientX)) - xCenter;
  }

  if (!xOuterCanvas) {
    xCoordAim = xCenter - (Math.abs(xCoord.value - clientX));
  }

  if (yCoord.value > 0 && yOuterCanvas) {
    yCoordAim = (yCoord.value - clientY) + yCenter
  }

  if (yCoord.value <= 0 && xOuterCanvas) {
    yCoordAim = (yCoord.value + (windowInnerHeight.value - clientY)) - yCenter;
  }

  if (!yOuterCanvas) {
    yCoordAim = yCenter - (Math.abs(yCoord.value - clientY));
  }

  aimScale.x = xCoordAim / (scale.value / 100);
  aimScale.y = yCoordAim / (scale.value / 100);
}

const cancelGrabbing = () => {
  isGrabbing.value = false;
}

const moveGrabbingHandler = (event) => {
  if (!isGrabbing.value) return;

  if (activeShape.id) {
    cancelGrabbing();

    return;
  }

  xCoord.value += event.clientX - xLastCoord.value;
  yCoord.value += event.clientY - yLastCoord.value;

  xLastCoord.value = event.clientX;
  yLastCoord.value = event.clientY;
}

function scaleHandler(event) {
  let delta = event.deltaY || event.detail || event.wheelDelta;

  if (delta > 0) {
    updateScaleHandler(scale.value >= scale._max ? scale.value : scale.value + scale._step);

    return;
  }

  updateScaleHandler(scale.value <= scale._min ? scale.value : scale.value - scale._step);
}

</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.canvas {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: .15s transform;
}

.container {
  padding: 24px 16px;
  margin: 0 auto;
}

.header__control-buttons {
  display: flex;
  align-items: flex-start;
  gap: 16px 48px;
}

.header .control-buttons-main ,
.header .control-button-text ,
.header .control-buttons-block {
  position: relative;
  z-index: 999;
}

.header__control-buttons > * {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.control-buttons-main {
  margin-left: auto;
}

:deep(.control-buttons-button),
:deep(.control-buttons-value-picker),
:deep(.dropdown__trigger) {
  background-color: var(--milk);
  padding: 6px;
  border-radius: 8px;
}

:deep(.material-design-icon__svg){
  display: block;
  width: 21px;
  height: 21px;
  transition: .2s color;
}

:deep(.control-buttons-value-picker input) {
  width: 50px;
}

:deep(.select-box-main){
  flex: 0 0 32px;
}

:deep(.dropdown .dropdown__content),
:deep(.select-box-main .options-container-main) {
    display: flex;
    gap: 8px;
    box-shadow: 0px 2.5px 5px 1px rgba(34, 60, 80, 0.2);
    border: none;
    background-color: var(--milk);
    padding: 6px;
    border-radius: 8px;
}

.tooltip-control-buttons {
  box-shadow: 0px 5px 10px 2px var(--milk);
  background-color: var(--white);
  padding: 8px;
  border-radius: 8px;
  z-index: 999;
}

.tooltip-control-buttons .control-buttons-text,
.tooltip-control-buttons .control-buttons-block {
  display: flex;
  gap: 16px;
}

@media (max-width: 768px) {
  .header__control-buttons,
  .header__control-buttons > * {
    gap: 8px;
  }

  .control-buttons-main {
    flex-direction: column;
    align-items: flex-end;
  }

  :deep(.dropdown .dropdown__content),
  :deep(.select-box-main .options-container-main) {
    flex-direction: column;
    max-width: max-content !important;
  }

  :deep(.control-buttons-value-picker input) {
    width: 40px;
  }

}

@media (hover: hover) and (pointer: fine) {
  :deep(.control-button),
  :deep(.dropdown__trigger),
  :deep(.value-picker),
  :deep(.selected-main),
  :deep(.option-main) {
    transition: box-shadow .2s;
  }

  :deep(.control-button:hover),
  :deep(.dropdown__trigger:hover),
  :deep(.value-picker:hover),
  :deep(.selected-main:hover),
  :deep(.option-main:hover) {
    box-shadow: 0px 2.5px 5px 1px rgba(34, 60, 80, 0.2);
  }
}

</style>