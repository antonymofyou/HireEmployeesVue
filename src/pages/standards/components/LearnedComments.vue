<template>
    <div class="learned-comments">
      <template v-for="(comment, index) in comments">
        <UserComment
          :userName="comment.userName"
          :tgNick="comment.userTgNickname"
          :date="comment.learnedAt"
          :commentText="comment.learnedComment"
          :learnedCommentId="comment.learnedCommentId"
          :canEdit="comment.canEdit"
          :standardId="comment.standardId"
          :standardName="comment.standardName"
          @setCancelComment="setCancelComment"
        />
        <hr v-if="index < comments.length - 1" class="divider" />
      </template>
  
      <CancelComment v-if="isOpenCancelPopUp" :commentId="commentIdForCancel" :closePopUp="toggleCancelPopUp" :updateStandard="updateStandards" />
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import UserComment from './UserComment.vue';
import CancelComment from './PopUps/CancelComment.vue';

const props = defineProps({
    comments: {
        type: Array,
        required: true,
    },
    updateStandards: {
        type: Function,
        required: true,
    },
})

// Попап отмены комментария
const isOpenCancelPopUp = ref(false);
const toggleCancelPopUp = () => isOpenCancelPopUp.value = !isOpenCancelPopUp.value;

// Id комментария для отмены
const commentIdForCancel = ref('');

// Установка комментария для отмены
const setCancelComment = (commentId) => {
    commentIdForCancel.value = commentId;
    toggleCancelPopUp();
}
</script>
  
<style scoped>
.learned-comments {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
  
.divider {
    border: none;
    border-top: 1px solid var(--milk);
}
</style>