<template>
    <div class="process">
        <Accordion 
            :disabled="!treeFormat" 
            :initial-value="!treeFormat"
        >
            <template #title>{{ processName }}</template>
            <template #icon><ArrowIcon class="process__arrow-icon" /></template>
            <template #header>
                <button
                    v-if="treeFormat && process[0].canEdit !== '0'"
                    @click="pickProcess(processName)"
                    class="process__users"
                >
                    <UserIcon class="process__user-icon" />
                </button>
            </template>
            <template #body>
                <div class="process__list">
                    <button 
                        v-for="standard in process"
                        @click="pickStandard(standard.id)"
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
import ArrowIcon from '../img/arrow.svg?component';

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
    width: 19px;
    height: 19px;
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

.process:deep(.accordion__header) {
    display: flex;
    align-items: center;
    gap: 8px;
}

.process:deep(.accordion__trigger) {
    width: auto;
    justify-content: flex-end;
    flex-direction: row-reverse;
    font-size: 16px;
    font-weight: 700;
    color: var(--transparent-blue);
}

.process:deep(.accordion__icon) {
    width: 10px;
    height: 19px;
}

.process:deep(.accordion.isActive .accordion__icon) {
    transform: rotate(90deg);
}

.process__arrow-icon {
    display: block;
    width: 100%;
    height: 100%;
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