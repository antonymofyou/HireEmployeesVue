<template>
  <div class="question">
    <span class="question__title">{{ title }}</span>
    <div class="question__text" v-html="question"></div>
    <InputSimple
      :model-value="answer"
      input-type="textarea"
      size="extra-medium"
      placeholder="Введите ваш ответ..."
      :disabled="disabled"
      @update:model-value="updateAnswer"
    />
  </div>
</template>

<script setup>
import InputSimple from '@/components/InputSimple.vue';

import { ref } from 'vue';

// заголовок вопроса, текст вопроса, текст ответа, disabled
const props = defineProps({
  title: {
    type: String,
    default: '',
    required: true,
  },
  question: {
    type: String,
    default: '',
    required: true,
  },
  answer: {
    type: String,
    default: '',
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
    required: true,
  },
});

// Значение ответа
const answer = ref(props.answer);

// Обновление данных в родителе
const emit = defineEmits(['updateAnswer']);

// Обновление текста
const updateAnswer = (newValue) => {
  answer.value = newValue;
  emit('updateAnswer', newValue);
};
</script>

<style scoped>
.question__title {
  font-weight: 600;
}

.question__text {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
