<template>
  <svg
    :transform="`rotate(${Number(props.angle)} 9 3.5)`"
    :width="
      props.direction === 'up' || props.direction === 'down'
        ? props.angle === '0'
          ? height
          : width
        : width
    "
    :height="
      props.direction === 'up' || props.direction === 'down'
        ? width
        : props.angle === '0'
        ? height
        : width
    "
  >
    <marker
      class="marker"
      id="arrowhead"
      markerWidth="12"
      markerHeight="7"
      refX="9"
      refY="3.5"
      orient="auto"
      :transform="`rotate(${Number(props.angle)} 9 3.5)`"
    >
      <line
        :x1="props.direction === 'left' || props.direction === 'down' ? 14 : 4"
        y1="0"
        x2="9"
        y2="3.5"
        :stroke="color"
        stroke-linecap="round"
      />
      <line
        :x1="props.direction === 'left' || props.direction === 'down' ? 14 : 4"
        y1="7"
        x2="9"
        y2="3.5"
        :stroke="color"
        stroke-linecap="round"
      />
    </marker>
    <!-- Выравнивание по центру при разных напралениях x1, x2, y1, y2 -->
    <line
      :x1="
        props.direction === 'up' || props.direction === 'down'
          ? props.angle === '0'
            ? props.height / 2
            : props.width / 2
          : 0
      "
      :y1="
        props.direction === 'up' || props.direction === 'down'
          ? props.width
          : props.angle === '0'
          ? props.height / 2
          : props.width / 2
      "
      :x2="
        props.direction === 'up' || props.direction === 'down'
          ? props.angle === '0'
            ? props.height / 2
            : props.width / 2
          : props.width
      "
      :y2="
        props.direction === 'up' || props.direction === 'down'
          ? 0
          : props.angle === '0'
          ? props.height / 2
          : props.width / 2
      "
      :stroke-width="thickness"
      :stroke="color"
      :marker-start="
        direction === 'down' || direction === 'left' ? 'url(#arrowhead)' : ''
      "
      :marker-end="
        direction === 'right' || direction === 'up' ? 'url(#arrowhead)' : ''
      "
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  // Начальное направление up, right, left, down
  direction: {
    type: String,
    default: "right",
  },

  // Ширина
  width: {
    type: String,
    default: 100,
  },
  // Высота
  height: {
    type: String,
    default: 100,
  },
  // Толщина
  thickness: {
    type: String,
    default: 1.5,
  },
  // Цвет
  color: {
    type: String,
    default: "black",
  },
  // Угол поворота
  angle: {
    type: String,
    default: 0,
  },
});
</script>

<style scoped>
svg {
  display: block;
  overflow: visible;
  margin-top: 20px;
}
.marker {
  overflow: visible;
}
</style>
