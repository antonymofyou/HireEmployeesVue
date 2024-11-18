<template>
    <div class="font-picker">
        <SelectSimple 
            :options="options" 
            :model-value="currentFont" 
            @update:model-value="updateHandler"
        />
        <FormatText />
    </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import SelectSimple from '../../UI/SelectSimple.vue';
import FormatText from 'vue-material-design-icons/FormatText.vue';

// Объект редактора
const editor = inject('editor');

// Значения для селекта
const options = [
    {
        id: 1,
        name: "12px",
    },
    {
        id: 2,
        name: "16px",
    },
    {
        id: 3,
        name: "20px",
    },
    {
        id: 4,
        name: "24px",
    },
    {
        id: 5,
        name: "28px",
    },
];

const defaultFont = {
    id: 2,
    name: "16px",
};

// Текущий размер
const currentFont = computed(() => {
    const editorFontSize = editor.value?.getAttributes('textStyle').fontSize;
    const { id } = options.filter(({ name }) => name == editorFontSize)[0] || {};

    return id || defaultFont.id;
});

// Обработчик обновления селекта
const updateHandler = function (idFontSize) {
    const { name } = options.filter(({ id }) => id == idFontSize)[0] || {};

    editor.value?.chain().focus().setFontSize(name || defaultFont.name).run();
}

</script>

<style scoped>

.font-picker {
    display: flex;
    align-items: center;
    gap: 4px;
    user-select: none;
}

.font-picker:deep(.material-design-icon) {
    display: block;
    width: 24px;
    height: 24px;
}

</style>