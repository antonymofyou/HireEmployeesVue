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
      <button type="button" class="question__remove-btn" title="Удалить вопрос" @click="emit('updateShowModal', props.id)">
        <DeleteIcon class="icon"/>
      </button>
    </div>
  </div>
</template>

<script setup>
import SelectMain from '@/components/SelectMain.vue';
import { ref } from 'vue';
import TextEditor from "@/components/TextEditor.vue";
import DeleteIcon from '@/assets/icons/delete.svg?component';

/* id вопроса, текст вопроса, опции для измнения статуса публикации, статус публикации вопроса, 
имя лейбла */
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
});

// Значения вопроса (текст и статус публикации)
const text = ref(props.text);
const isPublished = ref(props.isPublished);

// Обновление данных в родителе
const emit = defineEmits(['updateText', 'updateIsPublished', 'updateShowModal']);

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

.question__footer .icon {
  transform: scale(2.1);
}
</style>