<template>
    <div @click="closePopupOwn" class="popup-component-wrapper">
        <div class="popup-component">
            <cl-btn v-if="visibleClBtn" @click="closePopup" class="popup-clBtn"></cl-btn>

            <div class="popup-component-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>

import ClBtn from './ClBtn.vue';

const props = defineProps({
    visibleClBtn: {
        type: Boolean,
        required: true,
    }
});
const emit = defineEmits(['clPopup']);

const closePopup = () => {
    emit('clPopup');
}

const closePopupOwn = (e) => {
    if (e.target.classList.contains('popup-component-wrapper')) {
        closePopup();
    }
}

</script>

<style>
.popup-component-wrapper {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    padding-top: 115px;
    padding-bottom: 115px;
    z-index: 99999;
    cursor: pointer;
    overflow: auto;
}

.result-popup, .big-popup {
    padding-left: 10px;
    padding-right: 10px;
}

@media(max-width: 460px) {
    .popup-component-wrapper {
        padding-top: 110px;
    }
}

.popup-component {
    width: 340px;
    height: auto;
    border-radius: 16px;
    background-color: var(--white);
    padding: 20px;
    margin: 0 auto;
    cursor: default;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
}

.result-popup .popup-component {
    width: 100%;
    max-width: 800px;
}

.big-popup .popup-component {
    width: 100%;
    max-width: 1200px;
}

.result-popup .popup-component .popup-clBtn, .big-popup .popup-component .popup-clBtn {
    height: auto;
    margin-bottom: 10px;
    top: -15px;
}

@media(max-width: 460px) {
    .result-popup .popup-component .popup-clBtn, .big-popup .popup-component .popup-clBtn {
        top: -30px;
    }
}

.popup-component .popup-clBtn {
    top: 0px;
    height: 0;
    margin-bottom: 0;
    z-index: 9999;
}

.popup-component-body {
    position: relative;
    width: 100%;
}

.popup-component-title {
    font-size: 24px;
    font-weight: 800;
    text-align: center;
    color: var(--transparent-blue);
    margin-bottom: 16px;
}

.without-header .popup-clBtn {
    top: -95px;
}

@media(max-width: 460px) {
    .without-header .popup-clBtn {
        top: -90px;
    }
}
</style>