<template>
    <div class="access">
        <div class="access__name">
            {{ name }}
        </div>

        <div class="access__select-block">
            <SelectSimple
                :options="accessOptions"
                v-model="selectedAccess"
            />
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';
import SelectSimple from './UI/SelectSimple.vue';

// Имя пользователя, modelValue доступа для изменения
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue']);

// Опции доступа для селекта
const accessOptions = [
    { name: 'Менеджер', id: 'Менеджер', color: 'var(--ronchi)' },
    { name: 'Просмотр', id: 'Просмотр', color: 'var(--apple)' },
    { name: 'Нет', id: 'Нет' },
];

// Выбранный доступ
const selectedAccess = ref(props.modelValue || 'Нет');

// Следим за изменением значения и отправляем родителю
watch(selectedAccess, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>
  
<style scoped>
.access {
    font-size: 14px;
    width: max-content;
    padding: 4px 16px;
    border: 2px solid var(--transparent-blue);
    border-radius: 16px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.access__select-block {
    font-size: 15px;
    display: flex;
    flex-direction: column;
}
</style>