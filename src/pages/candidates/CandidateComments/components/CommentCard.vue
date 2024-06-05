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
      <ButtonMain
        v-if="!isEditMode"
        @click="
          () => {
            onEditMode();
          }
        "
      >
        <template #text>Редактировать</template>
      </ButtonMain>

      <template v-else>
        <ButtonMain
          @click="
            () => {
              offEditMode();
              emit('updateComment', { id: props.comment.id, comment });
            }
          "
        >
          <template #text>Сохранить</template>
        </ButtonMain>
        <ButtonMain
          @click="
            () => {
              offEditMode();
              comment = initialValue;
            }
          "
        >
          <template #text>Отменить</template>
        </ButtonMain>
      </template>

      <ButtonMain
        @click="emit('delete', { id: props.comment.id })"
        buttonColor="var(--cinnabar)"
      >
        <template #text>Удалить</template>
      </ButtonMain>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ButtonMain from '@/components/ButtonMain.vue';

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
const offEditMode = () => {
  isEditMode.value = false;
  // comment.value = initialValue;
};
// Включение режима редактирования
const onEditMode = () => (isEditMode.value = true);

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
