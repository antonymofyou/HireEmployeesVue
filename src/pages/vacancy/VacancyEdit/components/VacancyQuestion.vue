<template>
  <div class="question">
    <TextEditor
      :modelValue="text"
      @update:modelValue="updateText"
      size="medium"
      :label="labelName"
      :id="props.id"
    />
    <div class="question__footer">
      <div class="question__select">
        <span class="question__label">Опубликован:</span>
        <SelectMain
          :modelValue="isPublished"
          @update:modelValue="updateIsPublished"
          :options="options"
        />
      </div>
      <button type="button" class="question__remove-btn" title="Удалить вопрос" @click="showModalOnRemove = true">
        <img class="icon" src="@/assets/icons/delete.svg" />
      </button>

      <Teleport to="body">
        <ModalConfirmation
          :show="showModalOnRemove"
          confirmText="Удалить"
          text="Вы уверены, что хотите удалить вопрос? Это действие нельзя отменить"
          confirmButtonColor="var(--cinnabar)"
          @confirm="handleConfirmRemove"
          @cancel="handleCancelRemove"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import SelectMain from '@/components/SelectMain.vue';
import ModalConfirmation from '@/components/ModalConfirmation.vue';
import { ref } from 'vue';
import TextEditor from "@/components/TextEditor.vue";

/* id вопроса, текст вопроса, опции для измнения статуса публикации, статус публикации вопроса, 
имя лейбла, функция для удаления вопроса */
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  isPublished: {
    type: String,
    required: false,
    default: 0,
  },
  labelName: {
    type: String,
    required: false,
    default: 'Вопрос',
  },
  remove: {
    type: Function,
    required: true,
  },
});

// Значения вопроса (текст и статус публикации)
const text = ref(props.text);
const isPublished = ref(props.isPublished);

// Обновление данных в родителе
const emit = defineEmits(['updateText', 'updateIsPublished']);

// Обновление текста
const updateText = (newValue) => {
  text.value = newValue;
  emit('updateText', newValue);
};

// Обновление статуса публикации
const updateIsPublished = (newValue) => {
  isPublished.value = newValue;
  emit('updateIsPublished', newValue);
};

// Показ модального окна при удалении
const showModalOnRemove = ref(false);

// Обработчик подтверждения удаления
const handleConfirmRemove = () => {
  // удаляем вопрос при подтверждении
  props.remove(props.id);

  showModalOnRemove.value = false;
}

// Обработчик отмены удаления
const handleCancelRemove = () => {
  showModalOnRemove.value = false;
}
</script>

<style scoped>
.question__select {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.question__label {
  font-weight: 600;
}

.question__footer {
  display: flex;
  justify-content: space-between;

  margin-top: 5px;
}
.question__remove-btn {
  background-size: 100% 100%;
  background-color: transparent;
  width: 20px;
  height: 30px;
  border: 0;
  cursor: pointer;
  display: flex;
  justify-content: center; 
  align-items: center;
}
</style>