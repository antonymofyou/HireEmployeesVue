<!-- Компонент предназначен для отображения фидбэка какого-либо запроса под кнопкой (как успешное выполнение, так и ошибку)-->
<template>
    <span class="feedback" :class="feedbackTypeClass">{{ message }}</span>
</template>
  
<script setup>
import { computed } from 'vue';
// Статус фидбэка ('0' / '1'), сообщение фидбэка
const props = defineProps({
    success: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});
// Класс в зависимости от типа фидбэка
const feedbackTypeClass = computed(() => {
    return props.success === '1' ? 'feedback--success' : 'feedback--error';
});
</script>
  
<style scoped>
.feedback {
    font-size: 12px;
}
.feedback--success {
    color: var(--apple);
}
.feedback--error {
    color: var(--cinnabar);
}
</style>