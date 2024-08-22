<template>
    <div class="control-buttons-main">
        <ControlButton
            class="control-buttons-button"
            @click="changeModeHandler(props.mode._move)"
            :active="isMoveMode"
        >
            <CursorMove />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="changeModeHandler(props.mode._edit)"
            :active="isEditMode"
        >
            <Edit />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="changeModeHandler(props.mode._text)"
            :active="isTextMode"
        >
            <FormatColorText />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="addShapeHandler"
        >
            <PlusIcon />
        </ControlButton>
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue';

import ControlButton from './ControlButton.vue';

// Icons

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
const isMoveMode = computed(() => {
    return props.mode.value === props.mode._move;
});
const isEditMode = computed(() => {
    return props.mode.value === props.mode._edit;
});
const isTextMode = computed(() => {
    return props.mode.value === props.mode._text && !!props.activeShape.editor;
});

// Handlers

function addShapeHandler() {
    emits('addShape');
}

function changeModeHandler(mode) {
    emits('changeMode', mode);
}

</script>