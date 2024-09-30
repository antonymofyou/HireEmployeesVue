<template>
    <div class="control-buttons">
        <ColorPicker
            v-if="renderTable.color"
            :color="props.activeShape.shape?.color || '#000000'"
            @reset-color="updateShapeHandler('color', '#000000')"
            @update:color="updateShapeHandler('color', $event)"
            title="Заливка"
        >
            <template #icon>
                <FormatPaint />
            </template>
        </ColorPicker>
        <ColorPicker
            v-if="renderTable.borderColor"
            :color="props.activeShape.shape?.borderColor || '#000000'"
            @reset-color="updateShapeHandler('borderColor', '#000000')"
            @update:color="updateShapeHandler('borderColor', $event)"
            title="Цвет границ"
        >
            <template #icon>
                <BorderColor />
            </template>
        </ColorPicker>
        <ValuePicker
            v-if="renderTable.cornerRadius"
            :value="+props.activeShape.shape?.cornerRadius || 0"
            @update:value="updateShapeHandler('cornerRadius', +$event)"
            :min="0"
            title="Закругление границ" 
        >
            <template #icon>
                <BorderRadius />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <SelectControlButton
            v-if="renderTable.borderWidth"
            :items="itemsBorderWidth"
            title="Размер границ"
            :item="+props.activeShape.shape?.borderWidth || 0"
            @update:item="borderWidthSelectHandler"
        >
            <template #trigger="{ selected }">
                <FormatLineWeight />
                <span class="selected-number-main">
                    {{ selected.name }}
                </span>
            </template>
        </SelectControlButton>
        <ValuePicker
            v-if="renderTable.zIndex"
            :value="+props.activeShape.shape?.zIndex || 1"
            @update:value="updateShapeHandler('zIndex', +$event)"
            title="Z-ось"    
        >
            <template #icon>
                <AlphaZBoxOutline />
            </template>
        </ValuePicker>
        <DropdownContent
            v-if="renderTable.formattedText"
            title="Форматирование текста"
        >
            <template #trigger>
                <FormatFont />
            </template>
            <template #content>
                <ControlButton 
                    :active="props.activeShape.editor?.isActive('bold')"
                    @click="updateEditorHandler('boldStyle')"
                    title="Выделение"
                >
                    <BoldIcon />
                </ControlButton>
                <ControlButton 
                    :active="props.activeShape.editor?.isActive('italic')"
                    @click="updateEditorHandler('italicStyle')"
                    title="Курсив"
                >
                    <ItalicIcon />
                </ControlButton>
                <ControlButton 
                    :active="props.activeShape.editor?.isActive('underline')"
                    @click="updateEditorHandler('underlineStyle')"
                    title="Подчеркивание"
                >
                    <UnderlineIcon />
                </ControlButton>
            </template>
        </DropdownContent>
        <ColorPicker
            v-if="renderTable.colorText"
            :color="props.activeShape.editor?.getAttributes('textStyle').color || '#000000'"
            @reset-color="updateEditorHandler('colorText', '#000000')"
            @update:color="updateEditorHandler('colorText', $event)"         
            title="Цвет текста"   
        >
            <template #icon>
                <FormatText />
            </template>
        </ColorPicker>
        <ColorPicker
            v-if="renderTable.highlight"
            :color="props.activeShape.editor?.getAttributes('highlight').color || '#000000'"
            @reset-color="updateEditorHandler('removeHighlight')"
            @update:color="updateEditorHandler('addHighlight', $event)"            
            title="Выделение текста"
        >
            <template #icon>
                <Marker />
            </template>
        </ColorPicker>
        <SelectControlButton
            v-if="renderTable.horizontalAlign"
            :items="itemsHorizontalAlign"
            title="Горизонтальное выравнивание"
            :item="props.activeShape.editor?.getAttributes('paragraph').textAlign || ''"
            @update:item="horizontalAlignSelectHandler"
        />
        <SelectControlButton
            v-if="renderTable.verticalAlign"
            :items="itemsVerticalAlign"
            title="Вертикальное выравнивание"
            :item="props.activeShape.shape?.textVerticalAlignment || ''"
            @update:item="verticalAlignSelectHandler"
        />
        <ValuePicker
            v-if="renderTable.sizeText"
            :value="parseInt(props.activeShape.editor?.getAttributes('textStyle').fontSize) || 14"
            @update:value="updateEditorHandler('sizeText', $event)"
            :min="0"
            title="Размер текста"           
        >
            <template #icon>
                <FormatText />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <ValuePicker
            v-if="renderTable.padding"
            :value="+props.activeShape.shape?.padding || 0"
            @update:value="updateShapeHandler('padding', +$event)"     
            :min="0"
            title="Внутренние отступы"       
        >
            <template #icon>
                <FitToPageOutline />
            </template>
            <template #units>
                px
            </template>
        </ValuePicker>
        <DropdownContent
            v-if="renderTable.columnControl"
            title="Управление колонками"
        >
            <template #trigger>
                <TableColumn />
            </template>
            <template #content>
                <ControlButton 
                    @click="updateEditorHandler('addColumnBefore')"
                    title="Добавить колонку до"
                >
                    <TableColumnPlusBefore />
                </ControlButton>
                <ControlButton 
                    @click="updateEditorHandler('addColumnAfter')"
                    title="Добавить колонку после"
                >
                    <TableColumnPlusAfter />
                </ControlButton>
                <ControlButton 
                    @click="updateEditorHandler('deleteColumn')"
                    title="Удалить колонку"
                >
                    <TableColumnRemove />
                </ControlButton>
            </template>
        </DropdownContent>
        <DropdownContent
            v-if="renderTable.rowControl"
            title="Управление строками"
        >
            <template #trigger>
                <TableRow />
            </template>
            <template #content>
                <ControlButton 
                    @click="updateEditorHandler('addRowBefore')"
                    title="Добавить строку до"
                >
                    <TableRowPlusBefore />
                </ControlButton>
                <ControlButton 
                    @click="updateEditorHandler('addRowAfter')"
                    title="Добавить строку после"
                >
                    <TableRowPlusAfter />
                </ControlButton>
                <ControlButton 
                    @click="updateEditorHandler('deleteRow')"
                    title="Удалить строку"
                >
                    <TableRowRemove />
                </ControlButton>
            </template>
        </DropdownContent>
        <DropdownContent
            v-if="renderTable.cellControl"
            title="Управление ячейками"
        >
            <template #trigger>
                <CodeBrackets />
            </template>
            <template #content>
                <ControlButton 
                    @click="updateEditorHandler('mergeCells')"
                    title="Объединить ячейки"
                >
                    <TableMergeCells />
                </ControlButton>
                <ControlButton 
                    @click="updateEditorHandler('splitCell')"
                    title="Разъединить ячейки"
                >
                    <TableSplitCell />
                </ControlButton>
            </template>
        </DropdownContent>
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue';

