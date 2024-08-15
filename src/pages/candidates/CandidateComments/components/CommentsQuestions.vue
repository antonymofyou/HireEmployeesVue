<template>
  <div class="candidate-answers">
    <div class="candidate-answers__header">
      <h2 class="candidate-answers__title">Ответы кандидата</h2>
      <ButtonIcon @click="showQuestions">
        <template #icon>
          <ArrowIcon
            :class="[
              'candidate-answers__header-arrowicon',
              { 'candidate-answers__header-arrowicon--active': show },
            ]"
          /> </template
      ></ButtonIcon>
    </div>

    <!-- Вопросы вакансии и ответы кандидата -->
    <Transition>
      <div class="candidate-answers__list" v-if="show">
        <template v-if="answers.length">
          <div
            class="questions-universal__question"
            v-for="(question, index) in answers"
            :key="question.questionId"
          >
            <div class="questions-universal__question-text">
              <div class="candidate-answers__question-header">
                <b>Вопрос №{{ index + 1 }}:</b>
              </div>
              <div
                class="questions-universal__answer-text"
                v-html="question.question"
              ></div>
            </div>
            <div class="questions-universal__question-text answer-block">
              <div class="candidate-answers__question-header">
                <b>Ответ:</b>
              </div>
              <div class="questions-universal__answer-text">
                {{ question.answer }}
              </div>
            </div>
            <hr class="questions-universal__hr-divider" />
          </div>
        </template>
        <p v-else>Нет данных</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ArrowIcon from '@/assets/icons/arrow.svg?component';
import ButtonIcon from '@/components/ButtonIcon.vue';

// Массив ответов кандидата
const props = defineProps({
  answers: {
    type: Array,
    required: true,
  },
});

// Флаг показа вопросов
const show = ref(false);

// Показать/скрыть вопросы
const showQuestions = () => {
  show.value = !show.value;
};
</script>

<style scoped>
.candidate-answers {
  font-size: 14px;
}

.candidate-answers__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}

.candidate-answers__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.candidate-answers__list {
  margin-top: 15px;
}

.questions-universal__question {
  margin-top: 30px;
}

.questions-universal__hr-divider {
  margin: 20px 0;
}

.questions-universal__info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 5px 0;
}

.candidate-answers__question-header {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--cornflower-blue);
}

.candidate-answers__header-arrowicon {
  width: 30px;
  height: 30px;
  transition: all 0.3s ease;
}

.questions-universal__question-text.answer-block {
  margin-top: 20px;
}

.candidate-answers__header-arrowicon--active {
  transform: rotateX(180deg);
}

.questions-universal__answer-text {
  margin-top: 10px;
  font-size: 13px;
  white-space: pre-wrap;
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

@media screen and (width <= 425px) {
  .candidate-answers__header-arrowicon {
    width: 25px;
    height: 25px;
  }
}
</style>
