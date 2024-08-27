<template>
    <svg
        @click="selectArrow"
        :style="arrowStyles"
        :id="props.params.id"
        class="arrow"
    >
      <marker
        class="marker"
        id="arrowhead"
        markerWidth="12"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <line
          x1="4"
          y1="0"
          x2="9"
          y2="3.5"
          stroke-linecap="round"
        />
        <line
          x1="4"
          y1="7"
          x2="9"
          y2="3.5"
          stroke-linecap="round"
        />
      </marker>
      <line
        :x1="0"
        :x2="props.params.width"
        stroke-width="2"
        marker-end="url(#arrowhead)"
      />
    </svg>
</template>
  
<script setup>

import { computed } from 'vue';

const props = defineProps({
    params: {
        type: Object,
        required: true,
    },
});
const emits = defineEmits(['select-shape']);
const arrowStyles = computed(() => {
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
        stroke: props.params.color,
    }
});

function selectArrow() {
  emits('select-shape', {
    id: props.params.id,
  });
}

</script>
  
<style scoped>
.arrow {
    position: absolute;
    overflow: visible;
}
</style>