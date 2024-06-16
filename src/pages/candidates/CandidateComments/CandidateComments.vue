<template>
  <section class="comments">
    <TopSquareButton
      class="comments__back-btn"
      @click="
        $router.push({
          name: 'candidates',
          query: { vacancyId: vacancyId, status: status },
        })
      "
      :icon="backIcon"
    >
    </TopSquareButton>
    <h1 class="heading">Информация об отклике кандидата</h1>
    <template v-if="candidateId || respondId">
      <CommentsVacancy
        v-if="vacancyId"
        :vacancy-id
        class="comments__vacancy-block"
      />
      <CommentsQuestions
        v-if="respondId"
        :respond-id
        type="candidate"
        class="comments__questions-block"
      />
      <CommentsQuestions
        v-if="respondId"
        :respond-id
        type="questions"
        class="comments__questions-block"
      />
      <CommentsBlock
        v-if="candidateId"
        :candidate-id
        class="comments__comments-block"
      />
      <CommentsBlock
        v-if="respondId && candidateId"
        :respond-id
        :candidate-id
        class="comments__comments-block"
      />
    </template>
    <p v-else>Неверно переданы параметры</p>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CommentsBlock from './components/CommentsBlock.vue';
import backIcon from '@/assets/icons/back.svg';
import TopSquareButton from '@/components/TopSquareButton.vue';
import CommentsQuestions from './components/CommentsQuestions.vue';
import CommentsVacancy from './components/CommentsVacancy.vue';

const route = useRoute();
// ID отклика
const respondId = route.query.respondId;
// ID кандидата
const candidateId = route.query.candidateId;
// ID вакансии
const vacancyId = route.query.vacancyId;
// Статус отклика
const status = route.query.status;
</script>

<style scoped>
.comments__comments-block,
.comments__questions-block, .comments__vacancy-block {
  margin-bottom: 50px;
  border: 1px solid var(--cornflower-blue);
  border-radius: 1em;
  padding: 10px 15px;
}

.heading {
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 35px;
}

.comments__back-btn {
  position: relative;
  top: 20px;
  margin-bottom: 10px;
}

</style>
