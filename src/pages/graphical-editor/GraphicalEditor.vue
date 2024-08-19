<template>
  <header class="header">
    <div class="container">
      <ControlButtons 
        :active-shape="activeShape"
        :mode="mode"
        @update-shape="updateShape"
        @add-shape="addShape"
        @change-mode="changeModeHandler"
      />
    </div>
  </header>
  <main class="canvas">
    <template v-for="shape of formattedShapes" :key="shape.id">
      <TheRectangle
          :params="shape"
          :mode="mode"
          @update-shape="updateShape"
          @select-shape="handleSelectShape"
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
    padding: 24px 16px 0;
    margin: 0 auto;
    max-width: 90%;
}

.canvas {
    position: relative;
}
</style>