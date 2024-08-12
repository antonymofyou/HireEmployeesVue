<template>
  <svg  :width="props.direction === 'up' || props.direction === 'down' ? height : width" :height="props.direction === 'up' || props.direction === 'down' ? width: height">  
    <marker class="marker" id="arrowhead" markerWidth="12" markerHeight="7"refX="9" refY="3.5" orient="auto"> 
      <line  :x1="props.direction === 'left' || props.direction === 'down' ? 14 : 4" y1="0" x2="9" y2="3.5" :stroke="color"  stroke-linecap="round"/> 
      <line  :x1="props.direction === 'left' || props.direction === 'down'  ? 14 : 4" y1="7" x2="9" y2="3.5" :stroke="color"  stroke-linecap="round"/> 
    </marker>
    <line :x1="props.direction === 'up' || props.direction === 'down' ? props.width / 4 : 0"
          :y1="props.direction === 'up' || props.direction === 'down' ? props.width  : props.height / 2"
          :x2="props.direction === 'up' || props.direction === 'down' ? props.height / 2 : props.width "
          :y2="props.direction === 'up' || props.direction === 'down' ? 0 : props.height / 2"
          :stroke-width="thickness"  :stroke="color" 
          :marker-start="direction === 'down' || direction === 'left' ? 'url(#arrowhead)' : ''"
          :marker-end="direction === 'right' || direction === 'up' ? 'url(#arrowhead)' : ''"  />
  </svg> 
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  // Начальное направление up, right
    direction: {
      type: String,
      default: 'right'
    },

  // Размер
    width: {
      type: String,
      default: 100,
    },
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
      default: 'black',
    },
  // Угол поворота
    angle: {
      type: String,
      default: 0,
    }
})


</script>

<style scoped>
svg {
  display: block;
  overflow: visible;
}
.marker{
  overflow: visible;
}
</style>

