<template>
    <div class="process">
        <button
            v-if="treeFormat && process[0].canEdit !== '0'"
            @pointerdown="pickProcess(processName)"
            @keydown.enter.space="pickProcess(processName)"
            class="process__users"
        >
            <UserIcon class="process__user-icon" />
        </button>
        <Accordion 
            :disabled="!treeFormat" 
            :initial-value="!treeFormat"
        >
            <template #title>{{ processName }}</template>
            <template #content>
                <div class="process__list">
                    <button 
                        v-for="standard in process"
                        @pointerdown="pickStandard(standard.id)"
                        @keydown.enter.space="pickStandard(standard.id)"
                        class="process__item"
                    >
                        <PageIcon class="process__page-icon" />
                        <span>{{ standard.name ? standard.name : `id${standard.id}` }}</span>
                    </button>
                </div>
            </template>
        </Accordion>
    </div>
</template>
  
<script setup>
import Accordion from '@/components/Accordion.vue';
import UserIcon from '../img/user.svg?component';
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
    pickProcess: {
        type: Function,
        required: false,
        default: undefined,
    },
    treeFormat: {
        type: Boolean,
        required: false,
        default: false,
    }
});
</script>
  
<style scoped>

.process {
    display: flex;
    gap: 8px;
}

.process__users {
    width: 18px;
    height: 18px;
    cursor: pointer;
    background-color: transparent;
    outline: none;
    border: none;
    padding: 0;
}

.process__user-icon {
    fill: currentColor;
    transition: color .15s;
}

.process__users:hover {
    color: var(--transparent-blue);
}

.process:deep(.accordion__trigger) {
    justify-content: flex-start;
    font-size: 16px;
    font-weight: 700;
    color: var(--transparent-blue);
}

.process:deep(.accordion__arrow) {
    width: 10px;
    height: 10px;
    fill: var(--transparent-blue);
}

.process__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.process__page-icon {
    width: 13px;
    height: 13px;
    margin: 0 6px 0 0;
}

.process__item {
    cursor: pointer;
    word-break: break-word;
    background-color: transparent;
    outline: none;
    border: none;
    text-align: start;
    padding: 0 0 0 16px;
}

.process__item:hover {
    color: var(--transparent-blue);
}
</style>