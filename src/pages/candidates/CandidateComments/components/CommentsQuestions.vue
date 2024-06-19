<template>
  <div class="universal">
    <div class="universal__header">
      <h2>
        {{ props.type === 'questions' ? 'Ответы кандидата' : 'Кандидат' }}
      </h2>

      <button
        v-if="props.type === 'questions'"
        class="universal__header-btn"
        @click="showQuestions"
      >
        <ArrowIcon
          :class="[
            'universal__header-arrowicon',
            { 'universal__header-arrowicon--active': show },
          ]"
        />
      </button>
    </div>

    <div v-if="props.type === 'candidate'" class="universal__info">
      <p v-if="errorMessage" class="universal__error">
        {{ errorMessage }}
      </p>
      <template v-else>
        <p><b>ФИО: </b>{{ respondInfo.info?.fio }}</p>
        <p><b>Телеграм: </b> {{ respondInfo.info?.tgNickname }}</p>
        <p><b>Статус: </b> {{ respondInfo.info?.status }}</p></template
      >
    </div>

    <!-- Вопросы вакансии и ответы кандидата -->
    <Transition v-if="props.type === 'questions'">
      <div class="universal__list" v-if="show">
        <p v-if="errorMessage" class="universal__error">
          {{ errorMessage }}
        </p>
        <template v-else="respondInfo.answers.length">
          <div
            class="universal__question"
            v-for="question in respondInfo.answers"
            :key="question.questionId"
          >
            <div class="universal__question-text">
              <p><b>Вопрос:</b></p>
              <p v-html="question.question"></p>
            </div>
            <div class="universal__question-text">
              <p><b>Ответ:</b></p>
              <p>{{ question.answer }}</p>
            </div>
            <hr />
          </div>
        </template>
        <p v-if="!errorMessage && !respondInfo.answers.length">Нет данных</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { CandidatesGetOtklikAnswers } from '../js/CommentsClasses';
import ArrowIcon from '@/assets/icons/arrow-down.svg?component';

const props = defineProps({
  // ID отклика
  respondId: {
    type: String,
    required: true,
  },
  // Тип компонента. Вопросы/ответы кандидата или информация о кандидате
  type: {
    type: String,
    required: true,
  },
});

// Массив данных к отклику
const respondInfo = ref([]);
// Сообщение об ошибке
const errorMessage = ref('');
// Флаг показа вопросов
const show = ref(false);

// Запрос данных по ответам кандидата
const requestCandidateInfo = () => {
  const requestInstance = new CandidatesGetOtklikAnswers();
  requestInstance.otklikId = props.respondId;
  errorMessage.value = '';

  requestInstance.request(
    '/candidates/get_otklik_answers.php',
    'manager',
    (response) => {
      respondInfo.value = { answers: response.answers, info: response.info };
    },
    (err) => (errorMessage.value = err)
  );
};

// Показать/скрыть вопросы
const showQuestions = () => {
  show.value = !show.value;
};

onMounted(requestCandidateInfo);
</script>

<style scoped>
.universal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.universal__question {
  margin-bottom: 20px;
}

.universal__question-text {
  word-break: break-all;
  :nth-child(1) {
    margin-bottom: 0;
  }
  :nth-child(2) {
    margin-top: 8px;
  }
}

.universal__error {
  color: var(--error-color);
}

.universal__header-btn {
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.universal__header-arrowicon {
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
}

.universal__header-arrowicon--active {
  transform: rotateX(180deg);
}

/* Transition */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
