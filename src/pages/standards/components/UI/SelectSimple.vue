<template>
    <div class="select-box-main" :class="{ 'select--active': openSelect }" v-click-outside="closeSelect">
      <!-- Компонент плавного открытия селекта -->
      <Transition>
        <div class="options-container-main" :class="alignClass" :style="optionsContainerStyle" v-if="openSelect">
            <div class="option-main"
                v-for="option in options"
                :key="option.id"
                :style="{ color: option.color || '' }"
                @click="setSelected(option)"
            >
                <label>{{ option.name }}</label>
            </div>
        </div>
    </Transition>
  
      <div @click="toggleSelect" class="selected-main">
        <span v-if="selected"
          class="selected-number-main"
          :data-id="selected.id"
          :style="{ color: selected.color || '' }"
        >
          {{ selected.name }}
        </span>
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

// Модель для обновления, опции селекта
// опции - массив объектов с полями: name, id, color (color опционален)
// выравнивание селекта (left или right)
const props = defineProps({
    modelValue: {
        type: [String, Number, null],
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    align: {
        type: String,
        required: false,
        default: 'left',
    },
});

// Передача значения родителю
const emit = defineEmits(['update:modelValue']);

const alignClass = computed(() => {
    return props.align === 'left' ? 'options-container-main--left-align' : 'options-container-main--right-align';
});

// Открытие селекта
const openSelect = ref(false);
// Выбранная опция
const selected = ref(null);

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
    const maxHeight = props.options.length > 5 ? '250px' : 'none';
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
    align-items: center;
    position: relative;

    min-width: 50px;
}

.options-container-main {
    color: var(--mine-shaft);
    min-width: fit-content;

    transition: all 0.4s;
    border-radius: 8px;
    overflow-y: auto;
    background-color: var(--white);
    order: 1;
    position: absolute;
    top: 35px;

    z-index: 999;
    border: 1px solid var(--transparent-blue);
    font-size: 14px;

    overflow-x: hidden;
}

.options-container-main--left-align {
    left: 0;
}

.options-container-main--right-align {
    right: 0;
}

.options-container-main::-webkit-scrollbar {
    width: 5px;
    background-color: var(--milk);
    border-radius: 0 8px 8px 0;
}

.options-container-main::-webkit-scrollbar-thumb {
    width: 100%;
    background-color: var(--transparent-blue);
    border-radius: 8px;
}

.select--active .options-container-main {
    max-height: 250px;
}

.arrow {
    margin-left: auto;
}

.select--active .arrow {
    transform: rotate(180deg);
}

.selected-main {
    border-radius: 8px;
    color: var(--transparent-blue);
    position: relative;

    order: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;

    cursor: pointer;
    padding: 5px 5px;
    gap: 10px;
    font-size: 14px;
    font-weight: 600;

    position: relative;
    min-width: 40px;
    height: 30px;
}

.selected-main::after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: var(--transparent-blue);
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
    color: var(--transparent-blue);
    font-weight: 600;

    text-align: center;
    min-width: 20px;
    min-height: 20px;
}

.option-main:hover {
    background-color: var(--link-water);
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