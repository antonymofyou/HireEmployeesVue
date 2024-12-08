<template>
    <DropdownContent :style="{ color: color }" :disabled="props.disabled">
        <template #trigger>
            <slot name="icon"></slot>
        </template>
        <template #content>
            <input :value="color" @input="emits('update:color', $event.target.value)" type="color" class="btn-reset" title="Выбор цвета">
            <button @click="emits('resetColor')" class="btn-reset" title="Сброс цвета">
                <SquareOpacity />
            </button>
        </template>
    </DropdownContent>
</template>

<script setup>

import DropdownContent from './DropdownContent.vue';
import SquareOpacity from "vue-material-design-icons/SquareOpacity.vue";

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        required: true,
    }
});
const emits = defineEmits({
    'update:color': null,
    'resetColor': null
});

</script>

<style scoped>

.btn-reset {
    background-color: transparent;
    appearance: none;
    border: 0;
    outline: 0;
    padding: 0;
    margin: 0;
}

.dropdown {
    position: relative;
}

.dropdown::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 1px;
    width: 100%;
    height: 2px;
    background-color: currentColor;
}

.dropdown:deep(.dropdown__content > *) {
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 100%;
    cursor: pointer;
}
</style>