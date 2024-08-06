<template>
  <EditorWithText />

  <hr>
  <hr>
  <hr>

  <EditorInteract />
  <EditorViewer />
</template>

<script setup>
import EditorInteract from './components/EditorInteract.vue';
import EditorViewer from './components/EditorViewer.vue';
import EditorWithText from './components/EditorWithText.vue';
</script>
