<template>
    <header class="header">
        <div class="container">
            <ControlButtons :active-shape="activeShape" @update-shape="updateShape" />
        </div>
    </header>
    <main class="canvas">
        <template v-for="shape of formattedShapes" :key="shape.id">
            <TheRectangle 
                :params="shape" 
                @active-editor="editorActiveHandler" 
                @update-shape="updateShape" 
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

function editorActiveHandler(editor) {
    activeShape.editor = editor;
}

function shapeActiveHandler(id) {
    activeShape.id = id;
}

function updateShape(id, key, value) {
    formattedShapes[id][key] = value;
}

</script>

<style scoped>

.header {
    border-bottom: 1px solid var(--transparent-blue);
}

.container {
    padding: 24px 16px;
    margin: 0 auto;
    max-width: 90%;
}

.control-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.canvas {
    position: relative;
}

</style>