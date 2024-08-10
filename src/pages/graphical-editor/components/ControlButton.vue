<template>
    <button 
        class="control-button" 
        :disabled="props.disabled" 
        :class="activeClass"
    >
        <slot></slot>
    </button>
</template>

<script setup>

import { defineProps, computed } from 'vue';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false,
    }
});

const activeClass = computed(() => {
    return {
        'active': props.active,
    }
})

</script>

<style scoped>

.control-button {
    background-color: var(--milk);
    padding: 8px;
    margin: 0;
    outline: none;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    opacity: 1;
    transition-property: opacity, background;
    transition-duration: .2s;
}

.control-button:disabled {
    opacity: 0.5;
}

.control-button.active {
    background-color: var(--transparent-blue);
    color: var(--milk);
}

</style>