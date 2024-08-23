<template>
    <div v-show="isActive" :style="styleTooltips" class="tooltip-control-buttons">
        <slot name="content"></slot>
    </div>
</template>

<script setup>

import { computed } from 'vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    },
    mode: {
        type: Object,
        required: true
    }
});

const isTextMode = computed(() => {
  return props.mode.value === props.mode._text;
});
const isActive = computed(() => {
    return props.activeShape.id && props.activeShape.editor && isTextMode.value;
});
const styleTooltips = computed(() => {
    let x = props.activeShape.shape?.x + props.activeShape.shape?.width / 2;
    let y = props.activeShape.shape?.y;

    return {
        top: y + 'px',
        left: x + 'px',
    }
});

</script>

<style scoped>

.tooltip-control-buttons {
    position: absolute;
    transform: translateY(-150%) translateX(-50%);
}

</style>