<template>
    <div :id="props.params.id" :style="styles" class="rectangle"></div>
</template>

<script setup>

import { defineProps, computed } from 'vue';

const props = defineProps({
    params: {
        type: Object,
        required: true,
    }
});
const styles = computed(() => {
    return {
        // Geometry
        top: props.params.y + 'px',
        left: props.params.x + 'px',
        zIndex: props.params.zIndex,
        transform: `rotate(${props.params.rotation}deg)`,
        // Size
        width: props.params.width + 'px',
        height: props.params.height + 'px',
        // Style
        backgroundColor: props.params.color,
        borderRadius: props.params.cornerRadius + 'px',
        borderWidth: props.params.borderWidth + 'px',
        borderStyle: 'solid',
        borderColor: props.params.borderColor,
    }
});

</script>

<style scoped>

.rectangle {
    position: absolute;
}

</style>