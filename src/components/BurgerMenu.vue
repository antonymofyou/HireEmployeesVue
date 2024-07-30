<template>
    <div
        class="burger-menu"
        :class="{
            'active': modelValue
        }"
        @pointerup="updateModelValue(false)"
    >
        <div class="burger-menu__body" @pointerup.stop>
            <div class="burger-menu__content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>

import { watch } from 'vue';

const emits = defineEmits({
    'update:modelValue': null,
});
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    }
});

watch(() => props.modelValue, () => {
    if (props.modelValue) {
        addsPaddingInsteadOfScroll();

        addsScrollLock();

        return;
    }

    removesScrollPadding();

    removesScrollLock();
});

function addsPaddingInsteadOfScroll() {
    const { body } = document;
    const padding = `${window.innerWidth - body.offsetWidth}px`;

    body.style.paddingRight = padding;
};

function removesScrollPadding() {
    const { body } = document;
    body.style.paddingRight = 0;
};

function addsScrollLock() {
    const { body } = document;

    body.style.overflow = 'hidden';
}

function removesScrollLock() {
    const { body } = document;

    body.style.overflow = 'unset';
}

function updateModelValue(value) {
    emits('update:modelValue', value);
}

</script>

<style scoped>

.burger-menu {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    visibility: hidden;
    opacity: 0;
    transition-property: visibility, opacity, background;
    transition-duration: 0.5s;
}

.burger-menu__body {
    display: flex;
    flex-direction: column;
    padding: 100px 0 48px;
    max-height: 100%;
    background-color: var(--white);
    opacity: 0;
    transform: translateY(-10%);
    transition-property: opacity, transform;
    transition-duration: 0.5s;
}

.burger-menu__content {
    overflow: auto;
    width: 100%;
    text-align: center;
}

.burger-menu.active {
    background-color: rgba(30, 33, 44, 50%);
    visibility: visible;
    opacity: 1;
}

.burger-menu.active .burger-menu__body {
    opacity: 1;
    transform: translate(0);
}

</style>