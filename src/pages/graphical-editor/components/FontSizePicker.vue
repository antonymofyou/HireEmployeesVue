<template>
    <input
        :value="parseInt(fontSize)"
        @change="emits('update:fontSize', $event.target.value)"
        :disabled="props.disabled" 
        name="font-size" 
        type="number"
        min="0" 
        class="font-size-picker"
    >
</template>

<script setup>

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    fontSize: {
        type: String,
        required: true,
    }
});
const emits = defineEmits({
    'update:fontSize': null,
})

</script>

<style scoped>

.font-size-picker {
    background-color: var(--milk);
    padding: 8px;
    margin: 0;
    border: 0;
    outline: 0;
    border-radius: 8px;
    color: var(--mine-shaft);
    transition-property: opacity;
    transition-duration: .2s;
}

.font-size-picker:disabled {
    opacity: 0.5;
}

</style>