<template>
    <table class="scheme-table">
        <tr v-for="(row, rowIdx) in props.row" :key="rowIdx" class="scheme-table__row">
            <td 
                v-for="(column, columnIdx) in props.column" 
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
</template>

<script setup>

import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
    column: {
        type: Number,
        default: 5,
    },
    row: {
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
            body += '<td>Ячейка</td>';
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