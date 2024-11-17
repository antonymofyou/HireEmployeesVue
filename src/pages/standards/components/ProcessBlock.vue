<template>
    <div class="process">
        <div class="process__header">
            <span class="process__name">{{ processName }}</span>
        </div>
        <div class="process__standards">
            <div v-for="standard in process" @click="() => pickStandard(standard.id)" class="process__standard-item">
                <PageIcon class="process__standard-page-icon" width="13" height="13" />
                <span>{{ standard.name ? standard.name : `id${standard.id}` }}</span>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import PageIcon from '../img/page.svg?component';

// Массив процесса (стандарты, входящие в процесс), название процесса, функция выбора стандарта
const props = defineProps({
    process: {
        type: Array,
        required: true,
    },
    processName: {
        type: String,
        required: true,
    },
    pickStandard: {
        type: Function,
        required: true,
    },
});
</script>
  
<style scoped>
.process__header {
    display: flex;
    align-items: baseline;
    gap: 7px;
    word-break: break-word;
}
  
.process__name {
    font-size: 16px;
    font-weight: 700;
    color: var(--transparent-blue)
}
  
.process__standards {
    font-size: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  
    margin-top: 5px;
    padding-left: 24px;
}
  
.process__standard-item {
    display: flex;
    gap: 5px;
    cursor: pointer;
    transition: 0.1s all;
    line-height: 1;
    word-break: break-word;
}
  
.process__standard-item:hover {
    color: var(--transparent-blue);
}
  
.process__standard-page-icon {
    flex-shrink: 0;
}
</style>