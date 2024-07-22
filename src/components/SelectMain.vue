<template>
  <div class="select-box-main" :class="{ active: openSelect }" v-click-outside="closeSelect">
    <!-- Компонент плавного открытия селекта -->
    <Transition>
    <div class="options-container-main" :style="optionsContainerStyle" v-if="openSelect">
      <div class="option-main"
        
        v-for="option in options"
        :key="option.id"
        @click="setSelected(option)"
        :style="{ color: option.color || defaultColor }"
      >
        <label>{{ option.name }}</label>
      </div>
    </div>
  </Transition>

    <div @click="toggleSelect" class="selected-main">
      <span v-if="selected"
        class="selected-number-main"
        :data-id="selected.id"
        :style="{ color: selected.color || defaultColor }"
      >
        {{ selected.name }}
      </span>
      <span v-else class="selected-number-main-empty"></span>
      <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M4.0575 8.85915C4.00917 8.81206 3.8025 8.63428 3.6325 8.46866C2.56333 7.49773 0.813333 4.96485 0.279167 3.63915C0.193333 3.43781 0.0116667 2.9288 0 2.65684C0 2.39625 0.06 2.14783 0.181667 1.91078C0.351667 1.61528 0.619167 1.37823 0.935 1.24834C1.15417 1.16472 1.81 1.03483 1.82167 1.03483C2.53917 0.904936 3.705 0.833496 4.99333 0.833496C6.22083 0.833496 7.33917 0.904936 8.0675 1.01128C8.07917 1.02346 8.89417 1.15335 9.17333 1.29542C9.68333 1.55602 10 2.06503 10 2.60976V2.65684C9.9875 3.01161 9.67083 3.75767 9.65917 3.75767C9.12417 5.01193 7.46 7.48636 6.35417 8.48084C6.35417 8.48084 6.07 8.76092 5.8925 8.88269C5.6375 9.07266 5.32167 9.16683 5.00583 9.16683C4.65333 9.16683 4.325 9.06048 4.0575 8.85915Z"
          fill="#212121"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

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

// Открытие селекта
const openSelect = ref(false);
// Выбранная опция
const selected = ref(null);
// Цвет текста опций по умолчанию
const defaultColor = 'var(--mine-shaft)';

// Установка выбранной опции
const setSelected = (option) => {
  selected.value = option;
  openSelect.value = false;
  emit('update:modelValue', option.id);
};

// Закрытие селекта
const closeSelect = () => {
  openSelect.value = false;
}

// Переключатель открытия селекта
const toggleSelect = () => {
  openSelect.value = !openSelect.value;
};

// Дополнительные стили для контейнера (для корректного отображения скролла)
const optionsContainerStyle = computed(() => {
  const maxHeight = props.options.length > 5 ? '200px' : 'none';
  return {
    maxHeight: maxHeight,
  };
});

// Установка значения и орбаботчика при монтировании
onMounted(() => {
  selected.value = props.options.find(option => option.id == props.modelValue) || null;
});

// Отслеживание изменений
watch(() => props.modelValue, (newValue) => {
  selected.value = props.options.find(option => option.id == newValue) || null;
});

// Директива для закрытия селекта по клику снаружи
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      // Проверка местоположения элемента
      if (!(el === event.target || el.contains(event.target))) {
        // Вызываем метод после срабатывания клика снаружи
        binding.value(event);
      }
    };
    // Добавляем обработчик нажатия
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    // Удаляем обработчик при размонтировании
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
</script>

<style scoped>
.select-box-main {
  display: flex;
  width: max-content;
  flex-direction: column;
  position: relative;
}

.options-container-main {
  color: var(--cornflower-blue);
  min-width: fit-content;
  width: 100%;
  transition: all 0.4s;
  border-radius: 8px;
  overflow-y: auto;
  background-color: var(--white);
  order: 1;
  position: absolute;
  top: 25px;
  left: 0;

  z-index: 999;
  border: 1px solid var(--cornflower-blue);
  color: var(--mine-shaft);
  font-size: 14px;

  overflow-x: hidden;
}

@media (max-width: 766px) {
  .options-container-main {
    min-width: 60%; 
  }
}

@media (max-width: 468px) {
  .options-container-main {
    min-width: 40%; 
  }
}

@media (max-width: 364px) {
  .options-container-main {
    min-width: 80%; 
  }
}

.options-container-main::-webkit-scrollbar {
  width: 5px;
  background-color: #eee5ff;
  border-radius: 0 8px 8px 0;
}

.dark .options-container-main::-webkit-scrollbar {
  background-color: var(--tundora);
}

.options-container-main::-webkit-scrollbar-thumb {
  width: 100%;
  background-color: var(--cornflower-blue);
  border-radius: 8px;
}

.active .options-container-main {
  max-height: 200px;
}

.dark .options-container-main {
  color: var(--white);
  background-color: var(--shark);
  border: 2px solid var(--tundora);
}

.active .arrow {
  transform: rotate(180deg);
}

.dark .arrow path {
  fill: var(--white);
}

.selected-main {
  border-radius: 8px;
  color: var(--cornflower-blue);
  position: relative;

  order: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 5px;

  cursor: pointer;
  padding: 5px 5px;
  gap: 10px;
  color: var(--mine-shaft);
  font-size: 14px;

  position: relative;
}


.dark .selected-main {
  color: var(--white);
}

.selected-main::after {
  content: '';
  width: 100%;
  height: 1px;
  background-color: var(--cornflower-blue);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.selected-number-main-empty{
  min-width: 60px;
}

.option-main {
  cursor: pointer;
  padding: 5px 10px;
  transition: 0.1s ease;
}

.option-main:hover {
  background-color: var(--black-squeeze);
}

.option-main label {
  cursor: pointer;
}

.radio-main {
  display: none;
}

/* Transition */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>


