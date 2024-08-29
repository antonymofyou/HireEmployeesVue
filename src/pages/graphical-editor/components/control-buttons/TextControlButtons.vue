<template>
    <div class="control-buttons-text">
        <DropdownContent>
            <template #trigger>
                <FormatFont />
            </template>
            <template #content>
                <ControlButton 
                    class="control-buttons-button"
                    :active="props.activeShape.editor?.isActive('bold')"
                    @click="boldStyleHandler"
                >
                    <BoldIcon />
                </ControlButton>
                <ControlButton 
                    class="control-buttons-button"
                    :active="props.activeShape.editor?.isActive('italic')"
                    @click="italicStyleHandler"
                >
                    <ItalicIcon />
                </ControlButton>
                <ControlButton 
                    class="control-buttons-button"
                    :active="props.activeShape.editor?.isActive('underline')"
                    @click="underlineStyleHandler"
                >
                    <UnderlineIcon />
                </ControlButton>
            </template>
        </DropdownContent>
        <ColorPicker
            :color="props.activeShape.editor?.getAttributes('textStyle').color || '#000000'"
            @reset-color="colorTextHandler('#000000')"
            @update:color="colorTextHandler"            
        >
            <template #icon>
                <FormatText />
            </template>
        </ColorPicker>
        <ColorPicker
            :color="props.activeShape.editor?.getAttributes('highlight').color || '#000000'"
            @reset-color="removeHighlightHandler"
            @update:color="addHighlightHandler"            
        >
            <template #icon>
                <Marker />
            </template>
        </ColorPicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="parseInt(props.activeShape.editor?.getAttributes('textStyle').fontSize) || 0"
            @update:value="sizeTextHandler"            
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
        >
            <template #icon>
                <FitToPageOutline />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <SelectMain
            :options="optionsHorizontalAlign"
            :model-value="currentHorizontalAlign"
            @update:model-value="horizontalAlignSelectHandler"
        >
            <template #option="{ option }">  
                <component :is="horizontalAlignIcons[option.id]"></component>
            </template>
            <template #trigger="{ selected }">
                <component :is="horizontalAlignIcons[selected.id]"></component>
            </template>
        </SelectMain>
        <SelectMain
            :options="optionsVerticalAlign"
            :model-value="currentVerticalAlign"
            @update:model-value="verticalAlignSelectHandler"
        >
            <template #option="{ option }">  
                <component :is="verticalAlignIcons[option.id]"></component>
            </template>
            <template #trigger="{ selected }">
                <component :is="verticalAlignIcons[selected.id]"></component>
            </template>
        </SelectMain> 
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue';

import ControlButton from './ControlButton.vue';
import ColorPicker from './ColorPicker.vue';
import ValuePicker from './ValuePicker.vue';
import SelectMain from '@/components/SelectMain.vue';
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
});

const itemsHorizontalAlign = [
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
const itemsVerticalAlign = [
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

const getSelectOptions = (items) => {
    return items.map(({id, name}) => {
        return {
            id,
            name
        }
    });
};
const getSelectIcons = (items) => {
    return items.reduce((acc, item) => {
        acc[item.id] = item.icon;
        
        return acc;
    }, {});
}

const optionsHorizontalAlign = getSelectOptions(itemsHorizontalAlign);
const optionsVerticalAlign = getSelectOptions(itemsVerticalAlign);

const horizontalAlignIcons = getSelectIcons(itemsHorizontalAlign);
const verticalAlignIcons = getSelectIcons(itemsVerticalAlign);

const currentHorizontalAlign = computed(() => {
    const name = props.activeShape.editor?.getAttributes('paragraph').textAlign;
    const { id } = optionsHorizontalAlign?.filter(item => item.name == name)[0] || {};

    return id || 0;
});
const currentVerticalAlign = computed(() => {
    const name = props.activeShape.shape?.textVerticalAlignment;
    const { id } = optionsVerticalAlign?.filter(item => item.name == name)[0] || {};

    return id || 0;
});

// Handlers

function boldStyleHandler() {
    props.activeShape.editor?.chain().focus().toggleBold().run();
}

function italicStyleHandler() {
    props.activeShape.editor?.chain().focus().toggleItalic().run();
}

function underlineStyleHandler() {
    props.activeShape.editor?.chain().focus().toggleUnderline().run();
}

function colorTextHandler(color) {
    props.activeShape.editor?.chain().focus().setColor(color).run();
}

function sizeTextHandler(size) {
    props.activeShape.editor?.chain().setFontSize(size + 'px').run();
}

function addHighlightHandler(color) {
    props.activeShape.editor?.chain().focus().setHighlight({ color: color }).run();
}

function removeHighlightHandler() {
    props.activeShape.editor?.chain().focus().unsetHighlight().run();
}

function horizontalAlignSelectHandler(id) {
    if (!props.activeShape.id) return;

    const { name } = optionsHorizontalAlign?.filter(item => item.id == id)[0] || {};

    props.activeShape.editor?.chain().focus().setTextAlign(name).run();
}

function verticalAlignSelectHandler(id) {
    if (!props.activeShape.id) return;

    const { name } = optionsVerticalAlign?.filter(item => item.id == id)[0] || {};

    updateShapeHandler('textVerticalAlignment', name);
}

function updateShapeHandler(key, value) {
    emits('updateShape', props.activeShape.id, key, value);
}

</script>

<style scoped>

.select-box-main.active:deep(.selected-main) {
    background-color: var(--transparent-blue);
    color: var(--milk) !important;
}

.select-box-main.disabled:deep(.selected-main) {
    opacity: 0.5;
}

.select-box-main:deep(.selected-main) {
    background-color: var(--milk);
    padding: 6px;
    color: var(--mine-shaft);
    transition: 0.2s ease;
}

.select-box-main:deep(.selected-main::after) {
    display: none;
}

.select-box-main:deep(.options-container-main),
.dropdown:deep(.dropdown__content) {
    top: -8px;
    left: 50% !important;
    transform: translateY(-100%) translateX(-50%);
}

@media (max-width: 768px) {
    .select-box-main:deep(.options-container-main),
    .dropdown:deep(.dropdown__content) {
        top: auto;
        bottom: -8px;
        transform: translateY(100%) translateX(-50%);
    }
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