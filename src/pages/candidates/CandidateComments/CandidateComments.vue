<template>
  <div class="container">
    <TopSquareButton
      class="container__back-btn"
      @click="$router.push({ name: 'candidates' })"
      :icon="backIcon"
    >
    </TopSquareButton>
    <h1 class="heading">Комментарии</h1>
    <template v-if="candidateId || (vacancyId && candidateId)">
      <CommentsBlock v-if="candidateId" :candidate-id class="comments-block" />
      <CommentsBlock
        v-if="vacancyId && candidateId"
        :vacancy-id
        :candidate-id
        class="comments-block"
      />
    </template>
    <p v-else>Неверно переданы параметры</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CommentsBlock from './components/CommentsBlock.vue';
import backIcon from "@/assets/icons/back.svg";
import TopSquareButton from '@/components/TopSquareButton.vue';

const route = useRoute();
// ID вакансии
const vacancyId = route.query.vacancyId;
// ID кандидата
const candidateId = route.query.candidateId;
</script>

<style scoped>
.container {
  padding: 0 20px;
}

.comments-block {
  margin-bottom: 50px;
  border: 1px solid var(--cornflower-blue);
  border-radius: 1em;
  padding: 10px;
}

.heading {
  font-size: 35px;
}

.container__back-btn {
  position: relative;
  top: 20px;
  margin-bottom: 10px;
}
</style>
