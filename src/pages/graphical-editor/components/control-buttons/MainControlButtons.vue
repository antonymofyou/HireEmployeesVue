<template>
    <div class="control-buttons-main">
        <ControlButton
            class="control-buttons-button"
            @click="addShapeHandler"
        >
            <PlusIcon />
        </ControlButton>
    </div>
</template>

<script setup>

import { defineEmits } from 'vue';

import ControlButton from './ControlButton.vue';

// Icons

import PlusIcon from 'vue-material-design-icons/Plus.vue';

const emits = defineEmits({
    addShape: null,
});

// Handlers

function addShapeHandler() {
    emits('addShape');
}

</script>