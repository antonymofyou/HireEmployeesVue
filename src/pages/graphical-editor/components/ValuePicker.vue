<template>
    <label :class="{'disabled': disabled}" class="value-picker">
        <span class="value-picker__icon">
            <slot name="icon"></slot>
        </span>
        <input
            :value="value"
            @change="emits('update:value', $event.target.value)"
            :disabled="disabled"
            type="number"
            class="value-picker__input"
        >
        <span class="value-picker__units">
            <slot name="units"></slot>
        </span>
    </label>
</template>

<script setup>

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    value: {
        type: Number,
        required: true,
    }
});
const emits = defineEmits({
    'update:value': null,
})

</script>

<style scoped>

.value-picker {
    display: flex;
    align-items: center;
    background-color: var(--milk);
    padding: 8px;
    border-radius: 8px;
    transition-property: opacity;
    transition-duration: .2s;
}

.value-picker.disabled {
    opacity: 0.5;
}

.value-picker__input {
    background-color: transparent;
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    color: var(--mine-shaft);
    font-size: 20px;
    text-align: center;
}

.value-picker__units {
    font-size: 12px;
    color: var(--mine-shaft);
}

.value-picker__input::-webkit-outer-spin-button,
.value-picker__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.value-picker__input[type=number] {
  -moz-appearance: textfield;
}

</style>