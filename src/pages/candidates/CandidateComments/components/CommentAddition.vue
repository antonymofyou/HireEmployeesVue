<template>
  <div class="comment-creation">
    <label class="comment-creation__label">
      <div class="comment-creation__label-box">
        <div>Создать комментарий</div>
        <div class="comment-creation__for-box">
          <input type="checkbox" :checked="newComment.commentFor" @change="updateCommentFor" />  
          <div>Комментарий к кандидату</div>
        </div>
      </div>
      <textarea
        :value="newComment.comment"
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
  // Сообщение об ошибке
  errorMessage: {
    type: String,
    default: '',
    required: false,
  }
});

// Используем ref для newComment
const newComment = ref({
  comment: '',
  commentFor: false
});
//События изменения значения в текстовом поле и создания комментария
const emit = defineEmits(['createComment']);
// Флаг, отслеживающий состояние кнопки
const isButtonActive = ref(false);
//Нода текстового поля
const textarea = ref(null);
// Функция для обновления значения commentFor
const updateCommentFor = () => {
  newComment.value.commentFor = !newComment.value.commentFor;
};

//Высота текстового поля в строках. По умолчанию 1(36px). При переносе курсора rows увеличивается только после ввода символа на новой строке
const calculateRows = computed(() => {
  const rows = newComment.value.comment.split('\n').length;
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
  newComment.value.comment = event.target.value; // Обновляем значение вручную
};

//Вызов события создания комментария
const sendComment = () => {
  // Проверяем состояние кнопки
  if (!isButtonActive.value) {
    isButtonActive.value = true; // Устанавливаем флаг в true
    // Передаем объект newComment в emit
    emit('createComment', newComment.value);
    // Сброс высоты текстового поля
    setTimeout(() => {
      textarea.value.style.height = '36px';
      isButtonActive.value = false; // Сбрасываем флаг в false
      newComment.value.comment = ""
      newComment.value. commentFor =  false
    }, );
  }
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
.comment-creation__label-box{
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.comment-creation__for-box{
  display: flex;
  gap: 10px;
}
</style>
