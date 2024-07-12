<template>
  <section class="comments-page">
    <div class="heading">
      <RouterLink
        :to="{
          name: 'candidates',
          query: { vacancyId: vacancyId, status: statusCurrent },
        }"
      >
        <TopSquareButton class="comments-page__back-btn" :icon="backIcon" />
      </RouterLink>
      <h1>Отклик на вакансию</h1>
    </div>

    <template v-if="candidateId || respondId">
      <CommentsStatus
        v-if="respondId && statusCurrent"
        :respondId
        :status="statusCurrent"
        :statusColor="statusCurrentColor"
        :statuses="statuses"
        class="comments-page__status-block"
      />
      <CommentsVacancy
        v-if="vacancyId"
        :vacancyId
        class="comments-page__vacancy-block"
      />
      <CommentsQuestions
        v-if="respondId"
        :respondId
        type="candidate"
        class="comments-page__questions-block"
      />
      <CommentsQuestions
        v-if="respondId"
        :respondId
        type="questions"
        class="comments-page__questions-block"
      />
      <CommentsBlock
        v-if="respondId && candidateId"
        :respondId
        :candidateId
        class="comments-page__comments-block"
      />
      <CommentsBlock
        v-if="candidateId"
        :candidateId
        class="comments-page__comments-block"
        data-candidate
      />
    </template>
    <p v-else>Неверно переданы параметры</p>
  </section>
</template>

<script setup>
import { useRoute, useRouter} from 'vue-router';
import { ref, onMounted } from 'vue';
import { CandidatesGetOtklikAnswers } from './js/CommentsClasses';
import CommentsBlock from './components/CommentsBlock.vue';
import backIcon from '@/assets/icons/back.svg';
import TopSquareButton from '@/components/TopSquareButton.vue';
import CommentsQuestions from './components/CommentsQuestions.vue';
import CommentsVacancy from './components/CommentsVacancy.vue';
import CommentsStatus from './components/CommentsStatus.vue'; 

// Переменные Vue-router
const route = useRoute();
const router = useRouter();

// ID отклика
const respondId = route.query.otklikId;
// ID кандидата
const candidateId = route.query.candidateId;
// ID вакансии
const vacancyId = ref('');
// Статус отклика
const statusCurrent = ref('');
const statusCurrentColor = ref('');
// Массив статусов для передачи в компонент CommentsStatus
const statuses = ref([]);

const  errorMessage = ref('')
// Запрос данных по ответам кандидата
const requestCandidateInfo = () => {
  const requestInstance = new CandidatesGetOtklikAnswers();
  requestInstance.otklikId = respondId;

  requestInstance.request(
    '/candidates/get_otklik_info.php',
    'manager',
    (response) => {
      // Инициализируем массив статусов на основе полученных данных
      if (!response.info.status) {
        // Если статус неизвестный
        statuses.value = response.statusTransfers.length ? response.statusTransfers : [];
      } else {
        // Записываем данные с сервера
        statusCurrent.value = response.info.status;
        statusCurrentColor.value = response.info.statusColor;
        vacancyId.value = response.info.vacancyId;
        statuses.value = response.statusTransfers.map((status) => ({
          name: status.status,
          id: status.status,
          color: status.color
        }));
      }
    },
    (err) => (errorMessage.value = err)
  );
};

// Очистка query параметров, кроме Id кандидата и Id отклика
const clearQueryParams = () => {
  const query = { candidateId: route.query.candidateId, otklikId: route.query.otklikId };
  router.replace({ path: route.path, query });
};
// Отправка запроса при монтировании
onMounted(() => {
  requestCandidateInfo();
  clearQueryParams();
});
</script>

<style scoped>
.comments-page {
  max-width: 925px;
  margin: 0 auto;
  margin-top: 55px;
  padding-bottom: 20px ;
}

.comments-page__comments-block,
.comments-page__questions-block,
.comments-page__vacancy-block,
.comments-page__status-block {
  margin-bottom: 18px;
  border: 1px solid var(--cornflower-blue);
  border-radius: 15px;
  padding: 8px 15px;
}

.comments-page__comments-block[data-candidate] {
  margin-bottom: 0;
}

.heading {
  text-align: center;
}

.comments-page__back-btn {
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
