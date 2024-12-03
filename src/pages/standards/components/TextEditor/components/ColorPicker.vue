<template>
    <div class="color-picker">
        <input
            type="color"
            @input="handleInput"
            :value="currentColor"
            class="color-picker__input"
        />
        <button @click="resetColor" class="color-picker__reset-button">
            <ColorResetIcon />
        </button>
    </div>
</template>
  
<script setup>
import { watch, ref, inject } from 'vue';
import ColorResetIcon from 'vue-material-design-icons/FormatColorMarkerCancel.vue';

// Объект редактора
const editor = inject('editor');

// Вычисляемый цвет по умолчанию в зависимости от темы
const defaultColor = ref('#000000');

// Преобразования rgb(...) в шестнадцатеричный код
const rgbToHex = (rgb) => {
    // Извлекаем числа из строки rgb
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) {
        return defaultColor;
    }
    // Преобразуем каждое число в двухзначную шестнадцатеричную строку
    const r = parseInt(result[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(result[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(result[2], 10).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

// Текущий цвет
const currentColor = ref(defaultColor.value);

// Функция для обновления цвета
const updateCurrentColor = () => {
    if (editor.value) {
        const attributes = editor.value.getAttributes('textStyle') || {};
        if (attributes.hasOwnProperty('color') && attributes.color) {
            let color = attributes.color;
            // Если цвет в формате rgb(...), преобразуем его
            if (color.startsWith('rgb(')) {
                color = rgbToHex(color);
            }
            currentColor.value = color;
        } else {
            currentColor.value = defaultColor.value;
        }
    }
};

// Отслеживание выделения в редакторе
watch(
    () => editor.value?.state.selection,
    () => {
        updateCurrentColor();
    }
)

// Обработка изменения цвета
const handleInput = (event) => {
    const color = event.target.value;
    editor.value.chain().focus().setColor(color).run();
};

// Сброс цвета к значению по умолчанию
const resetColor = () => {
    editor.value.chain().focus().unsetColor().run();
    currentColor.value = defaultColor.value;
};
</script>

<style scoped>
.color-picker {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
}

.color-picker__input {
    width: 24px;
    height: 24px;
    border: none;
    cursor: pointer;
    background-color: transparent;
    border-radius: 10px;
}

.color-picker__reset-button {
    width: 32px;
    height: 32px;
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
    transition: all .15s ease-in-out;
    margin-top: 2px;
}
</style>