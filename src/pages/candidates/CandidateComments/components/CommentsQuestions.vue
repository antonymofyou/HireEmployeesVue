<template>
  <div class="questions-universal">
    <div class="questions-universal__header">
      <div class="questions-universal__header-title">
        {{ props.type === 'questions' ? 'Ответы кандидата' : 'Кандидат' }}
      </div>
      <ButtonIcon v-if="props.type === 'questions'" @click="showQuestions"
        ><template #icon>
          <ArrowIcon
            :class="[
              'questions-universal__header-arrowicon',
              { 'questions-universal__header-arrowicon--active': show },
            ]"
          /> </template
      ></ButtonIcon>
    </div>

    <div v-if="props.type === 'candidate'" class="questions-universal__info">
      <div v-if="errorMessage" class="questions-universal__error">
        {{ errorMessage }}
      </div>
      <template v-else>
        <div><b>ФИО: </b>{{ respondInfo.info?.fio }}</div>
        <div>
          <b>Телеграм: </b>
          <a
            target="_blank"
            :href="`https://t.me/${respondInfo.info?.tgNickname}`"
          >
            {{ respondInfo.info?.tgNickname }}
          </a>
        </div>
      </template>
    </div>

    <!-- Вопросы вакансии и ответы кандидата -->
    <Transition v-if="props.type === 'questions'">
      <div class="questions-universal__list" v-if="show">
        <div v-if="errorMessage" class="questions-universal__error">
          {{ errorMessage }}
        </div>
        <template v-else="respondInfo.answers.length">
          <div
            class="questions-universal__question"
            v-for="question in respondInfo.answers"
            :key="question.questionId"
          >
            <div class="questions-universal__question-text">
              <div><b>Вопрос:</b></div>
              <div v-html="question.question"></div>
            </div>
            <div class="questions-universal__question-text">
              <div><b>Ответ:</b></div>
              <div>{{ question.answer }}</div>
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
import ArrowIcon from '@/assets/icons/arrow.svg?component';
import ButtonIcon from '@/components/ButtonIcon.vue';

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
// Флаг загрузки данных
const dataFetched = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');
// Флаг показа вопросов
const show = ref(false);

// Запрос данных по ответам кандидата
const requestCandidateInfo = () => {
  const requestInstance = new CandidatesGetOtklikAnswers();
  requestInstance.otklikId = props.respondId;
  errorMessage.value = '';
  dataFetched.value = false;

  requestInstance.request(
    '/candidates/get_otklik_info.php',
    'manager',
    (response) => {
      respondInfo.value = {
        answers: response.answers,
        info: response.info,
      };
      dataFetched.value = true;
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
.questions-universal {
  font-size: 15px;
}

.questions-universal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
}

.questions-universal__header-title {
  font-size: 16px;
  font-weight: 600;
}

.questions-universal__question {
  margin-bottom: 20px;
}

.questions-universal__question-text {
  word-break: break-all;
}

.questions-universal__info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 5px 0;
}

.questions-universal__error {
  color: var(--error-color);
}

.questions-universal__header-arrowicon {
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
}

@media screen and (max-width: 425px) {
  .questions-universal__header-arrowicon {
    width: 25px;
    height: 25px;
  }
}

.questions-universal__header-arrowicon--active {
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
