<template>
    <card class="accordion-card" :class="{ 'active': active }">
        <div class="accordion-title" @click="openCloseAccordion">
            <slot name="accordion-title"></slot>
            <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M14.75 0.750044L1.25 0.750044C1.11332 0.750472 0.97934 0.788169 0.86249 0.859077C0.74564 0.929985 0.650341 1.03142 0.58685 1.15246C0.523359 1.2735 0.494082 1.40956 0.50217 1.54601C0.510257 1.68245 0.555402 1.8141 0.632747 1.92679L7.38275 11.6768C7.6625 12.081 8.336 12.081 8.6165 11.6768L15.3665 1.92679C15.4446 1.81434 15.4904 1.68262 15.499 1.54595C15.5075 1.40928 15.4784 1.27289 15.4149 1.15159C15.3513 1.03029 15.2557 0.928728 15.1385 0.857935C15.0213 0.787143 14.8869 0.749827 14.75 0.750044Z" fill="var(--shark)"/>
            </svg>
        </div>
        <div class="accordion-body">
            <div class="accordion-body-inner">
                <slot name="accordion-list"></slot>
            </div>
        </div>
    </card>
</template>

<script setup>

import { ref } from 'vue';
import Card from './Card.vue';

const props = defineProps({
    defActive: {
        type: Boolean,
        required: true,
    }
});
const active = ref(props.defActive);

const openCloseAccordion = (e) => {
    if (e.target.closest('.accordion-body')) {
        active.value = active.value;
    } else {
        active.value = !active.value;
    }
}

</script>

<style scoped>
.accordion-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    cursor: pointer;
}

.active .arrow {
    transform: rotate(180deg);
}

.accordion-body {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows .5s;
    cursor: default;
}

.accordion-body-inner {
    min-height: 0;
    transition: all .3s;
}

.active .accordion-body-inner {
    margin-top: 20px;
}
.active .accordion-body {
    grid-template-rows: 1fr;
}
</style>