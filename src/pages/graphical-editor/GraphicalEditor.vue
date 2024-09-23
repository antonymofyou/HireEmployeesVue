<template>
  <div
    @pointerdown="startGrabbingHandler"
    @pointermove="moveGrabbingHandler"
    @pointerup="cancelGrabbing"
    @mousemove="defineTargetScale"
    @contextmenu="cancelGrabbing"
    @wheel.prevent="scaleHandler"
    :style="{ cursor: isGrabbing ? 'grabbing' : 'grab' }"
    class="wrapper"
  >
    <header class="header">
      <div class="container">
        <div class="header__control-buttons">
          <StyleControlButtons
            v-if="windowInnerWidth <= breakpoint"
            :active-shape="activeShape"
            :mode="mode"
            :shapes="nameShapes"
            @update-shape="updateShape"
            @update-editor="updateEditor"
            class="style-control-buttons"
          />
          <CanvasControlButtons 
            :active-shape="activeShape"
            :scale="scale"
            @add-shape="addShapeHandler"
            @delete-shape="deleteShapeHandler"
            @copy-shape="copyShapeHandler"
            @update-scale="updateScaleHandler"
            class="canvas-control-buttons"
          />
        </div>
      </div>
    </header>
    <main :style="canvasStyle" class="canvas">
      <template v-for="shape of formattedShapes" :key="shape.id">
        <component 
            :is="shapes[shape.type].component"
            :params="shape"
            :mode="mode"
            :is-selected="activeShape.id == shape.id"
            @update-shape="updateShape"
            @select-shape="handleSelectShape"
            @change-mode="changeModeHandler"
            class="shape"
          />
      </template>
      <TooltipControlButtons
        v-if="windowInnerWidth > breakpoint"
        :active-shape="activeShape"
        :scale="scale.value / 100"
      >
        <template #content>
          <StyleControlButtons
            :active-shape="activeShape"
            :mode="mode"
            :shapes="nameShapes"
            @update-shape="updateShape"
            @update-editor="updateEditor"
            class="style-control-buttons"
          />
        </template>
      </TooltipControlButtons>
    </main>
  </div>
</template>

<script setup>

import {reactive, computed, ref, onBeforeUnmount, onMounted, watch} from 'vue';

