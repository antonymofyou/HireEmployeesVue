<template>
    <div class="control-buttons-block">
        <ColorPicker
            class="control-buttons-button control-buttons-color-picker"
            :color="props.activeShape.shape?.color || '#000000'"
            @update:color="updateShapeHandler('color', $event)"            
        >
            <template #icon>
                <FormatPaint />
            </template>
        </ColorPicker>
        <ColorPicker
            class="control-buttons-button control-buttons-color-picker"
            :color="props.activeShape.shape?.borderColor || '#000000'"
            @update:color="updateShapeHandler('borderColor', $event)"            
        >
            <template #icon>
                <BorderColor />
            </template>
        </ColorPicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="+props.activeShape.shape?.cornerRadius || 0"
            @update:value="updateShapeHandler('cornerRadius', +$event)"            
        >
            <template #icon>
                <BorderRadius />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="+props.activeShape.shape?.borderWidth || 0"
            @update:value="updateShapeHandler('borderWidth', +$event)"            
        >
            <template #icon>
                <FormatLineWeight />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="+props.activeShape.shape?.paddingHorizontal || 0"
            @update:value="updateShapeHandler('paddingHorizontal', +$event)"            
        >
            <template #icon>
                <ArrowExpandHorizontal />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="+props.activeShape.shape?.paddingVertical || 0"
            @update:value="updateShapeHandler('paddingVertical', +$event)"            
        >
            <template #icon>
                <ArrowExpandVertical />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="+props.activeShape.shape?.zIndex || 1"
            @update:value="updateShapeHandler('zIndex', +$event)"    
        >
            <template #icon>
                <Layers />
            </template>
        </ValuePicker>
    </div>
</template>

<script setup>

import { defineProps, defineEmits } from 'vue';

import ColorPicker from './ColorPicker.vue';
import ValuePicker from './ValuePicker.vue';

// Icons

import FormatPaint from 'vue-material-design-icons/FormatPaint.vue'
import BorderColor from 'vue-material-design-icons/BorderColor.vue';
import BorderRadius from 'vue-material-design-icons/BorderRadius.vue';
import FormatLineWeight from 'vue-material-design-icons/FormatLineWeight.vue';
import Layers from 'vue-material-design-icons/Layers.vue'
import ArrowExpandVertical from 'vue-material-design-icons/ArrowExpandVertical.vue';
import ArrowExpandHorizontal from 'vue-material-design-icons/ArrowExpandHorizontal.vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    updateShape: null,
});

// Handlers

function updateShapeHandler(key, value) {
    console.log(key, value);
    emits('updateShape', props.activeShape.id, key, value);
}

</script>