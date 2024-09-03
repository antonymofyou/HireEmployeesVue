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
            @click="updateScaleHandler('inc')"
            title="Увеличить масштаб (+10%)"
        >
            <MagnifyPlusOutline />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="updateScaleHandler('dec')"
            title="Уменьшить масштаб (-10%)"
        >
            <MagnifyMinusOutline />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="updateScaleHandler('reset')"
            title="Сбросить масштаб (100%)"
        >
            <RestoreIcon />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="addShapeHandler"
            title="Добавить фигуру"
        >
            <PlusIcon />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="deleteShapeHandler"
            :disabled="disabled"
            title="Удалить фигуру"
        >
            <DeleteOutline />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="copyShapeHandler"
            :disabled="disabled"
            :title="disabled ? 'Копировать фигуру (недоступно)' : 'Копировать фигуру'"
        >
            <ContentCopy />
        </ControlButton>
    </div>
</template>

<script setup>

import { defineEmits, computed } from 'vue';

import ControlButton from './ControlButton.vue';
import ValuePicker from './ValuePicker.vue';

// Icons

import PlusIcon from 'vue-material-design-icons/Plus.vue';
import RestoreIcon from 'vue-material-design-icons/Restore.vue';
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue';
import DeleteOutline from 'vue-material-design-icons/DeleteOutline.vue';
import MagnifyPlusOutline from 'vue-material-design-icons/MagnifyPlusOutline.vue';
import MagnifyMinusOutline from 'vue-material-design-icons/MagnifyMinusOutline.vue';

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

function addShapeHandler() {
    emits('addShape');
}

function deleteShapeHandler() {
    emits('deleteShape', props.activeShape.id);
}

function copyShapeHandler() {
    emits('copyShape');
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
        },
        'dec': function() {
            if (props.scale.value <= props.scale._min) return;

            emits('updateScale', props.scale.value - props.scale._step);
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

</style>