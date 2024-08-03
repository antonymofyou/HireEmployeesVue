<template>
  <section v-if="isLoaded" class="comments-page">
    <RouterLink
        :to="{
          name: 'candidates',
          query: { vacancyId: respondData.vacancyId },
        }"
      >
        <TopSquareButton class="comments-page__back-btn" :icon="backIcon" />
    </RouterLink>
    <div class="heading">
      <h1>Отклик на вакансию</h1>
    </div>

    <template v-if="respondData.candidateId || respondId">
      <CommentsVacancy
        v-if="respondData.vacancyId"
        :vacancyData="vacancyData"
        class="comments-page__vacancy-block"
      />
      <CommentsCandidateInfo
        v-if="respondId"
        :fio="respondData.candidateFio"
        :tg-nickname="respondData.candidateTg"
        class="comments-page__info-block"
      />
      <CommentsQuestions
        v-if="respondId"
        :answers="respondData.candidateAnswers"
        type="questions"
        class="comments-page__questions-block"
      />
      <CommentsStatus
        v-if="respondId && respondData.statusCurrent"
        :respondId
        :status="respondData.statusCurrent"
        :statusColor="respondData.statusCurrentColor"
        :statuses="respondData.statuses"
        class="comments-page__status-block"
      />
      <CommentsBlock
        v-if="respondId && respondData.candidateId"
        :respondId
        :candidateId="respondData.candidateId"
        class="comments-page__comments-block"
      />
      <CommentsBlock
        v-if="respondData.candidateId"
        :candidateId="respondData.candidateId"
        class="comments-page__comments-block"
        data-candidate
      />
    </template>
  </section>

  <div v-else-if="!isLoaded" class="spinner">
    <SpinnerMain/>
  </div>

  <!-- Встраивание элемента в DOM дерево -->
  <Teleport to="body">
    <!-- Вывод сообщения о ошибке -->
    <ErrorNotification v-if="errorMessage" :message="errorMessage" />
  </Teleport>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { CandidatesGetOtklikAnswers, VacanciesGetAllVacancyById } from './js/CommentsClasses';
import CommentsBlock from './components/CommentsBlock.vue';
import backIcon from '@/assets/icons/back.svg';
import TopSquareButton from '@/components/TopSquareButton.vue';
import CommentsQuestions from './components/CommentsQuestions.vue';
import CommentsVacancy from './components/CommentsVacancy.vue';
import CommentsStatus from './components/CommentsStatus.vue'; 
import CommentsCandidateInfo from './components/CommentsCandidateInfo.vue';
import ErrorNotification from '@/components/ErrorNotification.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';

const route = useRoute();

// ID отклика
const respondId = route.query.otklikId;

// Данные отклика: id кандидата, ФИО кандидата, телеграм кандидата, ответы кандидата,
// id вакансии, текущий статус, цвет текущего статуса, массив всех статусы
const respondData = ref({
  candidateId: '',
  candidateFio: '',
  candidateTg: '',
  candidateAnswers: [],
  vacancyId: '',
  statusCurrent: '',
  statusCurrentColor: '',
  statuses: [],
});

// Данные вакансии: id, название, описание
const vacancyData = ref({
  id: '',
  name: '',
  description: '',
})

// Сообщение об ошибке
const  errorMessage = ref('');

// Состояние загрузки
const isLoaded = ref(false);

onMounted(() => {
  getRespondFromServer(
    (response) => {
      processRespondData(response);
      if (response.success === '1') {
        getVacancyInfo(processVacancyData, (err) => {
          errorMessage.value = err;
          isLoaded.value = true;
        });
      }
    },
    (err) => {
      errorMessage.value = err;
      isLoaded.value = true;
    }
  )
});

// Функция обработки данных отклика
const processRespondData = (response) => {
  // Если возникла ошибка
  if (response.success !== '1') {
    errorMessage.value = response.message;
    isLoaded.value = true;
    return;
  }

  // Инициализируем массив статусов на основе полученных данных
  if (!response.info.status) {
    // Если статус неизвестный
    respondData.value.statuses = response.statusTransfers.length ? response.statusTransfers : [];
  } else {
    // Записываем данные с сервера
    respondData.value = {
      candidateId: response.info.candidateId,
      candidateFio: response.info.fio,
      candidateTg: response.info.tgNickname,
      candidateAnswers: response.answers,
      vacancyId: response.info.vacancyId,
      statusCurrent: response.info.status,
      statusCurrentColor: response.info.statusColor,
      statuses: response.statusTransfers.map((status) => ({
        name: status.status,
        id: status.status,
        color: status.color,
      })),
    }
  }
}

// Функция обработки данных вакансии
const processVacancyData = (response) => {
  // Если возникла ошибка
  if (response.success !== '1') {
    errorMessage.value = response.message;
  } else {
    // Записываем данные с сервера
    vacancyData.value = {
      id: response.vacancy.id,
      name: response.vacancy.name,
      description: response.vacancy.description,
    };
  }
  isLoaded.value = true;
}

// Запрос данных по ответам кандидата
const getRespondFromServer = (successCallback, errorCallback) => {
  const requestInstance = new CandidatesGetOtklikAnswers();
  requestInstance.otklikId = respondId;

  requestInstance.request(
    '/candidates/get_otklik_info.php',
    'manager',
    (response) => successCallback(response),
    (err) => errorCallback(err),
  );
}

// Запрос данных по вакансии
const getVacancyInfo = (successCallback, errorCallback) => {
  const requestInstance = new VacanciesGetAllVacancyById();
  requestInstance.vacancyId = respondData.value.vacancyId;

  requestInstance.request(
    '/vacancies/get_all_vacancy_by_id.php',
    'manager',
    (response) => successCallback(response),
    (err) => errorCallback(err),
  );
}
</script>

<style scoped>
.comments-page {
  max-width: 925px;
  margin: 0 auto;
  margin-top: 20px;
  padding-bottom: 20px ;
}

.comments-page__comments-block,
.comments-page__questions-block,
.comments-page__info-block,
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
  position: sticky;
  top: 20px;
  left: 20px;
}

@media screen and (max-width: 350px) {
  .heading {
    margin-top: 70px;
  }
}

.spinner {
  max-width: 10vh;
  height: 100vh;
  
  display: flex;
  align-items: center;
  margin: 0 auto;
}
</style>