<template>
    <div class="select-box-main" :class="{ active: openSelect }" v-click-outside="closeSelect">
      <!-- Компонент плавного открытия селекта -->
      <Transition>
      <div class="show-status">
        <div class="option-main"
          v-for="option in options"
          :key="option.id"
          @click="setSelected(option)"
          :style="{ color: option.color || defaultColor }"
          :class="{ selected: selectedOption && selectedOption.id === option.id }"
        >
        <StatusColored
        class="status"
        :statusColor="option.color"
        :statusText="option.name"
        :statusCount="option.count || 0">
          </StatusColored>


        </div>
      </div>
    </Transition>
  
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
import StatusColored from './StatusColored.vue';
  
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
    countCanditates: {
        type: Array,
        required: true,
    }
  });
  
  // Передача значения родителю
  const emit = defineEmits(['update:modelValue']);
  
  // Открытие селекта
  const openSelect = ref(false);
  // Выбранная опция
  const selected = ref(null);
  // Цвет текста опций по умолчанию
  const defaultColor = 'var(--mine-shaft)';
  
  // Установка выбранной опции
  const setSelected = (option) => {
    selectedOption.value = option;
    openSelect.value = false;
    emit('update:modelValue', option.id);
  };
  
  // Закрытие селекта
  const closeSelect = () => {
    openSelect.value = false;
  }
  
  



 
  </script>
  
  <style scoped>
  .show-status{
    display: flex;
    max-width: 100%;
  }
 
  .option-main.selected{
    opacity: 1;
  }
  
  .option-main {
    cursor: pointer;
    padding: 5px 10px;
    transition: 0.1s ease;
    opacity: 0.4;
  }
  
  
  .option-main:hover {
    opacity: 1;
  }
  
  .option-main label {
    cursor: pointer;
  }


  </style>
  
  
  