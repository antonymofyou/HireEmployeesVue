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
      <CommentsStatus
        v-if="respondId"
        :respondId
        class="comments__status-block"
      />
      <CommentsVacancy
        v-if="vacancyId"
        :vacancyId
        class="comments__vacancy-block"
      />
      <CommentsQuestions
        v-if="respondId"
        :respondId
        type="candidate"
        class="comments__questions-block"
      />
      <CommentsQuestions
        v-if="respondId"
        :respondId
        type="questions"
        class="comments__questions-block"
      />
      <CommentsBlock
        v-if="respondId && candidateId"
        :respondId
        :candidateId
        class="comments__comments-block"
      />
      <CommentsBlock
        v-if="candidateId"
        :candidateId
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
import CommentsStatus from './components/CommentsStatus.vue';

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
section {
  max-width: 925px;
  margin: 0 auto;
  margin-top: 55px;
}

.comments__comments-block,
.comments__questions-block,
.comments__vacancy-block,
.comments__status-block {
  margin-bottom: 18px;
  border: 1px solid var(--cornflower-blue);
  border-radius: 15px;
  padding: 8px 15px;
}

.comments__comments-block[data-candidate] {
  margin-bottom: 0;
}

.heading {
  text-align: center;
}

.comments__back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
}

@media screen and (max-width: 350px) {
  .heading {
    margin-top: 70px;
  }
}
</style>
