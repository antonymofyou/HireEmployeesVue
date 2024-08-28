<template>
    <div class="control-buttons-block">
        <ColorPicker
            :color="props.activeShape.shape?.color || '#000000'"
            :disabled="!isActiveShape"
            @reset-color="updateShapeHandler('color', '#000000')"
            @update:color="updateShapeHandler('color', $event)"   
        >
            <template #icon>
                <FormatPaint />
            </template>
        </ColorPicker>
        <ColorPicker
            :color="props.activeShape.shape?.borderColor || '#000000'"
            :disabled="!isActiveShape"
            @reset-color="updateShapeHandler('borderColor', '#000000')"
            @update:color="updateShapeHandler('borderColor', $event)"
            v-show="!isArrowShape"         
        >
            <template #icon>
                <BorderColor />
            </template>
        </ColorPicker>
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :disabled="!isActiveShape"
            :value="+props.activeShape.shape?.cornerRadius || 0"
            @update:value="updateShapeHandler('cornerRadius', +$event)"
            v-show="!isArrowShape"     
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
            :disabled="!isActiveShape"
            :value="+props.activeShape.shape?.borderWidth || 0"
            @update:value="updateShapeHandler('borderWidth', +$event)"     
            v-show="!isArrowShape"         
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
            :disabled="!isActiveShape"
            :value="+props.activeShape.shape?.paddingHorizontal || 0"
            @update:value="updateShapeHandler('paddingHorizontal', +$event)"            
            v-show="!isArrowShape"  
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
            :disabled="!isActiveShape"
            :value="+props.activeShape.shape?.paddingVertical || 0"
            @update:value="updateShapeHandler('paddingVertical', +$event)"   
            v-show="!isArrowShape"           
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
            :disabled="!isActiveShape"
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

import { defineProps, defineEmits, computed } from 'vue';

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

const isActiveShape = computed(() => {
    return Boolean(props.activeShape?.id);
})
const isArrowShape = computed(() => {
    return Boolean(props.activeShape.shape?.type === 'arrow');
})

// Handlers

function updateShapeHandler(key, value) {
    emits('updateShape', props.activeShape.id, key, value);
}

</script>

<style scoped>

.dropdown:deep(.dropdown__content) {
    top: auto;
    bottom: -8px;
    left: 50%;
    transform: translateY(100%) translateX(-50%);
}

</style>