<template>
    <div class="control-buttons-main">
        <ControlButton
            class="control-buttons-button"
            @click="addShapeHandler"
        >
            <PlusIcon />
        </ControlButton>
        <ControlButton
            class="control-buttons-button"
            @click="copyShapeHandler"
            :disabled="!props.activeShape.id"
        >
            <ContentCopy />
        </ControlButton>
    </div>
</template>

<script setup>

import { defineEmits } from 'vue';

import ControlButton from './ControlButton.vue';

// Icons

import PlusIcon from 'vue-material-design-icons/Plus.vue';
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    addShape: null,
    copyShape: null,
});

// Handlers

function addShapeHandler() {
    emits('addShape');
}

function copyShapeHandler() {
    emits('copyShape');
}

</script>