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
      <ArrowIcon
          :class="[
            'universal__header-arrowicon',
            { 'universal__header-arrowicon--active': openSelect },
          ]"
        />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ArrowIcon from '@/assets/icons/arrow-down.svg?component';

// Модель для обновления, опции селекта
// опции - массив объектов с полями: name, id, color (color опционален)
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
    required: true,
  },
  options: {
    type: Array,
    default: null,
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

.universal__header-arrowicon {
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
}

.universal__header-arrowicon--active {
  transform: rotateX(180deg);
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


