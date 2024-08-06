<template>
  <svg :width="width" :height="height" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g :transform="transform"> 
    <path d="M12 4V20M12 4L8 8M12 4L16 8" :stroke="color" :stroke-width="thickness" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
</template>

<script setup>
import {watch} from 'vue'
const props = defineProps({
    direction: {
      type: String,
      default: 'up', // up, right
    },
    length: {
      type: String,
      default: 50,
    },
    thickness: {
      type: String,
      default: 5,
    },
    color: {
      type: String,
      default: '#000',
    },
    angle: {
      type: String,
      default: 0,
    },

})
   const width = Number(props.length);
   const height =  Number(props.length);
   const transform = props.direction === "up" ? `rotate(${Number(props.angle)} 12 12)` : `rotate( ${Number(props.angle) + 90} 12 12)`;
   const viewBox = props.direction === "up" ? '0 0 24 24' : '0 0 24 24'

   watch(
  () => props.direction,
  (newDirection) => {
    console.log(`Direction changed to: ${newDirection}`);
  }
);

</script>

<style scoped>
svg {
  display: block;
}
</style>


<!-- <Arrow direction="up" length = 200 thickness= "2" color="red" angle="0" />
<Arrow direction="right" length = 200 thickness= "2" color="red" angle="0" /> -->