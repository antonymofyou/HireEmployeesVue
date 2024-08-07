<template>
    <ul class="control-buttons">
        <li v-for="button of controlButtons" :key="button.key">
            <button @pointerdown="button.handler" @keydown.enter.space="handler" class="control-buttons__button">
                <component :is="button.icon" />
            </button>
        </li>
    </ul>
    <template v-for="shape of shapes" :key="shape.id">
        <TheRectangle @editor-active="editorActiveHandler" :params="shape" />
    </template>
</template>

<script setup>

import TheRectangle from './components/TheRectangle.vue';

import BoldIcon from 'vue-material-design-icons/FormatBold.vue'
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue'
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue'

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
const controlButtons = [
    {
        key: 'bold',
        icon: BoldIcon,
        handler() {
            editor?.chain().focus().toggleBold().run();
        }
    },
    {
        key: 'italic',
        icon: ItalicIcon,
        handler() {
            editor?.chain().focus().toggleItalic().run();
        }
    },
    {
        key: 'underline',
        icon: UnderlineIcon,
        handler() {
            editor?.chain().focus().toggleUnderline().run();
        }
    }
];

function editorActiveHandler(event) {
    editor = event;
}

</script>

<style scoped>

.control-buttons {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
}

.control-buttons__button {
  background: var(--milk);
  border-radius: 0.5rem;
  border: none;
  color: var(--shark);
  font-family: inherit;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;
  cursor: pointer;
  transition: all .2s cubic-bezier(.65,.05,.36,1);
}


</style>