import ColorPicker from './ColorPicker.vue';
import ValuePicker from './ValuePicker.vue';
import SelectControlButton from './SelectControlButton.vue';
import ControlButton from './ControlButton.vue';
import DropdownContent from '@/components/DropdownContent.vue';

// Icons

import FormatPaint from 'vue-material-design-icons/FormatPaint.vue'
import BorderColor from 'vue-material-design-icons/BorderColor.vue';
import BorderRadius from 'vue-material-design-icons/BorderRadius.vue';
import FormatLineWeight from 'vue-material-design-icons/FormatLineWeight.vue';
import AlphaZBoxOutline from 'vue-material-design-icons/AlphaZBoxOutline.vue'
import BoldIcon from 'vue-material-design-icons/FormatBold.vue'
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue'
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue'
import AlignLeftIcon from 'vue-material-design-icons/FormatAlignLeft.vue'
import AlignCenterIcon from 'vue-material-design-icons/FormatAlignCenter.vue'
import AlignRightIcon from 'vue-material-design-icons/FormatAlignRight.vue'
import VerticalAlignBottom from 'vue-material-design-icons/FormatVerticalAlignBottom.vue'
import VerticalAlignCenter from 'vue-material-design-icons/FormatVerticalAlignCenter.vue'
import VerticalAlignTop from 'vue-material-design-icons/FormatVerticalAlignTop.vue'
import FormatText from 'vue-material-design-icons/FormatText.vue'
import Marker from 'vue-material-design-icons/Marker.vue'
import FormatFont from 'vue-material-design-icons/FormatFont.vue';
import FitToPageOutline from 'vue-material-design-icons/FitToPageOutline.vue';
import TableColumn from 'vue-material-design-icons/TableColumn.vue';
import TableColumnPlusBefore from 'vue-material-design-icons/TableColumnPlusBefore.vue';
import TableColumnPlusAfter from 'vue-material-design-icons/TableColumnPlusAfter.vue';
import TableColumnRemove from 'vue-material-design-icons/TableColumnRemove.vue';
import TableRow from 'vue-material-design-icons/TableRow.vue';
import TableRowPlusBefore from 'vue-material-design-icons/TableRowPlusBefore.vue';
import TableRowPlusAfter from 'vue-material-design-icons/TableRowPlusAfter.vue';
import TableRowRemove from 'vue-material-design-icons/TableRowRemove.vue';
import CodeBrackets from 'vue-material-design-icons/CodeBrackets.vue';
import TableSplitCell from 'vue-material-design-icons/TableSplitCell.vue';
import TableMergeCells from 'vue-material-design-icons/TableMergeCells.vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    },
    mode: {
        type: Object,
        required: true,
    },
    shapes: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    updateShape: null,
    updateEditor: null,
});

