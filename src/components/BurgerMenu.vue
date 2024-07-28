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

import { ref, watch, onBeforeUnmount } from 'vue';

const emits = defineEmits({
    'update:modelValue': null,
});
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    breakpoints: {
        type: Object,
        default() {
            return {};
        }
    }
});
const currentBreakpoint = ref(0);

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

const wrapperForUpdatingBreakpoints = debounce(function () {
    updatesBreakpoint();
}, 400);

function initBreakpointUpdate() {
    if (!Object.keys(props.breakpoints).length) return;

    updatesBreakpoint();

    window.addEventListener("resize", wrapperForUpdatingBreakpoints);
};

initBreakpointUpdate();

function debounce(callback, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

function updatesBreakpoint() {
    const breakpoint = getCurrentBreakpoint();

    if (currentBreakpoint.value == breakpoint) return;

    currentBreakpoint.value = breakpoint;
};

function getCurrentBreakpoint() {
    const width = window.innerWidth;

    return Object.keys(props.breakpoints).reduce((acc, breakpoint) => {
        if (width >= breakpoint) {
            acc = breakpoint;
        }

        return acc;
    }, 0);
};

watch(currentBreakpoint, function() {
    callsFunctionsBreakpoint();
});

function callsFunctionsBreakpoint() {
    const functionsBreakpoint = props.breakpoints[currentBreakpoint.value];

    if (!functionsBreakpoint) return;

    if (typeof functionsBreakpoint === "function") {
        functionsBreakpoint();

        return;
    }

    functionsBreakpoint?.forEach((func) => {
        func();
    });
};

function updateModelValue(value) {
    emits('update:modelValue', value);
}

onBeforeUnmount(() => {
    window.removeEventListener("resize", wrapperForUpdatingBreakpoints);
});

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
    padding: 100px 0 3rem;
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