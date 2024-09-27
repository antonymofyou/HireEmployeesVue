<template>
  <div class="comment-creation">
    <label class="comment-creation__label">
      <div class="comment-creation__for-box">
        <div>Создать комментарий</div>
        <input type="checkbox" v-model="commentFor" @change="updateCommentFor" />
        <div>(Общий комментарий)</div>
      </div>
      <textarea
        v-model="comment"
        class="comment-creation__textarea"
        ref="textarea"
        :rows="calculateRows"
        @input="onInput"
      ></textarea>
    </label>
    <ButtonMain class="comment-creation__button" :message="errorMessage" @click="sendComment">
      <template #text>Добавить комментарий</template>
    </ButtonMain>
  </div>
</template>

<script setup>
import ButtonMain from '@/components/ButtonMain.vue';
import { computed, ref } from 'vue';

//Пропс комментария
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  // Сообщение об ошибке
  errorMessage: {
    type: String,
    default: '',
    required: false,
  }
});

//События изменения значения в текстовом поле и создания комментария
const emit = defineEmits(['update:modelValue', 'createComment']);

const comment = ref(''); 
const commentFor = ref(props.modelValue.commentFor);

//Нода текстового поля
const textarea = ref(null);

const updateCommentFor = () => {
  emit('update:modelValue', { comment: comment.value, commentFor: !commentFor.value });
};

//Высота текстового поля в строках. По умолчанию 1(36px). При переносе курсора rows увеличивается только после ввода символа на новой строке
const calculateRows = computed(() => {
  const rows = comment.value.split('\n').length;
  return Math.max(1, rows);
});

//Перевычисление высоты текстового поля при заполнении
const setHeight = () => {
  textarea.value.style.height = 'auto';
  textarea.value.style.height = `${textarea.value.scrollHeight}px`;
};

//Событие изменения значения в текстовом поле
const onInput = (event) => {
  //Если поле не пустое - перевычисляем высоту при заполнении и переносе
  setHeight();

  //Если поле пустое - устанавливаем высоту в 36px
  if (event.target.value === '') {
    textarea.value.style.height = '36px';
  }
};

//Вызов события создания комментария
const sendComment = () => {
  emit('createComment', { comment: comment.value, commentFor: commentFor.value });

  //Сброс высоты текстового поля
  setTimeout(() => {
    textarea.value.style.height = '36px';
  });
};


</script>

<style scoped>
.comment-creation {
  font-size: 15px;
}

.comment-creation,
.comment-creation__label {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-creation__button {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
}

@media screen and (max-width: 700px) {
  .comment-creation__button {
    align-items: flex-start;
    flex-direction: column;
  }
}

.comment-creation__textarea {
  overflow: hidden;
  resize: none;
  padding: 10px;
  border: none;
  border-radius: 10px;
  border-color: var(--mine-shaft);
  outline: 1px solid var(--tundora);
  background-color: var(--white);
}

.comment-creation__textarea:focus {
  outline-width: 2px;
  outline-color: var(--cornflower-blue);
}
.comment-creation__for-box{
  display: flex;
  gap: 10px;
}
</style>
