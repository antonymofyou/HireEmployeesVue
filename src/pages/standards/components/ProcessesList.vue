<template>
    <div class="processes">
        <template v-if="treeFormat">
            <ProcessTreeBlock 
                v-for="(process, processName) in formattedStandards" 
                :process="process" 
                :processName="processName"
                :pickStandard="pickStandard" 
                :pickProcess="pickProcess" 
            />
        </template>
        <template v-else>
            <ProcessBlock 
                v-for="(process, processName) in formattedStandards" 
                :process="process" 
                :processName="processName" 
                :pickStandard="pickStandard" 
            />
        </template>
        <StandardInfo 
            v-if="pickedStandardId" 
            :id="pickedStandardId" 
            :closeMainPopUp="() => pickStandard('')" 
            :updateStandards="updateStandards" 
        />
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import ProcessTreeBlock from './ProcessTreeBlock.vue';
import ProcessBlock from './ProcessBlock.vue';
import StandardInfo from './PopUps/StandardInfo.vue';

// Массив стандартов, функция обновления стандартов, формат вывода (дерево или нет)
const props = defineProps({
    standards: {
        type: Array,
        required: true,
    },
    updateStandards: {
        type: Function,
        required: true,
    },
    treeFormat: {
        type: Boolean,
        required: true,
    },
    pickProcess: {
        type: Function,
        required: false,
    }
});

// Выбранный стандарт
const pickedStandardId = ref('');
// Выбрать стандарт
const pickStandard = (id) => pickedStandardId.value = id;

// Форматированные стандарты
const formattedStandards = computed(() => props.standards.reduce((acc, standard) => {
    acc[standard.process] ? acc[standard.process].push(standard) : acc[standard.process] = [standard];
    return acc;
}, {}));
</script>
  
<style scoped>
.processes {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>