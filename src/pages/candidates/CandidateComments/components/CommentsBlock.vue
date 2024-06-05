<template>
  <div class="comments">
    <div
      v-if="isLoading"
      class="comments__spinner-wrapper"
    >
      <SpinnerMain class="comments__spinner" />
    </div>
    <h2><slot></slot></h2>
    <p
      v-if="errorMessage"
      class="comments__error"
    >
      {{ errorMessage }}
    </p>
    <template v-else>
      <template v-if="comments.length">
        <CommentCard
          v-for="comment in comments"
          :comment
          :key="comment.id"
          @delete="(payload) => createComment('delete', payload)"
          @update-comment="(payload) => createComment('update', payload)"
          class="comments__comment"
        />
      </template>
      <p v-else>Нет комментариев</p>

      <div class="comments__input">
        <label for="comment-input">Создать комментарий</label>
        <textarea
          v-model="comment"
          id="comment-input"
          class="comments__textarea"
          rows="5"
        ></textarea>
        <ButtonMain
          class="comments__button"
          @click="createComment('create', { comment })"
        >
          <template #text>Добавить комментарий</template>
        </ButtonMain>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { MainRequestClass } from '@/js/RootClasses';
import CommentCard from '@/pages/candidates/CandidateComments/components/CommentCard.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import ButtonMain from '@/components/ButtonMain.vue';

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
const isLoading = ref(false);
const errorMessage = ref('');
const comment = ref('');

const commentFor = computed(
  () => `for_${props.vacancyId ? 'otklic:' + props.vacancyId : 'candidate'}`,
);

const createComment = (action, payload) => {
  class CandidatesSetCandidateComment extends MainRequestClass {
    candidateId = '';
    action = '';

    commentFor = '';
    commentId = '';
    commentText = '';
  }

  const requestInstance = new CandidatesSetCandidateComment();
  requestInstance.candidateId = props.candidateId;
  requestInstance.action = action;

  if (action === 'create') {
    requestInstance.commentFor = commentFor.value;
  }

  if (action === 'create' || action === 'update') {
    requestInstance.commentText = payload.comment;
  }

  if (action === 'delete' || action === 'update') {
    requestInstance.commentId = payload.id;
  }

  requestInstance.request(
    '/candidates/set_candidate_comment.php',
    'manager',
    () => {
      if (action === 'create') {
        comment.value = '';
      }
      requestComments();
    },
    (err) => {
      console.log(err);
    },
  );
};

const requestComments = () => {
  class CandidateGetCandidateComments extends MainRequestClass {
    commentFor = '';
    candidateId = '';
  }
  const requestInstance = new CandidateGetCandidateComments();

  // Формируем строку вида for_candidate или for_otklic:id
  requestInstance.commentFor = commentFor.value;
  requestInstance.candidateId = props.candidateId;

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
      console.log(err);
      if (err) {
        errorMessage.value = err;
      }
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

.comments__input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comments__button {
  align-self: flex-start;
}

.comments__textarea {
  resize: none;
  padding: 10px;
  border: none;
  border-radius: 10px;
  border-color: var(--mine-shaft);
  outline: 1px solid var(--tundora);
  background-color: var(--white);
}

.comments__textarea:focus {
  outline-width: 2px;
  outline-color: var(--cornflower-blue);
}
</style>
