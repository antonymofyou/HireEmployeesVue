<template>
  <div class="container">
    <h1 class="heading">Комментарии</h1>
    <CommentsBlock :candidate-id />
    <CommentsBlock
      :candidate-id
      :vacancy-id
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CommentsBlock from './components/CommentsBlock.vue';

const route = useRoute();
const vacancyId = route.query.vacancyId;
const candidateId = "1" || route.query.candidateId;
</script>

<style scoped>
.container {
  padding: 0 30px;
}

.heading {
  font-size: 35px;
}
</style>
