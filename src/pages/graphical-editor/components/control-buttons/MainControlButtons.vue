<template>
    <div class="control-buttons-main">
        <ValuePicker
            class="control-buttons-button control-buttons-value-picker"
            :value="props.scale.value"
            :step="props.scale._step"
            :min="props.scale._min"
            :max="props.scale._max"
            @update:value="updateScaleHandler('input', $event)"
            title="Увеличить масштаб"           
        >
            <template #units>
                %
            </template>
        </ValuePicker>
        <ControlButton
            class="control-buttons-button"
            @pointerdown.prevent="updateScaleHandler('inc')"
            @pointerup.prevent="resetMouseClamped"
            title="Увеличить масштаб (+10%)"
        >
            <MagnifyPlusOutline />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @pointerdown.prevent="updateScaleHandler('dec')"
            @pointerup.prevent="resetMouseClamped"
            title="Уменьшить масштаб (-10%)"
        >
            <MagnifyMinusOutline />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @pointerdown="updateScaleHandler('reset')"
            title="Сбросить масштаб (100%)"
        >
            <RestoreIcon />
        </ControlButton>
        <DropdownContent title="Добавить фигуру">
            <template #trigger>
                <ShapeOutline />
            </template>
            <template #content>
                <ControlButton 
                    class="control-buttons-button"
                    @click="addShapeHandler('rectangle')"
                    title="Прямоугольник"
                >
                    <RectangleOutline />
                </ControlButton>
                <ControlButton 
                    class="control-buttons-button"
                    @click="addShapeHandler('arrow')"
                    title="Стрелка"
                >
                    <ArrowRightThin />
                </ControlButton>
            </template>
        </DropdownContent>
        <ControlButton
            class="control-buttons-button"
            @pointerdown="deleteShapeHandler"
            :disabled="disabled"
            title="Удалить фигуру"
        >
            <DeleteOutline />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @pointerdown="copyShapeHandler"
            :disabled="disabled"
            :title="disabled ? 'Копировать фигуру (недоступно)' : 'Копировать фигуру'"
        >
            <ContentCopy />
        </ControlButton>
    </div>
</template>

<script setup>

import { defineEmits, computed, ref } from 'vue';

import ControlButton from './ControlButton.vue';
import ValuePicker from './ValuePicker.vue';
import DropdownContent from '@/components/DropdownContent.vue';

// Icons

import RestoreIcon from 'vue-material-design-icons/Restore.vue';
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue';
import DeleteOutline from 'vue-material-design-icons/DeleteOutline.vue';
import MagnifyPlusOutline from 'vue-material-design-icons/MagnifyPlusOutline.vue';
import MagnifyMinusOutline from 'vue-material-design-icons/MagnifyMinusOutline.vue';
import RectangleOutline from 'vue-material-design-icons/RectangleOutline.vue';
import ArrowRightThin from 'vue-material-design-icons/ArrowRightThin.vue';
import ShapeOutline from 'vue-material-design-icons/ShapeOutline.vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    },
    scale: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    addShape: null,
    copyShape: null,
    deleteShape: null,
    updateScale: null,
});

const disabled = computed(() => {
    return !props.activeShape.id;
});

// Handlers

function addShapeHandler(type) {
    emits('addShape', type);
}

function deleteShapeHandler() {
    emits('deleteShape', props.activeShape.id);
}

function copyShapeHandler() {
    emits('copyShape');
}

let mouseIsClamped = ref(false);

function resetMouseClamped() {
    mouseIsClamped.value = false;
}

function updateScaleHandler(handler, value) {
    const handlers = {
        'reset': function() {
            emits('updateScale', props.scale._default);
        },
        'input': function(value) {
            emits('updateScale', value);
        },
        'inc': function() {
            if (props.scale.value >= props.scale._max) return;

            emits('updateScale', props.scale.value + props.scale._step);

            mouseIsClamped.value = true;

            setTimeout(() => {
                if (!mouseIsClamped.value) return;

                updateScaleHandler(handler, value);
            }, 100);
        },
        'dec': function() {
            if (props.scale.value <= props.scale._min) return;

            emits('updateScale', props.scale.value - props.scale._step);

            mouseIsClamped.value = true;

            setTimeout(() => {
                if (!mouseIsClamped.value) return;

                updateScaleHandler(handler, value);
            }, 100);
        }
    };

    handlers[handler](value);
}

</script>

<style scoped>

.control-buttons-value-picker:deep(input::-webkit-outer-spin-button),
.control-buttons-value-picker:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.control-buttons-value-picker:deep(input) {
  -moz-appearance: textfield;
}

.dropdown:deep(.dropdown__content) {
    bottom: -8px;
    transform: translateY(100%) translateX(-50%);
    left: 50%;
}

@media (max-width: 768px) {
    .dropdown:deep(.dropdown__content) {
        bottom: 50%;
        transform: translateY(50%) translateX(-100%);
        left: -8px;
    }
}

</style>