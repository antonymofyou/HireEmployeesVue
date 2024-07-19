<template>
  <div class="candidate-answers">
    <div class="candidate-answers__header">
      <h2 class="candidate-answers__title">Ответы кандидата</h2>
      <ButtonIcon  @click="showQuestions">
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
            class="candidate-answers__question"
            v-for="(question, index) in answers"
            :key="question.questionId"
          >
            <div class="candidate-answers__question-block">
              <p class="candidate-answers__question-header">Вопрос №{{ index + 1 }}:</p>
              <div class="candidate-answers__question-text" v-html="question.question"></div>
            </div>
            <div class="candidate-answers__question-block">
              <p class="candidate-answers__question-header">Ответ:</p>
              <div class="candidate-answers__question-text">{{ question.answer }}</div>
              <hr />
            </div>
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
  justify-content: space-between;
  align-items: center;
  height: 32px;
}

.candidate-answers__title {
  font-size: 16px;
  font-weight: 600;

  margin: 0;
}

.candidate-answers__list {
  margin-top: 15px;
}

.candidate-answers__question {
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-bottom: 20px;
}

.candidate-answers__question-block {
  word-break: break-all;
}

.candidate-answers__question-text {
  font-size: 13px;
  
  margin-top: 10px;
  margin-bottom: 10px;
}

.candidate-answers__question-header {
  font-size: 14px;
  font-weight: 600;

  margin: 0;
}

.candidate-answers__header-arrowicon {
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
}

@media screen and (max-width: 425px) {
  .candidate-answers__header-arrowicon {
    width: 25px;
    height: 25px;
  }
}

.candidate-answers__header-arrowicon--active {
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
