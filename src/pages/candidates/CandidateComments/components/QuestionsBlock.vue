<template>
  <div class="questions">
    <h2>Ответы на вопросы</h2>
    <p v-if="isLoading" class="questions__spinner-wrapper">Загрузка...</p>
    <template v-else>
      <div class="questions__list">
        <template v-if="questions.length">
          <div
            class="questions__question"
            v-for="question in questions"
            :key="question.id"
          >
            <p class="questions__question-text">Вопрос: {{ question.question }}</p>
            <p class="questions__question-text">Ответ: test</p>
          </div>
        </template>
        <p v-else>Нет вопросов</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VacanciesGetAllVacancyById } from '../js/CommentsClasses.js';

const props = defineProps({
  // ID вакансии, если передано - получаем комментарии для кандидата по отношению к отклику, иначе общие комментарии для кандидата
  vacancyId: {
    type: String,
    default: '',
  },
  // ID кандидата
  candidateId: {
    type: String,
    required: true,
  },
});

// Массив вопросов
const questions = ref([]);
// Состояние загрузки
const isLoading = ref(false);

// Запрос вопросов
const requestQuestions = () => {
  const requestInstance = new VacanciesGetAllVacancyById();
  requestInstance.vacancyId = props.vacancyId;

  isLoading.value = true;
  requestInstance.request(
    '/vacancies/get_all_vacancy_by_id.php',
    'manager',
    (response) => {
      questions.value = response.questions;
      isLoading.value = false;
    },
    () => {
      isLoading.value = false;
      console.log('Произошла ошибка при получении вопросов');
    }
  );
};

onMounted(requestQuestions);
</script>

<style scoped>
.questions__list {
  margin-bottom: 10px;
  padding: 10px;
  max-height: 16em;
  overflow-y: auto;
  scrollbar-width: thin;
}
</style>
