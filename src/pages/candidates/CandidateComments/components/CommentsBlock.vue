<template>
  <div class="comments">
    <div
      v-if="isLoading"
      class="comments__spinner-wrapper"
    >
      <SpinnerMain class="comments__spinner" />
    </div>

    <h2>{{ headingText }}</h2>

    <p
      v-if="errorMessage && !isLoading"
      class="comments__error"
    >
      {{ errorMessage }}
    </p>

    <template v-else>
      <div class="comments__list">
        <div v-if="comments.length">
          <CommentCard
            v-for="comment in comments"
            :comment
            :key="comment.id"
            class="comments__comment"
            @delete="deleteComment"
            @update-comment="updateComment"
          />
        </div>
        <p v-else>Нет комментариев</p>
      </div>

      <CommentAddition
        v-model.trim="newComment"
        @create-comment="createComment({ comment: newComment })"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CommentCard from '@/pages/candidates/CandidateComments/components/CommentCard.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import CommentAddition from './CommentAddition.vue';
import {
  CandidatesSetCandidateComment,
  CandidateGetCandidateComments,
} from '../js/CommentsClasses.js';

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

// Массив комментариев
const comments = ref([]);
// Состояние загрузки
const isLoading = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');
// Значение нового комментария
const newComment = ref('');

// Формируем строку вида "for_otklic:id" или "for_candidate"
const commentFor = computed(
  () => `for_${props.vacancyId ? 'otklic:' + props.vacancyId : 'candidate'}`,
);

// Заголовок блока, если передано ID вакансии - "Комментарии на отклик кандидата", иначе "Комментарии на кандидата"
const headingText = computed(() => {
  return props.vacancyId
    ? 'Комментарии на отклик кандидата'
    : 'Комментарии на кандидата';
});

// Функция для работы с комментариями, принимает action ('create', 'update', 'delete') и payload {id, comment}
const dispatchComments = (action, payload) => {
  const requestInstance = new CandidatesSetCandidateComment();
  requestInstance.candidateId = props.candidateId;
  requestInstance.action = action;
  requestInstance.commentFor = commentFor.value;
  requestInstance.commentText = payload.comment || '';
  requestInstance.commentId = payload.id || '';

  return (onSuccess, onError) =>
    requestInstance.request(
      '/candidates/set_candidate_comment.php',
      'manager',
      onSuccess,
      onError,
    );
};

// Обновление комментария
const updateComment = (payload) => {
  dispatchComments('update', payload)(requestComments);
};

// Удаление комментария
const deleteComment = (payload) => {
  dispatchComments('delete', payload)(requestComments);
};

// Создание комментария
const createComment = (payload) => {
  if (payload.comment) {
    const onCreateSuccess = () => {
      requestComments();
      newComment.value = '';
    };
    dispatchComments('create', payload)(onCreateSuccess);
  }
};

// Запрос комментариев
const requestComments = () => {
  const requestInstance = new CandidateGetCandidateComments();
  requestInstance.commentFor = commentFor.value;
  requestInstance.candidateId = props.candidateId;

  // При старте запроса состояние загрузки меняется на true и обнуляется значение сообщения об ошибке
  isLoading.value = true;
  errorMessage.value = '';

  requestInstance.request(
    '/candidates/get_candidate_comments.php',
    'manager',
    (response) => {
      comments.value = response.comments;
      isLoading.value = false;
    },
    (err) => {
      errorMessage.value = err || 'Произошла ошибка при получении комментариев';
      isLoading.value = false;
    },
  );
};

onMounted(requestComments);
</script>

<style scoped>
.comments__comment:not(:last-child) {
  margin-bottom: 10px;
}

.comments__spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.comments__spinner {
  height: 70px;
}

.comments__error {
  color: var(--error-color);
}

.comments__list {
  margin-bottom: 10px;
}
</style>
