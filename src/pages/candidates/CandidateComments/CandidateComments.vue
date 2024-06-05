<template>
  <div class="container">
    <h1 class="heading">Лист комментариев</h1>
    <CommentsBlock :candidate-id>Комментарии на кандидата</CommentsBlock>
    <CommentsBlock
      :candidate-id
      :vacancy-id
    >
      Комментарии на отклик кандидата
    </CommentsBlock>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CommentsBlock from './components/CommentsBlock.vue';

const route = useRoute();
const vacancyId = route.query.vacancyId;
const candidateId = route.query.candidateId;
</script>

<style scoped>
.container {
  padding: 0 30px;
}

.heading {
  font-size: 35px;
}
</style>
