<template>
  <div class="questions-universal">
    <div class="questions-universal__header">
      <h2>
        {{ props.type === 'questions' ? 'Ответы кандидата' : 'Кандидат' }}
      </h2>
      <EmptyButton v-if="props.type === 'questions'" @click="showQuestions"
        ><template #icon>
          <ArrowIcon
            :class="[
              'questions-universal__header-arrowicon',
              { 'questions-universal__header-arrowicon--active': show },
            ]"
          /> </template
      ></EmptyButton>

      <SelectMain
        v-if="props.type === 'candidate' && dataFetched"
        v-model="newStatus"
        :options="options"
        :model-value="status[0].id"
        class="questions-universal__header-select"
        @update:modelValue="updateStatus"
      />
    </div>

    <div v-if="props.type === 'candidate'" class="questions-universal__info">
      <p v-if="errorMessage" class="questions-universal__error">
        {{ errorMessage }}
      </p>
      <template v-else>
        <p><b>ФИО: </b>{{ respondInfo.info?.fio }}</p>
        <p>
          <b>Телеграм: </b>
          <a
            target="_blank"
            :href="`https://t.me/${respondInfo.info?.tgNickname}`"
          >
            {{ respondInfo.info?.tgNickname }}
          </a>
        </p>
        <p><b>Статус: </b> {{ respondInfo.info?.status }}</p></template
      >
    </div>

    <!-- Вопросы вакансии и ответы кандидата -->
    <Transition v-if="props.type === 'questions'">
      <div class="questions-universal__list" v-if="show">
        <p v-if="errorMessage" class="questions-universal__error">
          {{ errorMessage }}
        </p>
        <template v-else="respondInfo.answers.length">
          <div
            class="questions-universal__question"
            v-for="question in respondInfo.answers"
            :key="question.questionId"
          >
            <div class="questions-universal__question-text">
              <p><b>Вопрос:</b></p>
              <p v-html="question.question"></p>
            </div>
            <div class="questions-universal__question-text">
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
import {
  CandidatesGetOtklikAnswers,
  CandidatesSetOtklikStatus,
} from '../js/CommentsClasses';
import ArrowIcon from '@/assets/icons/arrow-down.svg?component';
import EmptyButton from '@/components/EmptyButton.vue';
import SelectMain from '@/components/SelectMain.vue';

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

const options = [
  {
    name: 'Анкета',
    id: 'Анкета',
  },
  {
    name: 'Created',
    id: 'Created',
  },
];
// Массив данных к отклику
const respondInfo = ref([]);
// Статус кандидата
const status = ref([]);
// Новый статус кандидата
const newStatus = ref('');
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
        statusTransfers: response.statusTransfers,
      };
      status.value = [{ name: response.info.status, id: response.info.status }];
      dataFetched.value = true;
    },
    (err) => (errorMessage.value = err)
  );
};

// Изменение статуса кандидата
const changeRespondStatus = () => {
  const requestInstance = new CandidatesSetOtklikStatus();
  requestInstance.otklikId = props.respondId;
  requestInstance.toStatusName = newStatus.value;
  errorMessage.value = '';

  requestInstance.request(
    '/candidates/set_otklik_status.php',
    'manager',
    (response) => {},
    (err) => (errorMessage.value = err)
  );
};

// Обработчик статуса кандидата
const updateStatus = (value) => {
  newStatus.value = value;
  changeRespondStatus();
};

// Показать/скрыть вопросы
const showQuestions = () => {
  show.value = !show.value;
};

onMounted(requestCandidateInfo);
</script>

<style scoped>
.questions-universal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.questions-universal__header-select {
  margin-right: 15px;
}

.questions-universal__info {
  * {
    margin: 10px 0;
  }
}

.questions-universal__question {
  margin-bottom: 20px;
}

.questions-universal__question-text {
  word-break: break-all;
  :nth-child(1) {
    margin-bottom: 0;
  }
  :nth-child(2) {
    margin-top: 8px;
  }
}

.questions-universal__error {
  color: var(--error-color);
}

.questions-universal__header-arrowicon {
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
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
