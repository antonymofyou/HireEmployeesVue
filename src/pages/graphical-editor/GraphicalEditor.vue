<template>
    <div class="control-buttons">
        <div class="control-buttons__text">
            <ControlButton 
                class="control-buttons__button" 
                :disabled="!activeShape.editor"
                :active="activeShape.editor?.isActive('bold')"
                @click="activeShape.editor?.chain().focus().toggleBold().run()"
            >
                <BoldIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="!activeShape.editor"
                :active="activeShape.editor?.isActive('italic')"
                @click="activeShape.editor?.chain().focus().toggleItalic().run()"
            >
                <ItalicIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="!activeShape.editor"
                :active="activeShape.editor?.isActive('underline')"
                @click="activeShape.editor?.chain().focus().toggleUnderline().run()"
            >
                <UnderlineIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="!activeShape.editor"
                :active="activeShape.editor?.isActive({'textAlign': 'left'})"
                @click="activeShape.editor?.chain().focus().setTextAlign('left').run()"
            >
                <AlignLeftIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="!activeShape.editor"
                :active="activeShape.editor?.isActive({'textAlign': 'center'})"
                @click="activeShape.editor?.chain().focus().setTextAlign('center').run()"
            >
                <AlignCenterIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="!activeShape.editor"
                :active="activeShape.editor?.isActive({'textAlign': 'right'})"
                @click="activeShape.editor?.chain().focus().setTextAlign('right').run()"
            >
                <AlignRightIcon />
            </ControlButton>
            <ColorPicker
                class="control-buttons__color-picker"
                :disabled="!activeShape.editor"
                :color="activeShape.editor?.getAttributes('textStyle').color || '#000'"
                @update:color="activeShape.editor?.chain().focus().setColor($event).run()"
            />
            <FontSizePicker 
                class="control-buttons__font-size-picker"
                :disabled="!activeShape.editor"
                :font-size="activeShape.editor?.getAttributes('textStyle').fontSize || 16"
                @update:font-size="activeShape.editor?.chain().focus().setFontSize($event + 'px').run()"            
            />
        </div>
    </div>
    <template v-for="shape of shapes" :key="shape.id">
        <TheRectangle :params="shape" @active-editor="activeEditorHandler" />
    </template>
</template>

<script setup>

import { reactive } from 'vue';

import TheRectangle from './components/TheRectangle.vue';
import ControlButton from './components/ControlButton.vue';
import ColorPicker from './components/ColorPicker.vue';
import FontSizePicker from './components/FontSizePicker.vue';

import BoldIcon from 'vue-material-design-icons/FormatBold.vue'
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue'
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue'
import AlignCenterIcon from 'vue-material-design-icons/FormatAlignCenter.vue'
import AlignLeftIcon from 'vue-material-design-icons/FormatAlignLeft.vue'
import AlignRightIcon from 'vue-material-design-icons/FormatAlignRight.vue'

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
        "rotation": 90
    },
    {
        "id": 2,
        "type": "rectangle",
        "x": 300,
        "y": 130,
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
        "y": 277,
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
let activeShape = reactive({
    editor: undefined,
});

function activeEditorHandler(editor) {
    activeShape.editor = editor;
}

</script>

<style scoped>

.control-buttons__text {
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-buttons__button span{
    display: block;
    width: 24px;
    height: 24px;
}

.control-buttons__button svg {
    width: 100%;
    height: 100%;
}

.control-buttons__color-picker {
    width: 40px;
    height: 40px;
}

.control-buttons__font-size-picker {
    width: 70px;
    font-size: 20px;
}

</style>