<template>
    <div class="btn-wrapper">
        <svg class="btn" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect class="rect" x="0.6" y="0.6" width="42.8" height="42.8" rx="13.4" fill="white" stroke="var(--transparent-blue)" stroke-width="1.2"/>
            <path class="path" d="M17 17L22 22M22 22L17 27M22 22L27 17M22 22L27 27" stroke="var(--shark)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</template>

<style scoped>
.btn-wrapper {
    position: sticky;
    width: 100%;
    left: 0;
    top: 100px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
    pointer-events: none;
}

@media(max-width: 460px) {
    .btn-wrapper {
        top: 80px;
    }
}

.btn {
    cursor: pointer;
    pointer-events: all;
}
</style>