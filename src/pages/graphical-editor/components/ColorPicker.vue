<template>
    <input 
        :value='color' 
        @input="emits('update:color', $event.target.value)" 
        :disabled="props.disabled" 
        name="color" 
        type="color" 
        class="color-picker"
    >
</template>

<script setup>

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
})

</script>

<style scoped>

.color-picker {
    background-color: transparent;
    padding: 0;
    margin: 0;
    outline: none;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
}

.color-picker:disabled {
    opacity: 0.5;
}

</style>