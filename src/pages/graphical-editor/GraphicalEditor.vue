<template>
    <header class="header">
        <div class="container">
            <ControlButtons :active-shape="activeShape" />
        </div>
    </header>
    <main>
        <template v-for="shape of shapes" :key="shape.id">
            <TheRectangle @click="activeShape.id = shape.id" :params="shape" @active-editor="activeEditorHandler" />
        </template>
    </main>
</template>

<script setup>

import { reactive, computed } from 'vue';

import TheRectangle from './components/TheRectangle.vue';
import ControlButtons from './components/ControlButtons.vue';

const shapes = [
    {
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
        "rotation": 90,
        "textVerticalAlignment": "top",
    },
    {
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
        "text": {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "testo3920fkdl"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ],
                            "text": "fkldkfdl"
                        },
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "bold"
                                },
                                {
                                    "type": "italic"
                                }
                            ],
                            "text": "fkldfkld"
                        },
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "bold"
                                },
                                {
                                    "type": "italic"
                                },
                                {
                                    "type": "underline"
                                }
                            ],
                            "text": "fkldkfdl"
                        },
                        {
                            "type": "text",
                            "text": "fdkllfkd"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "aaaaaaaaa"
                        }
                    ]
                }
            ]
        },
        "borderWidth": 5
    },
    {
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
];
let activeShape = reactive({
    id: undefined,
    editor: undefined,
    shape: computed(() => {
        return shapes.filter(shape => shape.id == activeShape.id)[0];
    }),
    
});

function activeEditorHandler(editor) {
    activeShape.editor = editor;
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

</style>