<template>
    <div class="control-buttons">
        <div class="control-buttons__item control-buttons__item_text">
            <ControlButton 
                class="control-buttons__button"
                :disabled="!isTextMode"
                :active="props.activeShape.editor?.isActive('bold') && isTextMode"
                @click="controlButtonsHandlers['bold']"
            >
                <BoldIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button"
                :disabled="!isTextMode"
                :active="props.activeShape.editor?.isActive('italic') && isTextMode"
                @click="controlButtonsHandlers['italic']"
            >
                <ItalicIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button"
                :disabled="!isTextMode"
                :active="props.activeShape.editor?.isActive('underline') && isTextMode"
                @click="controlButtonsHandlers['underline']"
            >
                <UnderlineIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button control-buttons__button_color"
                :disabled="!isTextMode"
                @click="controlButtonsHandlers['textColor']"
                :style="{ color: mainColor }"
            >
                <FormatText />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button control-buttons__button_color"
                :disabled="!isTextMode"
                @click="controlButtonsHandlers['highlightAdd']"
                :style="{ color: mainColor }"
            >
                <Marker />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button"
                :disabled="!isTextMode"
                @click="controlButtonsHandlers['highlightRemove']"
            >
                <MarkerCancel />
            </ControlButton>
            <ValuePicker
                class="control-buttons__button control-buttons__value-picker"
                :disabled="!isTextMode"
                :value="parseInt(props.activeShape.editor?.getAttributes('textStyle').fontSize) || 16"
                @update:value="controlButtonsHandlers['textSize']"            
            >
                <template #icon>
                    <FormatText />
                </template>
                <template #units>
                    px
                </template>
            </ValuePicker>
            <SelectMain
                :options="optionsHorizontalAlign"
                :disabled="!isTextMode"
                :model-value="currentHorizontalAlign"
                @update:model-value="handlerHorizontalAlign"
            >
                <template #option="{ option }">  
                    <component :is="iconsHorizontalAlign[option.id]"></component>
                </template>
                <template #trigger="{ selected }">
                    <component :is="iconsHorizontalAlign[selected.id]"></component>
                </template>
            </SelectMain>
            <SelectMain
                :options="optionsVerticalAlign"
                :disabled="!isTextMode"
                :model-value="currentVerticalAlign"
                @update:model-value="handlerVerticalAlign"
            >
                <template #option="{ option }">  
                    <component :is="iconsVerticalAlign[option.id]"></component>
                </template>
                <template #trigger="{ selected }">
                    <component :is="iconsVerticalAlign[selected.id]"></component>
                </template>
            </SelectMain>
        </div>
        <div class="control-buttons__item control-buttons__item_block">
            <ControlButton 
                class="control-buttons__button control-buttons__button_color"
                :disabled="!isEditMode"
                @click="controlButtonsHandlers['backgroundColor']"
                :style="{ color: mainColor }"
            >
                <FormatPaint />
            </ControlButton>
            <ControlButton
                class="control-buttons__button control-buttons__button_color control-buttons__button_border-color"
                :disabled="!isEditMode"
                @click="controlButtonsHandlers['borderColor']"
                :style="{ color: mainColor }"
            >
                <BorderColor />
            </ControlButton>
            <ValuePicker
                class="control-buttons__button control-buttons__value-picker"
                :disabled="!isEditMode"
                :value="+props.activeShape.shape?.cornerRadius || 0"
                @update:value="controlButtonsHandlers['cornerRadius']"            
            >
                <template #icon>
                    <BorderRadius />
                </template>
                <template #units>
                    px
                </template>
            </ValuePicker>
            <ValuePicker
                class="control-buttons__button control-buttons__value-picker"
                :disabled="!isEditMode"
                :value="+props.activeShape.shape?.borderWidth || 0"
                @update:value="controlButtonsHandlers['borderWidth']"            
            >
                <template #icon>
                    <FormatLineWeight />
                </template>
                <template #units>
                    px
                </template>
            </ValuePicker>
        </div>
        <div class="control-buttons__item control-buttons__item_main">
            <ControlButton
                class="control-buttons__button"
                @click="controlButtonsHandlers['moveMode']"
                :active="isMoveMode"
            >
                <CursorMove />
            </ControlButton>
            <ControlButton
                class="control-buttons__button"
                @click="controlButtonsHandlers['editMode']"
                :active="isEditMode"
            >
                <Edit />
            </ControlButton>
            <ControlButton
                class="control-buttons__button"
                @click="controlButtonsHandlers['textMode']"
                :active="isTextMode"
            >
                <FormatColorText />
            </ControlButton>
            <ColorPicker 
                v-model:color="mainColor"
                class="control-buttons__color-picker"
            />
            <ControlButton
                class="control-buttons__button"
                @click="controlButtonsHandlers['addShape']"
            >
                <PlusIcon />
            </ControlButton>
        </div>
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed, ref } from 'vue';

