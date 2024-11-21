<template>
    <div 
        :class="{ 'isActive': isActive }" 
        class="accordion"
    >
        <button 
            @click="toggle"
            :aria-expanded="isActive"
            class="accordion__trigger"
        >
            <slot name="title"></slot>
            <svg v-show="!props.disabled" class="accordion__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12">
                <path d="M14.75 0.750044L1.25 0.750044C1.11332 0.750472 0.97934 0.788169 0.86249 0.859077C0.74564 0.929985 0.650341 1.03142 0.58685 1.15246C0.523359 1.2735 0.494082 1.40956 0.50217 1.54601C0.510257 1.68245 0.555402 1.8141 0.632747 1.92679L7.38275 11.6768C7.6625 12.081 8.336 12.081 8.6165 11.6768L15.3665 1.92679C15.4446 1.81434 15.4904 1.68262 15.499 1.54595C15.5075 1.40928 15.4784 1.27289 15.4149 1.15159C15.3513 1.03029 15.2557 0.928728 15.1385 0.857935C15.0213 0.787143 14.8869 0.749827 14.75 0.750044Z"/>
            </svg>
        </button>
        <div class="accordion__body">
            <div class="accordion__content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue';

const props = defineProps({
    initialValue: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
});
const isActive = ref(props.initialValue);

function toggle() {
    if (props.disabled) return;

    isActive.value = !isActive.value;
}

</script>

<style scoped>
.accordion__trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.accordion__arrow {
    width: 16px;
    height: 12px;
    fill: currentColor;
    transition: transform .3s;
}

.isActive .accordion__arrow {
    transform: rotate(180deg);
}

.accordion__body {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows .5s;
    cursor: default;
}

.isActive .accordion__body {
    grid-template-rows: 1fr;
}

.accordion__content {
    min-height: 0;
    transition: all .3s;
}

.isActive .accordion__content {
    margin: 12px 0;
}
</style>