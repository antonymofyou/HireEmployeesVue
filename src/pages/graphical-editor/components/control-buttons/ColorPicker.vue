<template>
    <DropdownContent :style="{ color: color }">
        <template #trigger>
            <slot name="icon"></slot>
        </template>
        <template #content>
            <input :value="color" @input="emits('update:color', $event.target.value)" type="color" class="btn-reset" >
            <button @click="emits('resetColor')" class="btn-reset">
                <CircleOpacity />
            </button>
        </template>
    </DropdownContent>
</template>

<script setup>

import DropdownContent from '@/components/DropdownContent.vue';
import CircleOpacity from "vue-material-design-icons/CircleOpacity.vue";

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
    bottom: 0;
    width: 100%;
    height: 6px;
    background-color: currentColor;
    border-radius: 0 0 8px 8px;
}

.dropdown:deep(.dropdown__content > *) {
    width: 18px;
    height: 18px;
    border-radius: 100%;
    cursor: pointer;
}

</style>