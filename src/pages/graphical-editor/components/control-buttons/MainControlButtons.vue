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
            <template #icon>
                <MagnifyIcon />
            </template>
            <template #units>
                %
            </template>
        </ValuePicker>
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
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'

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
        }
    };

    handlers[handler](value);
}

</script>