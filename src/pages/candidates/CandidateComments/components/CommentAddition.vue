<template>
  <div class="comment-creation">
    <label class="comment-creation__label">
      <span>Создать комментарий</span>
      <textarea
        :value="modelValue"
        class="comment-creation__textarea"
        :rows="calculateRows"
        @input="onInput"
      ></textarea>
    </label>
    <ButtonMain
      class="comment-creation__button"
      @click="emit('createComment')"
    >
      <template #text>Добавить комментарий</template>
    </ButtonMain>
  </div>
</template>

<script setup>
import ButtonMain from '@/components/ButtonMain.vue';
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['createComment', 'update:modelValue']);

const calculateRows = ref(1);

const onInput = (event) => {
  const textarea = event.target;
  const lineCount = textarea.value.split('\n').length;
  calculateRows.value = Math.max(1, lineCount);
  emit('update:modelValue', event.target.value)
};
</script>

<style scoped>
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
  resize: vertical;
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