const itemsBorderWidth = new Array(6).fill({}).map((item, idx) => {
    return {
        id: idx,
        name: (idx + 1) * 2
    }
});
const itemsHorizontalAlign = [
    {
        id: 0,
        name: 'left',
        icon: AlignLeftIcon,
        title: 'По левому краю',
    },
    {
        id: 1,
        name: 'center',
        icon: AlignCenterIcon,
        title: 'По центру',
    },
    {
        id: 2,
        name: 'right',
        icon: AlignRightIcon,
        title: 'По правому краю',
    },
];
const itemsVerticalAlign = [
    {
        id: 0,
        name: 'bottom',
        icon: VerticalAlignBottom,
        title: 'По нижнему краю',
    },
    {
        id: 1,
        name: 'center',
        icon: VerticalAlignCenter,
        title: 'По центру',
    },
    {
        id: 2,
        name: 'top',
        icon: VerticalAlignTop,
        title: 'По верхнему краю',
    },
];
const isShapeMode = computed(() => {
  return props.mode.value === props.mode._shape;
});
const isEditMode = computed(() => {
  return props.mode.value === props.mode._edit;
});
const currentShape = computed(() => {
    return props.activeShape.shape?.type || '';
});
const isRectangle = computed(() => {
    return currentShape.value === props.shapes.rectangle;
});
const isArrow = computed(() => {
    return currentShape.value === props.shapes.arrow;
});
const isTable = computed(() => {
    return currentShape.value === props.shapes.table;
});
const renderTable = computed(() => {
    return {
        color: isEditMode.value && currentShape.value,
        zIndex: isEditMode.value && currentShape.value,
        borderColor: (isEditMode.value && isRectangle.value) || (isEditMode.value && isTable.value),
        cornerRadius: (isEditMode.value && isRectangle.value),
        borderWidth: (isEditMode.value && isRectangle.value) || (isEditMode.value && isTable.value),
        // Управление текстом
        formattedText: (isShapeMode.value && isRectangle.value) || (isShapeMode.value && isTable.value),
        colorText: (isShapeMode.value && isRectangle.value) || (isShapeMode.value && isTable.value),
        highlight: (isShapeMode.value && isRectangle.value) || (isShapeMode.value && isTable.value),
        horizontalAlign: (isShapeMode.value && isRectangle.value),
        verticalAlign: (isShapeMode.value && isRectangle.value),
        sizeText: (isShapeMode.value && isRectangle.value) || (isShapeMode.value && isTable.value),
        padding: (isShapeMode.value && isRectangle.value),
        // Управление таблицей
        columnControl: (isShapeMode.value && isTable.value),
        rowControl: (isShapeMode.value && isTable.value),
        cellControl: (isShapeMode.value && isTable.value),
    }
});

// Handlers

function updateShapeHandler(key, value) {
    emits('updateShape', props.activeShape.id, key, value);
}

function borderWidthSelectHandler(name) {
    updateShapeHandler('borderWidth', +name);
}

function updateEditorHandler(type, value) {
    emits('updateEditor', type, value);
}

function verticalAlignSelectHandler(name) {
    updateShapeHandler('textVerticalAlignment', name);
}

function horizontalAlignSelectHandler(name) {
    updateEditorHandler('horizontalAlign', name);
}

</script>