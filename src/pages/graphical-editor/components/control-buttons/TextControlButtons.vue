<template>
    <div class="control-buttons-text">
        <DropdownContent title="Форматирование текста">
            <template #trigger>
                <FormatFont />
            </template>
            <template #content>
                <ControlButton 
                    class="control-buttons-button"
                    :active="props.activeShape.editor?.isActive('bold')"
                    @click="updateEditorHandler('boldStyle')"
                    title="Выделение"
                >
                    <BoldIcon />
                </ControlButton>
                <ControlButton 
                    class="control-buttons-button"
                    :active="props.activeShape.editor?.isActive('italic')"
                    @click="updateEditorHandler('italicStyle')"
                    title="Курсив"
                >
                    <ItalicIcon />
                </ControlButton>
                <ControlButton 
                    class="control-buttons-button"
                    :active="props.activeShape.editor?.isActive('underline')"
                    @click="updateEditorHandler('underlineStyle')"
                    title="Подчеркивание"
                >
                    <UnderlineIcon />
                </ControlButton>
            </template>
        </DropdownContent>
        <ColorPicker
            :color="props.activeShape.editor?.getAttributes('textStyle').color || '#000000'"
            @reset-color="updateEditorHandler('colorText', '#000000')"
            @update:color="updateEditorHandler('colorText', $event)"         
            title="Цвет текста"   
        >
            <template #icon>
                <FormatText />
            </template>
        </ColorPicker>
        <ColorPicker
            :color="props.activeShape.editor?.getAttributes('highlight').color || '#000000'"
            @reset-color="updateEditorHandler('removeHighlight')"
            @update:color="updateEditorHandler('addHighlight', $event)"            
            title="Выделение текста"
        >
            <template #icon>
                <Marker />
            </template>
        </ColorPicker>
        <SelectControlButton 
            :items="itemsHorizontalAlign"
            title="Горизонтальное выравнивание"
            :item="props.activeShape.editor?.getAttributes('paragraph').textAlign || ''"
            @update:item="horizontalAlignSelectHandler"
        />
        <SelectControlButton 
            :items="itemsVerticalAlign"
            title="Вертикальное выравнивание"
            :item="props.activeShape.shape?.textVerticalAlignment || ''"
            @update:item="verticalAlignSelectHandler"
        />
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="parseInt(props.activeShape.editor?.getAttributes('textStyle').fontSize) || 0"
            @update:value="updateEditorHandler('sizeText', $event)"
            :min="0"
            title="Размер текста"           
        >
            <template #icon>
                <FormatText />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="+props.activeShape.shape?.padding || 0"
            @update:value="updateShapeHandler('padding', +$event)"     
            :min="0"
            title="Внутренние отступы"       
        >
            <template #icon>
                <FitToPageOutline />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue';

import ControlButton from './ControlButton.vue';
import ColorPicker from './ColorPicker.vue';
import ValuePicker from './ValuePicker.vue';
import SelectControlButton from './SelectControlButton.vue';
import DropdownContent from '@/components/DropdownContent.vue';

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
import FormatFont from 'vue-material-design-icons/FormatFont.vue';
import FitToPageOutline from 'vue-material-design-icons/FitToPageOutline.vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    updateShape: null,
    updateEditor: null
});

const itemsHorizontalAlign = [
    {
        id: 0,
        name: 'left',
        icon: AlignLeftIcon,
        title: 'По левому краю',
    },
    {
        id: 1,
        name: 'center',
        icon: AlignCenterIcon,
        title: 'По центру',
    },
    {
        id: 2,
        name: 'right',
        icon: AlignRightIcon,
        title: 'По правому краю',
    },
];
const itemsVerticalAlign = [
    {
        id: 0,
        name: 'bottom',
        icon: VerticalAlignBottom,
        title: 'По нижнему краю',
    },
    {
        id: 1,
        name: 'center',
        icon: VerticalAlignCenter,
        title: 'По центру',
    },
    {
        id: 2,
        name: 'top',
        icon: VerticalAlignTop,
        title: 'По верхнему краю',
    },
];

function updateEditorHandler(type, value) {
    emits('updateEditor', type, value);
}

function updateShapeHandler(key, value) {
    emits('updateShape', props.activeShape.id, key, value);
}

function verticalAlignSelectHandler(name) {
    updateShapeHandler('textVerticalAlignment', name);
}

function horizontalAlignSelectHandler(name) {
    updateEditorHandler('horizontalAlign', name);
}

</script>

<style scoped>

.dropdown:deep(.dropdown__content) {
    top: -8px;
    left: 50% !important;
    transform: translateY(-100%) translateX(-50%);
}

@media (max-width: 768px) {
    .dropdown:deep(.dropdown__content) {
        top: auto;
        bottom: -8px;
        transform: translateY(100%) translateX(-50%);
    }
}

</style>