<template>
  <div class="comment">
    <div class="comment__controls">
      <div class="comment__manager">{{ props.comment.managerName }}</div>
      <div v-if="userCanEdit || userCanDelete" class="comment__buttons">
        <div class="comment__buttons-box">
          <template v-if="userCanEdit">
            <button
              v-if="!isEditMode"
              class="button button--edit"
              aria-label="Редактировать"
              title="Редактировать"
              @click="onEditMode"
            >
              <img class="icon" src="@/assets/icons/edit.svg" />
            </button>
            <template v-else>
              <button
                class="button button--save"
                aria-label="Сохранить"
                title="Сохранить"
                @click="updateComment"
              >
                <img class="icon" src="@/assets/icons/save.svg" />
              </button>
              <button
                class="button button--close"
                aria-label="Отменить"
                title="Отменить"
                @click="cancelUpdate"
              >
                <img class="icon" src="@/assets/icons/close.svg" />
              </button>
            </template>
          </template>

          <button
            v-if="userCanDelete"
            class="button button--delete"
            aria-label="Удалить"
            title="Удалить"
            @click="isModalOpened = true"
          >
            <img class="icon" src="@/assets/icons/delete.svg" />
          </button>
        </div>
      </div>
    </div>

    <div class="comment__info">
      <textarea
        v-if="isEditMode"
        v-model.trim="comment"
        @input="setHeight"
        ref="editingTextareaRef"
        :style="{ height: height + 'px' }"
        class="comment__textarea"
      >
      </textarea>
      <div v-else class="comment__text" ref="commentParagraphRef">
        {{ props.comment.comment }}
      </div>
    </div>

    <div class="comment__date">{{ formattedDate }}</div>

    <ModalConfirmationNew
      v-model:show="isModalOpened"
      :confirm-button-color="'var(--cinnabar)'"
      text="Вы уверены, что хотите удалить комментарий?"
      cancel-text="Отмена"
      confirm-text="Удалить"
      :data="dataPropsDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ModalConfirmationNew from '@/components/ModalConfirmationNew.vue';

const props = defineProps({
  // Объект комментария
  comment: {
    type: Object,
    required: true,
  },

  // Сообщение об ошибке
  errorMessage: {
    type: String,
    default: '',
    required: false,
  },
  forModal: {
    type: Object,
  }
});

const emit = defineEmits(['delete', 'updateComment']);

// Состояние модального окна
const isModalOpened = ref(false);
// Режим редактирования комментария
const isEditMode = ref(false);
// Начальное значение комментария
const initialValue = props.comment.comment;
// Текст комментария
const comment = ref(initialValue);
// Нода параграфа комментария
const commentParagraphRef = ref(null);
// Нода поля для редактирования комментария
const editingTextareaRef = ref(null);
// Высота поля для редактирования комментария
const height = ref(50);

// Фокус на поле для редактирования комментария при открытии режима редактирования
watch(
  () => editingTextareaRef.value,
  () => {
    if (editingTextareaRef.value) {
      editingTextareaRef.value.focus();
    }
  }
);

// Перевычисление высоты поля для редактирования комментария
const setHeight = (e) => {
  const element = e.target;
  element.style.height = element.scrollHeight + 'px';
};

// Отключение режима редактирования, возвращение к начальному значению
const offEditMode = () => (isEditMode.value = false);

// Включение режима редактирования
const onEditMode = () => {
  // Устанавливаем высоту поля для редактирования комментария равной значению высоты параграфа комментария + 10px для отступа
  height.value = commentParagraphRef.value.scrollHeight + 10;
  isEditMode.value = true;
};

// Обновление комментария, если он изменился и отмена режима редактирования
const updateComment = () => {
  if (!(comment.value === initialValue)) {
    emit('updateComment', { id: props.comment.id, comment: comment.value });
  }
  offEditMode();
};

// Отмена режима редактирования и возвращение к начальному значению
const cancelUpdate = () => {
  comment.value = initialValue;
  offEditMode();
};

// Форматирование даты под RU локаль
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString('ru-RU')} ${d
    .toLocaleTimeString('ru-RU')
    .slice(0, -3)}`;
};

// Права на редактирование
const userCanEdit = props.comment.canEdit === '1';
// Права на удаление
const userCanDelete = props.comment.canDelete === '1';

// Если даты создания и изменения совпадают - отображаем дату создания, иначе отображаем дату изменения и пометку "изменено"
const formattedDate = computed(() => {
  const created = formatDate(props.comment.createdAt);
  const updated = formatDate(props.comment.updatedAt);
  return props.comment.createdAt === props.comment.updatedAt
    ? created
    : `${updated} (изменено)`;
});

const dataPropsDelete = reactive({
  fetch: props.forModal.fetch('delete', { id: props.comment.id }),
  dataArg: '',
  callback: props.forModal.callback(props.comment.id),
})

//Отслеживание флага модального окна для сокрытия скролла
watch(
  () => isModalOpened.value,
  () => {
    document.body.style.overflow = isModalOpened.value ? 'hidden' : '';
  }
);
</script>

<style scoped>
.comment {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  background-color: var(--white);
  font-size: 15px;
}

.icon {
  width: 100%;
  height: 100%;
  display: block;
}

.button {
  --button-color: var(--mine-shaft);
  --button-bg: var(--milk);
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 5px;
  padding: 4px;
  color: var(--button-color);
  background-color: var(--button-bg);
  font-size: 16px;
  outline-offset: 2px;
  outline-color: var(--button-color);
  transition: all 0.15s ease-in-out;
}

.button:where(:not(:disabled)):hover {
  opacity: 0.8;
  cursor: pointer;
}

.button:active {
  opacity: 1;
}

.button:disabled {
  opacity: 0.4;
}

.comment__controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment__date,
.comment__text,
.comment__manager {
  margin: 0;
}

.comment__manager {
  font-weight: bold;
  font-size: 12px;
  margin-right: 5px;
}

.comment__buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.comment__buttons-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.comment__textarea {
  font-size: 12px;
  width: 100%;
  min-height: 50px;
  padding: 5px;
  resize: none;
  border: none;
  border-radius: 8px;
  border-color: var(--mine-shaft);
  outline: 1px solid var(--tundora);
  background-color: var(--white);
}

.comment__textarea:focus {
  outline-width: 2px;
  outline-color: var(--cornflower-blue);
}

.comment__text {
  font-size: 12px;
}

.comment__date {
  font-size: 10px;
  text-align: right;
}

.comment__error {
  text-align: end;
  color: var(--error-color);
  font-size: 12px;
}
</style>
