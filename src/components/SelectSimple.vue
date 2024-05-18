<template>
  <div class="select">
    <label class="select__label" :for="id">{{ labelName }}: </label>
    <select
      class="select__field"
      :id="id"
      v-model="selectedOption"
      @change="updateModelValue"
    >
      <option v-for="option in options" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';

//Модель для обновления, id селекта для связи с label, имя label, опции селекта
const props = defineProps({
  modelValue: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    labelName: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
});

// Выбранная опция селекта
const selectedOption = ref(props.modelValue);

// Обновление селекта в родителе
const emit = defineEmits(['update:modelValue']);

const updateModelValue = () => {
  emit('update:modelValue', selectedOption.value);
};
</script>

<style scoped>
.select {
  display: flex;
  align-items: baseline;
}

.select__label {
  font-weight: 600;

  margin-right: 4px;
}

.select__field {
  outline: 0;
  border: 0;

  cursor: pointer;
}
</style>