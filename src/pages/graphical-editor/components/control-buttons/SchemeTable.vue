<template>
    <div class="scheme-table">
        <table class="scheme-table__table">
            <tr v-for="(row, rowIdx) in props.rowScheme" :key="rowIdx" class="scheme-table__row">
                <td 
                    v-for="(column, columnIdx) in props.columnScheme" 
                    :key="columnIdx"
                    @mousemove="selectHandler(row, column)"
                    @pointerdown="selectHandler(row, column), createSchemeHandler()"
                    :class="{
                        'active': selectedRow >= row && selectedColumn >= column 
                    }"
                    class="scheme-table__cell">
                </td>
            </tr>
        </table>
        <ValuePicker
            :value="selectedColumn"
            @update:value="selectedColumn = +$event"
            :min="1"
            title="Кол-во колонок" 
        >
            <template #icon>
                <TableColumn />
            </template>
        </ValuePicker>
        <ValuePicker
            :value="selectedRow"
            @update:value="selectedRow = +$event"
            :min="1"
            title="Кол-во строк" 
        >
            <template #icon>
                <TableRow />
            </template>
        </ValuePicker>
        <ControlButton 
            @click="createSchemeHandler()"
            title="Создать таблицу"
        >
            <PlusIcon />
        </ControlButton>
    </div>
</template>

<script setup>

import { defineProps, defineEmits, ref } from 'vue'
import ValuePicker from './ValuePicker.vue';
import ControlButton from './ControlButton.vue';

// icons

import TableColumn from 'vue-material-design-icons/TableColumn.vue';
import TableRow from 'vue-material-design-icons/TableRow.vue';
import PlusIcon from 'vue-material-design-icons/Plus.vue'

const props = defineProps({
    columnScheme: {
        type: Number,
        default: 5,
    },
    rowScheme: {
        type: Number,
        default: 5,
    }
});
const emits = defineEmits({
    createScheme: null,
});

const selectedRow = ref(1);
const selectedColumn = ref(1);

function selectHandler(row, column) {
    selectedRow.value = row;
    selectedColumn.value = column;
}

function createSchemeHandler() {
    let body = '';

    for (let row = 0; row < selectedRow.value; row++) {
        body += '<tr>';

        for (let column = 0; column < selectedColumn.value; column++) {
            body += '<td></td>';
        }

        body += '</tr>';
    }

    emits('createScheme', `<table><tbody>${body}<tbody></table>`);
}

</script>

<style scoped>

.scheme-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.scheme-table__table {
    display: flex;
    flex-direction: column;
    gap: 3px;
    cursor: pointer;
    border-collapse: collapse;
}

.scheme-table__row {
    display: flex;
    gap: 3px;
}

.scheme-table__cell {
    padding: 0;
    border: 1px solid var(--mine-shaft);
    width: 15px;
    height: 15px;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    transition: background .2s;
}

.scheme-table__cell.active {
    background-color: var(--mine-shaft);
}

.scheme-table__text {
    position: absolute;
    clip-path: inset(100%);
    overflow: hidden;
    margin: -1px;
    border: 0;
    padding: 0;
    width: 1px;
    height: 1px;
    white-space: nowrap;
    clip: rect(0 0 0 0);
}

</style>