import ControlButton from './ControlButton.vue';
import ColorPicker from './ColorPicker.vue';
import ValuePicker from './ValuePicker.vue';
import SelectMain from '@/components/SelectMain.vue';

// Icons

import BoldIcon from 'vue-material-design-icons/FormatBold.vue'
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue'
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue'
import AlignLeftIcon from 'vue-material-design-icons/FormatAlignLeft.vue'
import AlignCenterIcon from 'vue-material-design-icons/FormatAlignCenter.vue'
import AlignRightIcon from 'vue-material-design-icons/FormatAlignRight.vue'
import VerticalAlignBottom from 'vue-material-design-icons/FormatVerticalAlignBottom.vue'
import VerticalAlignCenter from 'vue-material-design-icons/FormatVerticalAlignCenter.vue'
import VerticalAlignTop from 'vue-material-design-icons/FormatVerticalAlignTop.vue'
import FormatText from 'vue-material-design-icons/FormatText.vue'
import Marker from 'vue-material-design-icons/Marker.vue'
import MarkerCancel from 'vue-material-design-icons/MarkerCancel.vue'
import FormatPaint from 'vue-material-design-icons/FormatPaint.vue'
import BorderColor from 'vue-material-design-icons/BorderColor.vue';
import BorderRadius from 'vue-material-design-icons/BorderRadius.vue';
import FormatLineWeight from 'vue-material-design-icons/FormatLineWeight.vue';
import PlusIcon from 'vue-material-design-icons/Plus.vue';
import CursorMove from 'vue-material-design-icons/CursorMove.vue';
import FormatColorText from 'vue-material-design-icons/FormatColorText.vue';
import Edit from '@/assets/icons/edit.svg?component'

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    },
    mode: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    updateShape: null,
    addShape: null,
    changeMode: null,
});
const mainColor = ref('#000000');
const controlButtonsHandlers = {
    // Text

    'bold': function() {
        props.activeShape.editor?.chain().focus().toggleBold().run();
    },
    'italic': function() {
        props.activeShape.editor?.chain().focus().toggleItalic().run();
    },
    'underline': function() {
        props.activeShape.editor?.chain().focus().toggleUnderline().run();
    },
    'textColor': function() {
        props.activeShape.editor?.chain().focus().setColor(mainColor.value).run();
    },
    'highlightAdd': function() {
        props.activeShape.editor?.chain().focus().setHighlight({ color: mainColor.value }).run();
    },
    'highlightRemove': function() {
        props.activeShape.editor?.chain().focus().unsetHighlight().run();
    },
    'textSize': function(event) {
        props.activeShape.editor?.chain().focus().setFontSize(event + 'px').run();
    },

    // Block

    'backgroundColor': function() {
        emits('updateShape', props.activeShape.id, 'color', mainColor.value);
    },
    'borderColor': function() {
        emits('updateShape', props.activeShape.id, 'borderColor', mainColor.value);
    },
    'cornerRadius': function(event) {
        emits('updateShape', props.activeShape.id, 'cornerRadius', +event);
    },
    'borderWidth': function(event) {
        emits('updateShape', props.activeShape.id, 'borderWidth', +event);
    },

    // Main

    'addShape': function() {
        emits('addShape');
    },
    'moveMode': function() {
        emits('changeMode', props.mode._move);
    },
    'editMode': function() {
        emits('changeMode', props.mode._edit);
    },
    'textMode': function() {
        emits('changeMode', props.mode._text);
    },
};
const isMoveMode = computed(() => {
    return props.mode.value === props.mode._move;
});
const isEditMode = computed(() => {
    return props.mode.value === props.mode._edit;
});
const isTextMode = computed(() => {
    return props.mode.value === props.mode._text && !!props.activeShape.editor;
});

// HorizontalAlign

