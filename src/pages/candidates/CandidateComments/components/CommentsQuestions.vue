<template>
  <div class="questions">
    <div class="questions__header">
      <h2>Ответы на вопросы вакансии</h2>

      <button class="questions__header-btn" @click="showQuestions">
        <b> {{ show ? '&or;' : '&and;' }}</b>
      </button>
    </div>

    <p v-if="mainErrorMessage" class="questions__error">
      {{ mainErrorMessage }}
    </p>

    <template v-else>
      <Transition>
        <div class="questions__list" v-if="show">
          <template v-if="questions.length">
            <div
              class="questions__question"
              v-for="question in questions"
              :key="question.id"
            >
              <div class="questions__question-text">
                <p><b>Вопрос:</b></p>
                <p>{{ question.question }}</p>
              </div>
              <div class="questions__question-text">
                <p><b>Ответ:</b></p>
                <p>{{ question.answer }}</p>
              </div>
              <hr />
            </div>
          </template>
          <p v-else>Нет вопросов</p>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VacanciesGetAllVacancyById } from '../js/CommentsClasses.js';
import ButtonMain from '@/components/ButtonMain.vue';

const props = defineProps({
  // ID вакансии
  vacancyId: {
    type: String,
    required: true,
  },
  // ID кандидата
  candidateId: {
    type: String,
    required: true,
  },
});

// Массив вопросов
const questions = ref([
  {
    id: 0,
    question: 'Question',
    answer: 'answer',
  },
  {
    id: 0,
    question: 'Question',
    answer: 'answer',
  },
  {
    id: 0,
    question: 'Question',
    answer: 'answer',
  },
  {
    id: 0,
    question: 'Question',
    answer: 'answer',
  },
  {
    id: 0,
    question: 'Question',
    answer: 'answer',
  },
  {
    id: 0,
    question: 'Question',
    answer: 'answer',
  },
  {
    id: 0,
    question: 'Question',
    answer:
      'answer answeran sweransweransweransweransweransweransweransweransweransweransweransweransweransweransweransweransweranswer answeransweransweransweransweransweransweransweranswer',
  },
]);

// Сообщение об ошибках
const mainErrorMessage = ref('');
// Состояние загрузки
const isLoading = ref(false);
// Флаг показа вопросов
const show = ref(false);

// Запрос вопросов
const requestQuestions = () => {
  const requestInstance = new VacanciesGetAllVacancyById();
  requestInstance.vacancyId = props.vacancyId;

  isLoading.value = true;
  requestInstance.request(
    '/vacancies/get_all_vacancy_by_id.php',
    'manager',
    (response) => {
      //questions.value = response.questions;
      isLoading.value = false;
    },
    (error) => {
      isLoading.value = false;
      mainErrorMessage.value = error;
    }
  );
};

const showQuestions = () => {
  show.value = !show.value;
};

onMounted(requestQuestions);
</script>

<style scoped>
.questions {
  transition: all 0.5s ease;
}
.questions__list {
  margin-bottom: 10px;
  padding: 10px;
}

.questions__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.questions__question-text {
  word-break: break-all;
  :nth-child(1) {
    margin-bottom: 0;
  }
  :nth-child(2) {
    margin-top: 8px;
  }
}

.questions__error {
  color: var(--error-color);
}

.questions__header-btn{
  border: none;
  background-color: transparent;
  cursor: pointer;

  font-size: 25px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
