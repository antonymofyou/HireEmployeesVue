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
    }
});

const isActive = computed(() => {
    return props.activeShape.id;
});
const positionTooltips = computed(() => {
    let rotation = Math.round(Math.abs(props.activeShape.shape?.rotation));
    const centerX = props.activeShape.shape?.x + props.activeShape.shape?.width / 2;
    const centerY = props.activeShape.shape?.y + props.activeShape.shape?.height / 2;
    const initialX = props.activeShape.shape?.x;
    const initialY = props.activeShape.shape?.y;
    let x = centerX;
    let y = initialY;

    if (rotation) {
        rotation = rotation >= 90 ? 180 - rotation : rotation;
        const radians = rotation * (Math.PI / 180);

        y = Math.sin(radians) * (initialX - centerX) + Math.cos(radians) * (initialY - centerY) + centerY;
    }

    return {
        x,
        y
    }
});
const styleTooltips = computed(() => {
    return {
        top: positionTooltips.value.y + 'px',
        left: positionTooltips.value.x + 'px',
    }
});

</script>

<style scoped>

.tooltip-control-buttons {
    position: absolute;
    transform: translateY(-175%) translateX(-50%);
}

</style>