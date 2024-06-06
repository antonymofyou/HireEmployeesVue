<template>
  <div class="comment">
    <div class="comment__info">
      <p class="comment__manager">{{ props.comment.managerName }}</p>
      <p class="comment__date">{{ formattedDate }}</p>
    </div>

    <textarea
      v-if="isEditMode"
      v-model="comment"
      row="2"
      class="comment__textarea"
    >
    </textarea>
    <p
      v-else
      class="comment__text"
    >
      {{ props.comment.comment }}
    </p>

    <div class="comment__buttons">
      <button
        v-if="!isEditMode"
        class="button button--edit"
        aria-label="Редактировать"
        title="Редактировать"
        @click="onEditMode"
      >
        <IconEdit />
      </button>

      <template v-else>
        <button
          class="button button--save"
          aria-label="Сохранить"
          title="Сохранить"
          @click="updateComment"
        >
          <IconSave />
        </button>
        <button
          class="button button--close"
          aria-label="Отменить"
          title="Отменить"
          @click="cancelUpdate"
        >
          <IconClose />
        </button>
      </template>

      <button
        class="button button--delete"
        aria-label="Удалить"
        title="Удалить"
        @click="emit('delete', { id: props.comment.id })"
      >
        <IconDelete />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ButtonMain from '@/components/ButtonMain.vue';
import IconSave from './IconSave.vue';
import IconEdit from './IconEdit.vue';
import IconDelete from './IconDelete.vue';
import IconClose from './IconClose.vue';

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['delete', 'updateComment']);
// Режим редактирования комментария
const isEditMode = ref(false);
// Начальное значение комментария
const initialValue = props.comment.comment;
// Текст комментария
const comment = ref(initialValue);

// Отключение режима редактирования, возвращение к начальному значению
const offEditMode = () => (isEditMode.value = false);

// Включение режима редактирования
const onEditMode = () => (isEditMode.value = true);

const updateComment = () => {
  if (!(comment.value === initialValue)) {
    emit('updateComment', { id: props.comment.id, comment: comment.value });
  }
  offEditMode();
};

const cancelUpdate = () => {
  comment.value = initialValue;
  offEditMode();
};

// Форматирование даты под RU локаль
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString('ru-RU')} ${d.toLocaleTimeString('ru-RU')}`;
};

// Если даты создания и изменения совпадают - отображаем дату создания, иначе отображаем дату изменения и пометку "изменено"
const formattedDate = computed(() => {
  const created = formatDate(props.comment.createdAt);
  const updated = formatDate(props.comment.updatedAt);
  return created === updated ? created : `${updated} (изменено)`;
});
</script>

<style scoped>
.comment {
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  background-color: var(--white);
}

.button {
  --button-color: var(--white);
  --button-bg: var(--milk);

  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 5px;
  padding: 10px;
  color: var(--button-color);
  background-color: var(--button-bg);
  font-size: 20px;
  outline-offset: 2px;
  outline-color: var(--button-color);
  transition: all 0.15s ease-in-out;
}

.button:not(:disabled):hover {
  opacity: 0.8;
  cursor: pointer;
}

.button:active {
  opacity: 1;
}

.button:disabled {
  opacity: 0.4;
}

.button--delete {
  --button-bg: var(--error-color);
}

.button--save {
  --button-bg: var(--success-color);
}

.button--close {
  --button-bg: var(--tundora);
}

.button--edit {
  --button-bg: var(--cornflower-blue);
}

.comment__date,
.comment__text,
.comment__manager {
  margin: 0;
}

.comment__manager {
  font-size: 20px;
}

.comment__info,
.comment__text {
  margin-bottom: 10px;
}

.comment__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.comment__textarea {
  font-size: 16px;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  resize: none;
  border: none;
  border-radius: 10px;
  border-color: var(--mine-shaft);
  outline: 1px solid var(--tundora);
  background-color: var(--white);
}

.comment__textarea:focus {
  outline-width: 2px;
  outline-color: var(--cornflower-blue);
}

.comment__text {
  font-size: 16px;
}

.comment__date {
  font-size: 10px;
}
</style>
