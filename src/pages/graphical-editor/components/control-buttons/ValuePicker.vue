<template>
    <label :class="{'disabled': disabled}" class="value-picker">
        <span class="value-picker__icon">
            <slot name="icon"></slot>
        </span>
        <input
            :value="props.value"
            @input="updateValueHandler"
            :disabled="disabled"
            :step="props.step"
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
    },
    step: {
        type: Number,
        default: 1,
    },
    min: {
        type: Number,
        default: null,
    },
    max: {
        type: Number,
        default: null,
    }
});
const emits = defineEmits({
    'update:value': null,
})

function updateValueHandler(event) {
    let value = +event.target.value;

    if (props.min !== null) {
        value = value < props.min ? props.min : value;
    }

    if (props.max !== null) {
        value = value > props.max ? props.max : value;
    }

    if (props.max !== null || props.min !== null) {
        event.target.value = value;
    }

    emits('update:value', value);
}

</script>

<style scoped>

.value-picker {
    display: flex;
    align-items: center;
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
    font-size: 16px;
    text-align: center;
}

.value-picker__units {
    font-size: 12px;
    color: var(--mine-shaft);
}

</style>