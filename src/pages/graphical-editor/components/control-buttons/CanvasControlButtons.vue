<template>
    <div class="control-buttons">
        <ValuePicker
            class="scale-value-picker"
            :value="props.scale.value"
            :step="props.scale._step"
            :min="props.scale._min"
            :max="props.scale._max"
            @update:value="updateScaleHandler('input', $event)"
            title="Увеличить масштаб"           
        >
            <template #units>
                %
            </template>
        </ValuePicker>
        <ControlButton
            @pointerdown.prevent="updateScaleHandler('inc')"
            @pointerup.prevent="resetMouseClamped"
            title="Увеличить масштаб (+10%)"
        >
            <MagnifyPlusOutline />
        </ControlButton>
        <ControlButton
            @pointerdown.prevent="updateScaleHandler('dec')"
            @pointerup.prevent="resetMouseClamped"
            title="Уменьшить масштаб (-10%)"
        >
            <MagnifyMinusOutline />
        </ControlButton>
        <ControlButton
            @pointerdown="updateScaleHandler('reset')"
            title="Сбросить масштаб (100%)"
        >
            <RestoreIcon />
        </ControlButton>
        <DropdownContent title="Добавить фигуру">
            <template #trigger>
                <ShapeOutline />
            </template>
            <template #content>
                <ControlButton 
                    @click="addShapeHandler('rectangle')"
                    title="Прямоугольник"
                >
                    <RectangleOutline />
                </ControlButton>
                <ControlButton 
                    @click="addShapeHandler('arrow')"
                    title="Стрелка"
                >
                    <ArrowRightThin />
                </ControlButton>
                <DropdownContent title="Добавить таблицу">
                    <template #trigger>
                        <TableIcon />
                    </template>
                    <template #content="{ close }">
                        <SchemeTable @create-scheme="addShapeHandler('table', { table: $event }), close()" />
                    </template>
                </DropdownContent>
            </template>
        </DropdownContent>
        <ControlButton
            @pointerdown="deleteShapeHandler"
            title="Удалить фигуру"
        >
            <DeleteOutline />
        </ControlButton>
        <ControlButton
            @pointerdown="copyShapeHandler"
            title="Копировать фигуру"
        >
            <ContentCopy />
        </ControlButton>
    </div>
</template>

<script setup>

import { defineProps, defineEmits, ref } from 'vue';

import ValuePicker from './ValuePicker.vue';
import ControlButton from './ControlButton.vue';
import DropdownContent from '@/components/DropdownContent.vue';

// Icons

import SchemeTable from './SchemeTable.vue';
import RestoreIcon from 'vue-material-design-icons/Restore.vue';
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue';
import DeleteOutline from 'vue-material-design-icons/DeleteOutline.vue';
import MagnifyPlusOutline from 'vue-material-design-icons/MagnifyPlusOutline.vue';
import MagnifyMinusOutline from 'vue-material-design-icons/MagnifyMinusOutline.vue';
import RectangleOutline from 'vue-material-design-icons/RectangleOutline.vue';
import ArrowRightThin from 'vue-material-design-icons/ArrowRightThin.vue';
import ShapeOutline from 'vue-material-design-icons/ShapeOutline.vue';
import TableIcon from 'vue-material-design-icons/Table.vue';

const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    },
    scale: {
        type: Object,
        required: true,
    }
});
const emits = defineEmits({
    addShape: null,
    copyShape: null,
    deleteShape: null,
    updateScale: null,
});

// Handlers

function addShapeHandler(type, options) {
    emits('addShape', type, options);
}

function deleteShapeHandler() {
    emits('deleteShape', props.activeShape.id);
}

function copyShapeHandler() {
    emits('copyShape');
}

let mouseIsClamped = ref(false);

function resetMouseClamped() {
    mouseIsClamped.value = false;
}

function updateScaleHandler(handler, value) {
    const handlers = {
        'reset': function() {
            emits('updateScale', props.scale._default);
        },
        'input': function(value) {
            emits('updateScale', value);
        },
        'inc': function() {
            if (props.scale.value >= props.scale._max) return;

            emits('updateScale', props.scale.value + props.scale._step);

            mouseIsClamped.value = true;

            setTimeout(() => {
                if (!mouseIsClamped.value) return;

                updateScaleHandler(handler, value);
            }, 100);
        },
        'dec': function() {
            if (props.scale.value <= props.scale._min) return;

            emits('updateScale', props.scale.value - props.scale._step);

            mouseIsClamped.value = true;

            setTimeout(() => {
                if (!mouseIsClamped.value) return;

                updateScaleHandler(handler, value);
            }, 100);
        }
    };

    handlers[handler](value);
}

</script>

<style scoped>

.scale-value-picker:deep(input::-webkit-outer-spin-button),
.scale-value-picker:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.scale-value-picker:deep(input) {
  -moz-appearance: textfield;
}

</style>