<template>
  <h1 class="title">Просмотр</h1>

  <!-- тут v-stage без каких-либо обработчиков, просто отображение -->
  <Editor
    :shapes="data.shapes"
    :width="configKonva.width"
    :height="configKonva.height"
    :draggable="configKonva.draggable"
    :shapesDraggable="configKonva.shapesDraggable"
  />
</template>

<script setup>
import { data } from './mock';
import Editor from './Editor.vue';

const configKonva = {
  width: window.innerWidth,
  height: window.innerHeight / 1.5,
  draggable: false,
  shapesDraggable: false,
};
</script>

<style scoped>
.title {
  text-align: center;
}
</style>