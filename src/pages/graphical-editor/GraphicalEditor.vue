<template>
  <header class="header">
    <div class="container">
      <ControlButtons :active-shape="activeShape" @update-shape="updateShape">
        <button class="add-rectangle" @click="addNewRectangle">Add New Rectangle</button>
      </ControlButtons>
    </div>
  </header>
  <main class="canvas" @mousedown="handleCanvasClick">
    <template v-for="shape of formattedShapes" :key="shape.id">
      <TheRectangle
          :params="shape"
          @active-editor="editorActiveHandler"
          @update-shape="updateShape"
          @select-shape="handleSelectShape"
          @pointerdown="shapeActiveHandler(shape.id)"
      />
    </template>
  </main>
</template>

<script setup>
import { reactive, computed } from 'vue';
import TheRectangle from './components/TheRectangle.vue';
import ControlButtons from './components/ControlButtons.vue';
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
        "color": "#F73",
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
        "color": "#F33",
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

// Функция для генерации уникального ID для новой формы
function generateUniqueId() {
  return Math.max(...Object.keys(formattedShapes).map(id => Number(id))) + 1;
}

// Функция для добавления нового прямоугольника
function addNewRectangle() {
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
// Функция для обработки активации редактора
function editorActiveHandler(editor) {
    activeShape.editor = editor;
}

// Функция для обработки активации формы
function shapeActiveHandler(id) {
    activeShape.id = id;
}

// Функция для обновления свойств формы
function updateShape(id, key, value) {
    formattedShapes[id][key] = value;
}

// Функция для обработки выбора формы
function handleSelectShape(id) {
  activeShape.id = id;
}

// Функция для обработки клика на холсте
function handleCanvasClick(event) {
  if (!event.target.closest('.rectangle')) {
    activeShape.id = undefined;
  }
}
</script>

<style scoped>
.container {
    padding: 24px 16px 0;
    margin: 0 auto;
    max-width: 90%;
}

.control-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.add-rectangle {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.canvas {
    position: relative;
}
</style>