<template>
  <div class="comments">
    <h2>{{ headingText }}</h2>

    <div v-if="isLoading" class="comments__spinner-wrapper">
      <SpinnerMain class="comments__spinner" />
    </div>

    <p v-if="mainErrorMessage && !isLoading" class="comments__error">
      {{ mainErrorMessage }}
    </p>

    <template v-else>
      <div class="comments__list">
        <template v-if="comments.length">
          <CommentCard
            v-for="comment in comments"
            :comment
            :key="comment.id"
            class="comments__comment"
            @delete="deleteComment"
            @update-comment="updateComment"
          />
        </template>
        <p v-if="!isLoading && !comments.length">Нет комментариев</p>
      </div>

      <CommentAddition
        v-model.trim="newComment"
        @create-comment="createComment({ comment: newComment })"
      />
    </template>
    <Teleport to="body">
      <ErrorNotification v-if="errorMessage" :message="errorMessage" />
    </Teleport>
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
import ErrorNotification from '@/components/ErrorNotification.vue';

const props = defineProps({
  // ID вакансии, если передано - получаем комментарии для кандидата по отношению к отклику, иначе общие комментарии для кандидата
  respondId: {
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
// Сообщение об ошибках
const mainErrorMessage = ref('');
const errorMessage = ref('');
// Значение нового комментария
const newComment = ref('');

// Формируем строку вида "for_otklik:id" или "for_candidate"
const commentFor = computed(
  () => `for_${props.respondId ? 'otklik:' + props.respondId : 'candidate'}`
);

// Заголовок блока, если передано ID вакансии - "Комментарии на отклик кандидата", иначе "Комментарии на кандидата"
const headingText = computed(() => {
  return props.respondId
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

  errorMessage.value = '';

  return (onSuccess) =>
    requestInstance.request(
      '/candidates/set_candidate_comment.php',
      'manager',
      onSuccess,
      (err) => {
        errorMessage.value = err;
      }
    );
};

// Обновление комментария
const updateComment = (payload) => {
  // Обновление комментария в массиве без перезапроса на сервер
  const onUpdateSuccess = (res) => {
    if (res.success) {
      const id = comments.value.findIndex(
        (comment) => comment.id === payload.id
      );
      comments.value[id].comment = payload.comment;
      comments.value[id].updatedAt = res.comment.updatedAt;
    }
  };
  // Функция для запроса на обновление комментария
  const requestFn = dispatchComments('update', payload);
  requestFn(onUpdateSuccess);
};

// Удаление комментария
const deleteComment = (payload) => {
  // Удаление комментария из массива без перезапроса на сервер
  const onDeleteSuccess = () => {
    comments.value = comments.value.filter(
      (comment) => comment.id !== payload.id
    );
  };
  // Функция для запроса на удаление комментария
  const requestFn = dispatchComments('delete', payload);
  requestFn(onDeleteSuccess);
};

// Создание комментария
const createComment = (payload) => {
  if (payload.comment) {
    // Перезапрос комментариев, очистка поля для нового комментария
    const onCreateSuccess = (res) => {
      comments.value.push(res.comment);
      newComment.value = '';
    };
    // Функция для запроса на создание комментария
    const requestFn = dispatchComments('create', payload);
    requestFn(onCreateSuccess);
  }
};

// Запрос комментариев
const requestComments = () => {
  const requestInstance = new CandidateGetCandidateComments();
  requestInstance.commentFor = commentFor.value;
  requestInstance.candidateId = props.candidateId;

  // При старте запроса состояние загрузки меняется на true и обнуляется значение сообщения об ошибке
  isLoading.value = true;
  mainErrorMessage.value = '';

  requestInstance.request(
    '/candidates/get_candidate_comments.php',
    'manager',
    (response) => {
      comments.value = response.comments;
      isLoading.value = false;
    },
    () => {
      mainErrorMessage.value = 'Произошла ошибка при получении комментариев';
      isLoading.value = false;
    }
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
  padding: 10px;
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 1px solid var(--cornflower-blue);
}
</style>
