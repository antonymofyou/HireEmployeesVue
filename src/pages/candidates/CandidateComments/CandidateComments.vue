<template>
  <section class="comments">
    <div class="heading">
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
      <h1>Отклик на вакансию</h1>
    </div>

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
.comments__questions-block,
.comments__vacancy-block {
  margin-bottom: 38.5px;
  border: 1px solid var(--cornflower-blue);
  border-radius: 15px;
  padding: 10px 15px;
}

.heading {
  text-align: center;
  margin-bottom: 20px;
}

.comments__back-btn {
  position: relative;
  top: 20px;
}

@media screen and (max-width: 350px) {
  .heading {
    h1 {
      margin-top: 30px;
    }
  }
}
</style>
