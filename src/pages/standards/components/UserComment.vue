<template>
    <div class="comment">
        <div class="comment__meta">
            <div>{{ userName }} <a v-if="tgNick" class="comment__link" :href="`https://t.me/` + tgNick">tg</a></div>
            <div v-if="standardName" class="comment__standard-name">
                {{ standardName }}<span class="comment__standard-id">id{{ standardId }}</span>
            </div>
            <div class="comment__date">{{ formattedDate }}</div>
        </div>
        <div class="comment__text">
            {{ commentText }}
            <CancelIcon v-if="canEdit === '1'" @click="$emit('setCancelComment', learnedCommentId)" class="comment__cancel-btn"/>
        </div>
    </div>
</template>
  
<script setup>
import { computed } from 'vue';
import CancelIcon from '../img/cancel.svg?component';
// Имя пользователя, тг ник, дата комментария, текст комментария, id комментария, можно ли редактировать
const props = defineProps({
  userName: {
    type: String,
    required: true,
  },
  tgNick: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  learnedCommentId: {
    type: String,
    required: true,
  },
  canEdit: {
    type: String,
    required: true,
  },
  standardId: {
    type: String,
    required: false,
    default: '',
  },
  standardName: {
    type: String,
    required: false,
    default: '',
  },
})

const formattedDate = computed(() => {
  // Разделяем дату и время
  const [datePart, timePart] = props.date.split(' ');

  // Разделяем дату на год, месяц и день
  const [year, day, month] = datePart.split('-');

  // Разделяем время на часы и минуты
  const [hour, minute] = timePart.split(':');

  // Форматируем дату в нужный формат
  return `${month}.${day}.${year.slice(2)} ${hour}:${minute}`;
});
</script>
  
<style scoped>
.comment {
  font-size: 13px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  justify-content: space-between;
  gap: 10px;
}

.comment__link {
  font-size: 11px;
}

.comment__link:hover {
  text-decoration: underline;
}

.comment__standard-name {
  font-size: 11px;
}

.comment__standard-id {
  font-size: 10px;
  margin-left: 5px;
}

.comment__meta {
  display: flex;
  flex-direction: column;
}

.comment__date {
  font-size: 11px;
}

.comment__text {
  font-size: 12px;
  word-break: break-word;
  white-space: pre-wrap;
  display: inline;
}

.comment__cancel-btn {
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  cursor: pointer;
  transition: 0.15s all;
  margin-bottom: 2px;
  margin-left: 5px;
}

.comment__cancel-btn:hover {
  color: var(--cinnabar);
}

@media screen and (max-width: 800px) {
  .comment {
    grid-template-columns: 1fr 2fr;
  }
}
</style>