<template>
    <label :class="{'disabled': disabled}" :style="{ color: props.color }" class="color-picker">
        <span class="color-picker__icon">
            <slot name="icon"></slot>
        </span>
        <input 
            :value='props.color' 
            @change="emits('update:color', $event.target.value)" 
            :disabled="props.disabled"
            type="color" 
            class="color-picker__input"
        >
    </label>
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
    position: relative;
    cursor: pointer;
    transition-property: opacity;
    transition-duration: .2s;
}

.color-picker.disabled {
    opacity: 0.5;
}

.color-picker::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 6px;
    background-color: currentColor;
}

.color-picker__input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0;
}

</style>