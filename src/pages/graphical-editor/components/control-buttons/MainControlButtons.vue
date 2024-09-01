<template>
    <div class="control-buttons-main">
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

// Icons

import PlusIcon from 'vue-material-design-icons/Plus.vue';
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue';
import DeleteOutline from 'vue-material-design-icons/DeleteOutline.vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    addShape: null,
    copyShape: null,
    deleteShape: null,
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

</script>