const listItemsHorizontalAlign = [
    {
        id: 0,
        name: 'left',
        icon: AlignLeftIcon
    },
    {
        id: 1,
        name: 'center',
        icon: AlignCenterIcon
    },
    {
        id: 2,
        name: 'right',
        icon: AlignRightIcon
    },
];
const optionsHorizontalAlign = listItemsHorizontalAlign.map(({id, name}) => {
    return {
        id,
        name
    }
});
const iconsHorizontalAlign = listItemsHorizontalAlign.reduce((acc, item) => {
    acc[item.id] = item.icon;
    
    return acc;
}, {});
const currentHorizontalAlign = computed(() => {
    const name = props.activeShape.editor?.getAttributes('paragraph').textAlign;
    const { id } = optionsHorizontalAlign?.filter(item => item.name == name)[0] || {};

    return id || 0;
});

function handlerHorizontalAlign(id) {
    if (!props.activeShape.id) return;

    const { name } = optionsHorizontalAlign?.filter(item => item.id == id)[0] || {};

    props.activeShape.editor?.chain().focus().setTextAlign(name).run();
}

// VerticalAlign

const listItemsVerticalAlign = [
    {
        id: 0,
        name: 'bottom',
        icon: VerticalAlignBottom
    },
    {
        id: 1,
        name: 'center',
        icon: VerticalAlignCenter
    },
    {
        id: 2,
        name: 'top',
        icon: VerticalAlignTop
    },
];
const optionsVerticalAlign = listItemsVerticalAlign.map(({id, name}) => {
    return {
        id,
        name
    }
});
const iconsVerticalAlign = listItemsVerticalAlign.reduce((acc, item) => {
    acc[item.id] = item.icon;
    
    return acc;
}, {});
const currentVerticalAlign = computed(() => {
    const name = props.activeShape.shape?.textVerticalAlignment;
    const { id } = optionsVerticalAlign?.filter(item => item.name == name)[0] || {};

    return id || 0;
});

function handlerVerticalAlign(id) {
    if (!props.activeShape.id) return;

    const { name } = optionsVerticalAlign?.filter(item => item.id == id)[0] || {};

    emits('updateShape', props.activeShape.id, 'textVerticalAlignment', name);
}

</script>

<style scoped>

.control-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 48px;
}

.control-buttons__item {
    position: relative;
    display: flex;
    gap: 24px;
    border-bottom: 2px solid var(--milk);
    padding: 0 0 24px;
}

.control-buttons__item:not(:last-child)::before {
    content: '';
    position: absolute;
    right: -24px;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: var(--milk);
}

.control-buttons__button:deep(.material-design-icon){
    display: block;
    width: 24px;
    height: 24px;
}

.control-buttons__button:deep(svg) {
    width: 100%;
    height: 100%;
    fill: currentColor;
}

.control-buttons__color-picker {
    width: 40px;
    height: 44px;
}

.control-buttons__button_color {
    position: relative;
}

.control-buttons__button_color:deep(svg) {
    color: var(--mine-shaft) !important;
}

.control-buttons__button_color::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background-color: currentColor;
    border-radius: 0 0 8px 8px;
}

.control-buttons__button_border-color::before {
    width: 6px;
    height: 100%;
    border-radius: 8px 0 0 8px;
}

.control-buttons__value-picker:deep(input) {
    width: 40px;
}

.select-box-main {
    flex: 0 0 44px;
}

.select-box-main.active:deep(.selected-main) {
    background-color: var(--transparent-blue);
    color: var(--milk) !important;
}

.select-box-main.disabled:deep(.selected-main) {
    opacity: 0.5;
}

.select-box-main:deep(.selected-main) {
    background-color: var(--milk);
    padding: 8px;
    color: var(--mine-shaft);
    transition: 0.2s ease;
}

.select-box-main:deep(.selected-main::after) {
    display: none;
}

.select-box-main:deep(.options-container-main) {
    top: auto;
    bottom: 0;
    display: flex;
    box-shadow: 0px 2.5px 5px 1px rgba(34, 60, 80, 0.2);
    transform: translateY(100%);
    border: none;
    background-color: var(--milk);
    padding: 8px;
}

.select-box-main:deep(.option-main) {
    background-color: var(--milk);
    border-radius: 8px;
    color: var(--mine-shaft);
    transition: 0.2s ease;
}

.select-box-main:deep(.option-main.selected) {
    background-color: var(--transparent-blue);
    color: var(--milk) !important;
}

</style>