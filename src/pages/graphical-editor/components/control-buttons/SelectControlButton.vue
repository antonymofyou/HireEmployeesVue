<template>
    <SelectMain
        :options="options"
        :model-value="currentItem"
        @update:model-value="updateItemHandler"
        :title="props.title"
    >
        <template #option="{ option }">  
            <component :is="icons[option.id]" :title="option.title"></component>
        </template>
        <template #trigger="{ selected }">
            <slot name="trigger" :selected="selected">
                <component :is="icons[selected.id]"></component>
            </slot>
        </template>
    </SelectMain> 
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue';
import SelectMain from '@/components/SelectMain.vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    item: {
        type: [String, Number],
        required: true,
    }
});
const emits = defineEmits({
    'update:item': null,
});

const options = props.items.map(({id, name, title}) => {
    return {
        id,
        name,
        title
    }
});
const icons = props.items.reduce((acc, item) => {
    acc[item.id] = item.icon;
    
    return acc;
}, {});

const currentItem = computed(() => {
    const { id } = options?.filter(item => item.name == props.item)[0] || {};

    return id || 0;
});

function updateItemHandler(id) {
    const { name } = options?.filter(item => item.id == id)[0] || {};

    emits('update:item', name);
}

</script>

<style scoped>

.select-box-main.active:deep(.selected-main) {
    background-color: var(--transparent-blue);
    color: var(--milk) !important;
}

.select-box-main.disabled:deep(.selected-main) {
    opacity: 0.5;
}

.select-box-main:deep(.selected-main) {
    background-color: var(--milk);
    padding: 6px;
    color: var(--mine-shaft);
    transition: 0.2s ease;
    height: 100%;
    word-break: normal;
}

.select-box-main:deep(.selected-main::after) {
    display: none;
}

.select-box-main:deep(.options-container-main){
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    text-align: center;
    top: -8px;
    left: 50% !important;
    transform: translateY(-100%) translateX(-50%);
}

@media (max-width: 768px) {
    .select-box-main:deep(.options-container-main) {
        top: auto;
        bottom: -8px;
        transform: translateY(100%) translateX(-50%);
        grid-template-columns: 1fr;
    }
}

.select-box-main:deep(.option-main) {
    background-color: var(--milk);
    border-radius: 8px;
    color: var(--mine-shaft);
    transition: 0.2s ease;
    word-break: normal;
}

.select-box-main:deep(.option-main.selected) {
    background-color: var(--transparent-blue);
    color: var(--milk) !important;
}

</style>