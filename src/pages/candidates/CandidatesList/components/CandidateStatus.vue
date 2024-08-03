<template>
    <div class="show-status">
      <div class="option-main"
        v-for="option in options"
        :key="option.id"
        @click="setSelected(option)"
        :style="{ color: option.color || defaultColor }"
        :class="{ selected: selectedOption && selectedOption.id === option.id }">
        <StatusColored
            class="status"
            :statusColor="option.color"
            :statusText="`${option.name} - ${option.count}`">
        </StatusColored>
      </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import StatusColored from '../../../../components/StatusColored.vue'
const selectedOption = ref(null); //Хранит выбранный статус 
const props = defineProps({
  // Модель для обновления, опции селекта
  modelValue: {
    type: [String, Number],
    required: true,
  },
  // опции - массив объектов с полями: name, id, color (color опционален)
  options: {
    type: Array,
    required: true,
  },
});
// Передача значения родителю
const emit = defineEmits(['update:modelValue']);
// Цвет текста опций по умолчанию
const defaultColor = 'var(--mine-shaft)';
// Установка выбранной опции
const setSelected = (option) => {
  selectedOption.value = option;
  emit('update:modelValue', option.id);
};
watchEffect(() => {
  selectedOption.value = props.options.find(option => option.id == props.modelValue) || null;
});
</script>

<style scoped>
.show-status{
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}
.option-main.selected{
  opacity: 1;
}
.option-main {
  cursor: pointer;
  padding: 5px 10px;
  transition: 0.1s ease;
  opacity: 0.35;
}
.option-main:hover {
  opacity: 1;
}
.option-main label {
  cursor: pointer;
}
.status{
  cursor: pointer;
}
</style>