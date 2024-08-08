<template>
    <div class="control-buttons">
        <button @click="editor?.chain().focus().toggleBold().run()">
            Bold
        </button>
        <button @click="editor?.chain().focus().toggleItalic().run()">
            Italic
        </button>
        <button @click="editor?.chain().focus().toggleUnderline().run()">
            Underline
        </button>
        <button @click="editor?.chain().focus().setTextAlign('left').run();">
            Left
        </button>
        <button @click="editor?.chain().focus().setTextAlign('center').run();">
            Center
        </button>
        <button @click="editor?.chain().focus().setTextAlign('right').run();">
            Right
        </button>
        <input
          type="color"
          @input="editor?.chain().focus().setColor($event.target.value).run()"
          :value="editor?.getAttributes('textStyle').color"
        >
    </div>
    <template v-for="shape of shapes" :key="shape.id">
        <TheRectangle :params="shape" @update-text="updateTextHandler" @active-editor="activeEditorHandler" />
    </template>
</template>

<script setup>

import TheRectangle from './components/TheRectangle.vue';

const shapes = [
    {
        "id": 1,
        "type": "rectangle",
        "x": 170,
        "y": 100,
        "width": 200,
        "height": 100,
        "color": "#FF5733",
        "borderColor": "#C70039",
        "borderStyle": 'solid',
        "zIndex": 1,
        "cornerRadius": 5,
        "borderWidth": 5,
        "rotation": 90
    },
    {
        "id": 2,
        "type": "rectangle",
        "x": 300,
        "y": 30,
        "width": 300,
        "height": 100,
        "color": "#F73",
        "borderColor": "#C70039",
        "borderStyle": 'solid',
        "zIndex": 2,
        "textVerticalAlignment": "top",
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
        "y": 177,
        "width": 200,
        "height": 100,
        "color": "#F33",
        "borderColor": "#C70039",
        "borderStyle": 'solid',
        "zIndex": 3,
        "textVerticalAlignment": "top",
        "borderWidth": 5
    }
];
let editor = undefined;

function updateTextHandler(event) {
    const { id, text } = event;
    console.log(id, text);
}

function activeEditorHandler(event) {
    editor = event;
}

</script>

<style scoped>

.control-buttons .is-active {
    background-color: #000;
    color: #fff;
}

</style>