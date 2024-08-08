<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g :transform="props.direction === 'up' ? `rotate(${Number(props.angle)} 12 12)` : `rotate( ${Number(props.angle) + 90} 12 12)`"> 
    <path d="M12 1V23M12 1L7 6M12 1L17 6" :stroke="color" :stroke-width="thickness" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
</template>

<script setup>
const props = defineProps({
  // Начальное направление up, right
    direction: {
      type: String,
      default: 'up'
    },

  // Размер
    size: {
      type: String,
      default: 50,
    },
  // Толщина
    thickness: {
      type: String,
      default: 5,
    },
  // Цвет
    color: {
      type: String,
      default: '#000',
    },
  // Угол поворота
    angle: {
      type: String,
      default: 0,
    },

})

</script>

<style scoped>
svg {
  display: block;
  overflow: visible;
}
</style>

