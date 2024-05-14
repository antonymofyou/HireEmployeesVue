<script setup>
import InputComponent from '@/components/InputComponent.vue';
import SelectComponent from '@/components/SelectComponent.vue';
import { ref } from 'vue';

/* id вопроса, текст вопроса, опции для измнения статуса публикации, статус публикации вопроса, 
имя лейбла, функция для удаления вопроса */
const props = defineProps({
  id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      required: true,
    },
    isPublished: {
      type: String,
      default: 0,
    },
    labelName: {
      type: String,
      default: 'Вопрос',
    },
    remove: {
      type: Function,
      required: true,
    },
});

// Текст перед выбором статуса публикации
const selectText = 'Опубликован';

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
</script>

<template>
  <div class="question">
    <InputComponent
      :modelValue="text"
      @update:modelValue="updateText"
      :id="id"
      :labelName="labelName"
      inputType="textarea"
      size="medium"
    />
    <div class="question__footer">
      <SelectComponent
        :modelValue="isPublished"
        @update:modelValue="updateIsPublished"
        :id="`${id}_isPublished`"
        :options="options"
        :labelName="selectText"
      />
      <button type="button" class="question__remove-btn" title="Удалить вопрос" @click="remove(id)"></button>
    </div>
  </div>
</template>

<style scoped>
.question__footer {
  display: flex;
  justify-content: space-between;

  margin-top: 10px;
}
.question__remove-btn {
  background-image: url('@/assets/icons/delete.svg');
  background-size: 100% 100%;
  background-color: transparent;
  width: 20px;
  height: 20px;
  border: 0;
  cursor: pointer;
}
</style>