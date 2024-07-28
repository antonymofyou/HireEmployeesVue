<template>
    <button class="burger-trigger" type="button">
        <span class="burger-trigger__item" />
        <span class="burger-trigger__item" />
        <span class="burger-trigger__item" />
    </button>
</template>
  
<style scoped>
.burger-trigger {
    display: grid;
    grid-template-columns: 1fr;
    transition: background 0.5s;
    gap: 7.5px;
    outline: none;
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.burger-trigger__item {
    border-radius: 4px;
    width: 32px;
    height: 3px;
    background-color: var(--mine-shaft);
    transition-property: transform, opacity, visibility, background;
    transition-duration: 0.5s;
}

.burger-trigger.active .burger-trigger__item:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);   
}

.burger-trigger.active .burger-trigger__item:nth-child(2) {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-100%);
}

.burger-trigger.active .burger-trigger__item:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);  
}
</style>