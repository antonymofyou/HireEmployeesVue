<template>
    <div class="control-buttons">
        <div class="control-buttons__item control-buttons__item_main">
            <ColorPicker 
                v-model:color="mainColor"
                :disabled="disabled"
                class="control-buttons__color-picker"
            />
            <ControlButton 
                class="control-buttons__button control-buttons__button_color" 
                :disabled="disabled"
                @click="emits('updateShape', props.activeShape.id, 'color', mainColor)"
                :style="{ color: mainColor }"
            >
                <FormatPaint />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button control-buttons__button_color control-buttons__button_border-color" 
                :disabled="disabled"
                @click="emits('updateShape', props.activeShape.id, 'borderColor', mainColor)"
                :style="{ color: mainColor }"
            >
                <BorderColor />
            </ControlButton>
            <ValuePicker
                class="control-buttons__button control-buttons__value-picker"
                :disabled="disabled"
                :value="+props.activeShape.shape?.cornerRadius || 0"
                @update:value="emits('updateShape', props.activeShape.id, 'cornerRadius', +$event)"            
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
                :disabled="disabled"
                :value="+props.activeShape.shape?.borderWidth || 0"
                @update:value="emits('updateShape', props.activeShape.id, 'borderWidth', +$event)"            
            >
                <template #icon>
                    <FormatLineWeight />
                </template>
                <template #units>
                    px
                </template>
            </ValuePicker>
        </div>
        <div class="control-buttons__item control-buttons__item_text">
            <ControlButton 
                class="control-buttons__button" 
                :disabled="disabled"
                :active="props.activeShape.editor?.isActive('bold')"
                @click="props.activeShape.editor?.chain().focus().toggleBold().run()"
            >
                <BoldIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="disabled"
                :active="props.activeShape.editor?.isActive('italic')"
                @click="props.activeShape.editor?.chain().focus().toggleItalic().run()"
            >
                <ItalicIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="disabled"
                :active="props.activeShape.editor?.isActive('underline')"
                @click="props.activeShape.editor?.chain().focus().toggleUnderline().run()"
            >
                <UnderlineIcon />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button control-buttons__button_color" 
                :disabled="disabled"
                @click="props.activeShape.editor?.chain().focus().setColor(mainColor).run()"
                :style="{ color: mainColor }"
            >
                <FormatText />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button control-buttons__button_color" 
                :disabled="disabled"
                @click="props.activeShape.editor?.chain().focus().setHighlight({ color: mainColor }).run()"
                :style="{ color: mainColor }"
            >
                <Marker />
            </ControlButton>
            <ControlButton 
                class="control-buttons__button" 
                :disabled="disabled"
                @click="props.activeShape.editor?.chain().focus().unsetHighlight().run()"
            >
                <MarkerCancel />
            </ControlButton>
            <ValuePicker
                class="control-buttons__button control-buttons__value-picker"
                :disabled="disabled"
                :value="parseInt(props.activeShape.editor?.getAttributes('textStyle').fontSize) || 16"
                @update:value="props.activeShape.editor?.chain().focus().setFontSize($event + 'px').run()"            
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
                :model-value="currentHorizontalAlign"
                @update:model-value="handlerHorizontalAlign"
                :disabled='disabled'
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
                :model-value="currentVerticalAlign"
                @update:model-value="handlerVerticalAlign"
                :disabled='disabled'
            >
                <template #option="{ option }">  
                    <component :is="iconsVerticalAlign[option.id]"></component>
                </template>
                <template #trigger="{ selected }">
                    <component :is="iconsVerticalAlign[selected.id]"></component>
                </template>
            </SelectMain>
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

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    updateShape: null
});
const disabled = computed(() => {
    return !props.activeShape.editor;
});
const mainColor = ref('#000000');

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
    gap: 48px;
}

.control-buttons__item {
    position: relative;
    display: flex;
    gap: 16px;
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
    color: var(--mine-shaft) !important;
}

.control-buttons__color-picker {
    width: 40px;
    height: 44px;
}

.control-buttons__button_color {
    position: relative;
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