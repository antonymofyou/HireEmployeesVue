<template>
  <div class="comment-creation">
    <label class="comment-creation__label">
      <div>Создать комментарий</div>
      <textarea
        :value="modelValue"
        class="comment-creation__textarea"
        ref="textarea"
        :rows="calculateRows"
        @input="onInput"
      ></textarea>
    </label>
    <ButtonMain class="comment-creation__button" @click="sendComment">
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
    type: String,
    required: true,
  },
});

//События изменения значения в текстовом поле и создания комментария
const emit = defineEmits(['createComment', 'update:modelValue']);

//Нода текстового поля
const textarea = ref(null);

//Высота текстового поля в строках. По умолчанию 1(36px). При переносе курсора rows увеличивается только после ввода символа на новой строке
const calculateRows = computed(() => {
  const rows = props.modelValue.split('\n').length;
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

  //Вызов события изменения пропса комментария
  emit('update:modelValue', event.target.value);
};

//Вызов события создания комментария
const sendComment = () => {
  emit('createComment');

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
  align-self: flex-start;
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
</style>
