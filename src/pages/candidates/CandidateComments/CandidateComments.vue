<template>
  <div class="container">
    <h1 class="heading">Комментарии</h1>
    <CommentsBlock
      :candidate-id
      class="comments-block"
    />
    <CommentsBlock
      :candidate-id
      :vacancy-id
      class="comments-block"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CommentsBlock from './components/CommentsBlock.vue';

const route = useRoute();
// ID вакансии
const vacancyId = route.query.vacancyid;
// ID кандидата
const candidateId = route.query.candidateid;
</script>

<style scoped>
.container {
  padding: 0 20px;
}

.comments-block {
  margin-bottom: 50px;
}

.heading {
  font-size: 35px;
}
</style>
