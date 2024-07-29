<template>
  <h1 class="title">Просмотр</h1>

  <!-- тут v-stage без каких-либо обработчиков, просто отображение -->
  <Editor
    :shapes="data.shapes"
    :imageDictionary="data.imageDictionary"
    :onlyView="true"
    :width="configKonva.width"
    :height="configKonva.height"
    :draggable="configKonva.draggable"
    :shapesDraggable="configKonva.shapesDraggable"
  />
</template>

<script setup>
import Editor from './Editor.vue';

import { sharedKonvaConfig } from '../js/config';
import { data } from '../js/mock';

const configKonva = {
  ...sharedKonvaConfig,
  draggable: false,
  shapesDraggable: false,
};
</script>

<style scoped>
.title {
  text-align: center;
}
</style>