import StyleControlButtons from './components/control-buttons/StyleControlButtons.vue';
import CanvasControlButtons from './components/control-buttons/CanvasControlButtons.vue';
import TooltipControlButtons from './components/control-buttons/TooltipControlButtons.vue';
import TheRectangle from './components/shapes/TheRectangle.vue';
import TheArrow from './components/shapes/TheArrow.vue';
import TheTable from './components/shapes/TheTable.vue';
import debounce from './assets/js/debounce';

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
        "padding": 10,
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
        "borderWidth": 5,
        "padding": 10,
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
        "borderWidth": 5,
        "padding": 10,
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
    },
    5: {
        "id": 5,
        "type": "table",
        "x": 870,
        "y": 300,
        "width": 500,
        "height": 100,
        "zIndex": 1,
        "table": {
          "type": "doc",
          "from": 0,
          "to": 82,
          "content": [
            {
              "type": "table",
              "from": 0,
              "to": 80,
              "content": [
                {
                  "type": "tableRow",
                  "from": 1,
                  "to": 26,
                  "content": [
                    {
                      "type": "tableHeader",
                      "from": 2,
                      "to": 10,
                      "attrs": {
                        "colspan": 1,
                        "rowspan": 1,
                        "colwidth": null
                      },
                      "content": [
                        {
                          "type": "paragraph",
                          "from": 3,
                          "to": 9,
                          "content": [
                            {
                              "type": "text",
                              "from": 4,
                              "to": 8,
                              "text": "Name"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "tableHeader",
                      "from": 10,
                      "to": 25,
                      "attrs": {
                        "colspan": 3,
                        "rowspan": 1,
                        "colwidth": null
                      },
                      "content": [
                        {
                          "type": "paragraph",
                          "from": 11,
                          "to": 24,
                          "content": [
                            {
                              "type": "text",
                              "from": 12,
                              "to": 23,
                              "text": "Description"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "tableRow",
                  "from": 26,
                  "to": 79,
                  "content": [
                    {
                      "type": "tableCell",
                      "from": 27,
                      "to": 43,
                      "attrs": {
                        "colspan": 1,
                        "rowspan": 1,
                        "colwidth": null
                      },
                      "content": [
                        {
                          "type": "paragraph",
                          "from": 28,
                          "to": 42,
                          "content": [
                            {
                              "type": "text",
                              "from": 29,
                              "to": 41,
                              "text": "Cyndi Lauper"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "tableCell",
                      "from": 43,
                      "to": 53,
                      "attrs": {
                        "colspan": 1,
                        "rowspan": 1,
                        "colwidth": null
                      },
                      "content": [
                        {
                          "type": "paragraph",
                          "from": 44,
                          "to": 52,
                          "content": [
                            {
                              "type": "text",
                              "from": 45,
                              "to": 51,
                              "text": "Singer"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "tableCell",
                      "from": 53,
                      "to": 67,
                      "attrs": {
                        "colspan": 1,
                        "rowspan": 1,
                        "colwidth": null
                      },
                      "content": [
                        {
                          "type": "paragraph",
                          "from": 54,
                          "to": 66,
                          "content": [
                            {
                              "type": "text",
                              "from": 55,
                              "to": 65,
                              "text": "Songwriter"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "tableCell",
                      "from": 67,
                      "to": 78,
                      "attrs": {
                        "colspan": 1,
                        "rowspan": 1,
                        "colwidth": null
                      },
                      "content": [
                        {
                          "type": "paragraph",
                          "from": 68,
                          "to": 77,
                          "content": [
                            {
                              "type": "text",
                              "from": 69,
                              "to": 76,
                              "text": "Actress"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        } 
    },
});
const shapes = {
  rectangle: {
    name: 'rectangle',
    component: TheRectangle,
  },
  arrow: {
    name: 'arrow',
    component: TheArrow,
  },
  table: {
    name: 'table',
    component: TheTable,
  }
};
const nameShapes = Object.keys(shapes).reduce((acc, item) => {
  acc[item] = shapes[item].name;

  return acc;
}, {});
let activeShape = reactive({
    id: undefined,
    editor: undefined,
    shape: computed(() => {
        return formattedShapes[activeShape.id];
    }),
});
let mode = reactive({
  value: 'edit',
  _edit: 'edit', // перемещение , поворот и т.п.
  _shape: 'shape', // редактирование фигуры
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

// Добавление обработчика клика по документу
const handleDocumentClick = (event) => {
  if (
      !event.target.closest('.rectangle') &&
      !event.target.closest('.table') &&
      !event.target.closest('.arrow-container') &&
      !event.target.closest('.control-buttons')
  ) {
    activeShape.id = null;
    activeShape.editor = undefined;
    mode.value = mode._edit;
  }
};

// Функция для обработки выбора формы
const handleSelectShape = ({ id = undefined, editor = undefined } = {}) => {
  if (activeShape.id == id) return;

  activeShape.id = id;
  activeShape.editor = editor;
  mode.value = mode._edit;
};

// Функция для обработки изменения режима
const changeModeHandler = (event) => {
  mode.value = event;
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('resize', updateWindowInnerWidth);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
  window.removeEventListener('resize', updateWindowInnerWidth);
})

/**
 * 
 * Логика масштабирования
 * 
*/

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
  shape: undefined,
  x: 0,
  y: 0,
});
const canvasStyle = computed(() => {
  return {
    transform: `translate(${xCoord.value}px, ${yCoord.value}px) scale(${(scale.value / 100).toFixed(1)})`,
  };
});

// Обработчик обновления значения масштабиирования
const updateScaleHandler = (value) => {  
  scale.value = value;
}

// Функция для определения точки масштабирования
const defineTargetScale = (event) => {
  const shape = event.target.closest('.shape');

  if (!shape) {
    aimScale.shape = undefined;
    aimScale.x = 0;
    aimScale.y = 0;

    return;
  }

  if (aimScale.shape == shape) return;

  const clientX = event.clientX;
  const clientY = event.clientY;
  const xCenter = windowInnerWidth.value / 2;
  const yCenter = windowInnerHeight.value / 2;
  let xOuterCanvas = xCoord.value > 0 ? 
    clientX < windowInnerWidth.value - (windowInnerWidth.value - xCoord.value) :
    clientX > windowInnerWidth.value + xCoord.value;
  let yOuterCanvas = yCoord.value > 0 ?
    clientY < windowInnerHeight.value - (windowInnerHeight.value - yCoord.value) :
    clientY > windowInnerHeight.value + yCoord.value;
  let xCoordAim = 0;
  let yCoordAim = 0;

  aimScale.shape = shape;

  if (xCoord.value > 0 && xOuterCanvas) {
    xCoordAim = xCoord.value + ((xCenter - clientX));
  }

  if (xCoord.value <= 0 && xOuterCanvas) {
    xCoordAim = xCoord.value - ((xCenter - (windowInnerWidth.value - clientX)));
  }

  if (!xOuterCanvas) {
    xCoordAim = xCenter - (Math.abs(xCoord.value - clientX));
  }

  if (yCoord.value > 0 && yOuterCanvas) {
    yCoordAim = yCoord.value + ((yCenter - clientY));
  }

  if (yCoord.value <= 0 && xOuterCanvas) {
    yCoordAim = yCoord.value - ((yCenter - (windowInnerHeight.value - clientY)));
  }

  if (!yOuterCanvas) {
    yCoordAim = yCenter - (Math.abs(yCoord.value - clientY));
  }

  aimScale.x = xCoordAim / (scale.value / 100);
  aimScale.y = yCoordAim / (scale.value / 100);
}

// Обработчик начала перемещения
const startGrabbingHandler = (event) => {
  if (activeShape.id) return;

  isGrabbing.value = true;

  xLastCoord.value = event.clientX;
  yLastCoord.value = event.clientY;
}

// Обработчик завершения перемещения
const cancelGrabbing = () => {
  isGrabbing.value = false;
}

// Обработчик перемещения
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

// Обработчик масштабирования по колесику мыши
const scaleHandler = (event) => {
  let delta = event.deltaY || event.detail || event.wheelDelta;

  if (delta > 0) {
    updateScaleHandler(scale.value >= scale._max ? scale.value : scale.value + scale._step);

    return;
  }

  updateScaleHandler(scale.value <= scale._min ? scale.value : scale.value - scale._step);
}

watch(() => scale.value, function(newScale, prevScale) {
  if (!aimScale.shape) {
    aimScale.x = xCoord.value / (prevScale / 100);
    aimScale.y = yCoord.value / (prevScale / 100);
  }

  xCoord.value = aimScale.x * (newScale / 100);
  yCoord.value = aimScale.y * (newScale / 100);
});

/**
 * 
 * Обработчики кнопок управления
 * 
*/

// Функция для генерации уникального ID новой фигуры
const generateUniqueId = () => {
  const ids = Object.keys(formattedShapes).map(id => Number(id));

  if (ids.length > 0) {
    return Math.max(...ids) + 1;
  } else {
    return Date.now();
  }
}

// Обработчик добавления новой фигуры
const addShapeHandler = (type, options) => {
  const newId = generateUniqueId();
  const shape = {
    arrow() {
      return {
        id: newId,
        type: shapes.arrow.name,
        x: 0,
        y: 0,
        width: 150,
        height: 10,
        color: '#000000',
        zIndex: 1,
      }
    },
    rectangle() {
      return {
        id: newId,
        type: shapes.rectangle.name,
        x: 0,
        y: 0,
        width: 150,
        height: 100,
        color: '#000000',
        zIndex: 1,
        padding: 10,
      }
    },
    table(options) {
      const { table } = options;

      return {
        id: newId,
        type: shapes.table.name,
        x: 900,
        y: 600,
        width: 150,
        height: 100,
        zIndex: 1,
        table,
      }
    }
  };

  formattedShapes[newId] = shape[type](options);

  handleSelectShape({
    id: newId,
  });
}

// Обработчик удаления фигуры
const deleteShapeHandler = (id) => {
  handleSelectShape();

  delete formattedShapes[id];
}

// Обработчик копирования активной фигуры
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

// Функция для обновления свойств фигуры
const updateShape = (id, key, value) => {
    formattedShapes[id][key] = value;
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
      activeShape.editor?.chain().focus().setColor(color).blur().run();
    },
    sizeText(size) {
      activeShape.editor?.chain().setFontSize(size + 'px').run();
    },
    addHighlight(color) {
      activeShape.editor?.chain().focus().setHighlight({ color: color }).blur().run();
    },
    removeHighlight() {
      activeShape.editor?.chain().focus().unsetHighlight().blur().run();
    },
    horizontalAlign(name) {
      activeShape.editor?.chain().focus().setTextAlign(name).run();
    },
    addColumnBefore() {
      activeShape.editor?.chain().focus().addColumnBefore().run();
    },
    addColumnAfter() {
      activeShape.editor?.chain().focus().addColumnAfter().run();
    },
    deleteColumn() {
      activeShape.editor?.chain().focus().deleteColumn().run();
    },
    addRowBefore() {
      activeShape.editor?.chain().focus().addRowBefore().run();
    },
    addRowAfter() {
      activeShape.editor?.chain().focus().addRowAfter().run();
    },
    deleteRow() {
      activeShape.editor?.chain().focus().deleteRow().run();
    },
    mergeCells() {
      activeShape.editor?.chain().focus().mergeCells().run();
    },
    splitCell() {
      activeShape.editor?.chain().focus().splitCell().run();
    }
  };
  const handler = handlers[type];

  handler(value);
}

</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  touch-action: none;
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

.tooltip-control-buttons {
  box-shadow: 0px 5px 10px 2px var(--milk);
  background-color: var(--white);
  padding: 8px;
  border-radius: 8px;
  z-index: 999;
}

/* Общие стили для кнопок управления */

.control-buttons {
  position: relative;
  z-index: 999;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
}

.canvas-control-buttons {
  margin-left: auto;
}

.canvas-control-buttons:deep(.dropdown .dropdown__content) {
  bottom: -8px;
  transform: translateY(100%) translateX(-50%);
  left: 50%;
}

.style-control-buttons:deep(.dropdown .dropdown__content),
.style-control-buttons:deep(.select-box-main .options-container-main) {
  top: -8px;
  left: 50% !important;
  transform: translateY(-100%) translateX(-50%);
}

.control-buttons:deep(.control-button),
.control-buttons:deep(.value-picker),
.control-buttons:deep(.dropdown__trigger) {
  background-color: var(--milk);
  padding: 6px;
  border-radius: 8px;
}

.control-buttons:deep(.material-design-icon__svg){
  display: block;
  width: 21px;
  height: 21px;
  transition: .2s color;
}

.control-buttons:deep(.value-picker input) {
  width: 50px;
}

.control-buttons:deep(.select-box-main){
  flex: 0 0 32px;
}

.control-buttons:deep(.dropdown .dropdown__content),
.control-buttons:deep(.select-box-main .options-container-main) {
  display: flex;
  gap: 8px;
  box-shadow: 0px 2.5px 5px 1px rgba(34, 60, 80, 0.2);
  border: none;
  background-color: var(--milk);
  padding: 6px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .control-buttons {
    gap: 8px;
  }

  .canvas-control-buttons {
    flex-direction: column;
    align-items: flex-end;
  }

  .style-control-buttons:deep(.dropdown .dropdown__content),
  .style-control-buttons:deep(.select-box-main .options-container-main) {
    flex-direction: column;
    max-width: max-content !important;
    top: auto;
    bottom: -8px;
    transform: translateY(100%) translateX(-50%);
  }

  .canvas-control-buttons:deep(.dropdown .dropdown__content),
  .canvas-control-buttons:deep(.select-box-main .options-container-main) {
    bottom: 50%;
    transform: translateY(50%) translateX(-100%);
    left: -8px;
  }

  .control-buttons:deep(.value-picker input) {
    width: 40px;
  }
}


/*

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
} */

</style>