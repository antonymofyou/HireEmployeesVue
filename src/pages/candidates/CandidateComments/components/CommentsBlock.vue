<template>
  <div class="comments">
    <div class="comments__header">
      <div class="comments__header-title">{{ headingText }}</div>
      <ButtonIcon v-if="!respondId" @click="showComments"
        ><template #icon>
          <ArrowIcon
            :class="[
              'comments__header-arrowicon',
              { 'comments__header-arrowicon--active': show },
            ]"
          /> </template
      ></ButtonIcon>
    </div>

    <div v-if="mainErrorMessage && !isLoading" class="comments__error">
      {{ mainErrorMessage }}
    </div>

    <template v-else>
      <template v-if="!respondId">
        <!-- Открытие/сокрытие комментариев -->
        <Transition v-if="show">
          <div>
            <div class="comments__list" ref="commentsBlock">
              <div v-if="show && isLoading" class="comments__spinner-wrapper">
                <SpinnerMain class="comments__spinner" />
              </div>
              <template v-if="comments.length">
                <CommentCard
                  v-for="comment in comments"
                  :comment
                  :key="comment.id"
                  class="comments__comment"
                  @delete="deleteComment"
                  @update-comment="updateComment"
                  :errorMessage="errorMessageControls"
                />
              </template>
              <p v-if="!isLoading && !comments.length">Нет комментариев</p>
            </div>

            <CommentAddition
              v-model.trim="newComment"
              :errorMessage="errorMessageCreate"
              @create-comment="createComment({ comment: newComment })"
            />
          </div>
        </Transition>
      </template>

      <template v-else>
        <div class="comments__list" ref="commentsBlock">
          <div v-if="isLoading" class="comments__spinner-wrapper">
            <SpinnerMain class="comments__spinner" />
          </div>
          <template v-if="comments.length">
            <CommentCard
              v-for="comment in comments"
              :comment
              :key="comment.id"
              class="comments__comment"
              @delete="deleteComment"
              @update-comment="updateComment"
              :errorMessage="errorMessageControls"
            />
          </template>
          <div v-if="!isLoading && !comments.length">Нет комментариев</div>
        </div>

        <CommentAddition
          v-model.trim="newComment"
          :errorMessage="errorMessageCreate"
          @create-comment="createComment({ comment: newComment })"
        />
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import CommentCard from '@/pages/candidates/CandidateComments/components/CommentCard.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import CommentAddition from './CommentAddition.vue';
import {
  CandidatesSetCandidateComment,
  CandidateGetCandidateComments,
} from '../js/CommentsClasses.js';
import ButtonIcon from '@/components/ButtonIcon.vue';
import ArrowIcon from '@/assets/icons/arrow.svg?component';

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
const errorMessageCreate = ref('');
const errorMessageControls = ref('');
// Значение нового комментария
const newComment = ref('');
// Флаг показа комментариев
const show = ref(false);
// Ref для блока с комментариями
const commentsBlock = ref(null);
// ID созданного комментария
const createdCommentId = ref(null);

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

  errorMessageCreate.value = '';
  errorMessageControls.value = '';

  return (onSuccess) =>
    requestInstance.request(
      '/candidates/set_candidate_comment.php',
      'manager',
      onSuccess,
      (err) => {
        if (action === 'create') {
          errorMessageCreate.value = err;
        } else errorMessageControls.value = err;
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
      createdCommentId.value = res.comment.id;
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

// Показ комментариев
const showComments = () => {
  show.value = !show.value;
};

// При изменении значения свойства "createdCommentId" обновляем положение скролла в конце блока
watch(
  () => createdCommentId.value,
  () => {
    if (commentsBlock.value) {
      // Добавляем небольшой задержку, чтобы обновление высоты произошло после изменения контента
      setTimeout(() => {
        commentsBlock.value.scrollTo({
          top:
            commentsBlock.value.scrollHeight - commentsBlock.value.clientHeight,
          behavior: 'smooth',
        });
      }, 0);
    }
  }
);

onMounted(requestComments);
</script>

<style scoped>
.comments {
  font-size: 15px;
}

.comments__comment:not(:last-child) {
  margin-bottom: 10px;
}

.comments__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
}

.comments__header-title {
  font-size: 16px;
  font-weight: 600;
}

.comments__header-arrowicon {
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
}

@media screen and (max-width: 425px) {
  .comments__header-arrowicon {
    width: 25px;
    height: 25px;
  }
}

.comments__header-arrowicon--active {
  transform: rotateX(180deg);
}

.comments__spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.comments__spinner {
  height: 40px;
}

.comments__list {
  margin: 10px 0;
  padding: 10px;
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 1px solid var(--cornflower-blue);
}
</style>
