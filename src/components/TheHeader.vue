<template>
    <header class="header">
        <div class="container">
            <BurgerTrigger :aria-expanded="isOpenBurgerMenu" :class="{'active': isOpenBurgerMenu}" @pointerup="toggleBurgerMenu" @keydown.enter.space="toggleBurgerMenu" />
            <NavigationMenu :list-items="listNavigation" />
        </div>
        <BurgerMenu :model-value="isOpenBurgerMenu" @update:model-value="isOpenBurgerMenu = $event" :breakpoints="breakpointsBurgerMenu">
            <NavigationMenu @transition="closeBurgerMenu" :list-items="listNavigation" />
        </BurgerMenu>
    </header>
</template>

<script setup>

import { ref } from 'vue';

import NavigationMenu from "@/components/NavigationMenu.vue";
import BurgerTrigger from "@/components/BurgerTrigger.vue";
import BurgerMenu from "@/components/BurgerMenu.vue";

const listNavigation = [
    ["Вакансии", "vacanciesList"],
    ["Сотрудники", "home"],
    ["Стандарты", "home"],
];
const isOpenBurgerMenu = ref(false);
const breakpointsBurgerMenu = {
    // window > 576px
    [576]: closeBurgerMenu
}

function closeBurgerMenu() {
    if (isOpenBurgerMenu.value) {
        isOpenBurgerMenu.value = false;
    }
}

function toggleBurgerMenu() {
    if (!isOpenBurgerMenu.value) {
        isOpenBurgerMenu.value = true;

        return;
    }

    isOpenBurgerMenu.value = false;
}

</script>
  
<style scoped>
.header {
    padding: 2rem 0;
}

.container {
    max-width: 80%;
    margin: 0 auto;
    padding: 0 1rem;
}

.burger-trigger {
    position: relative;
    z-index: 101;
    display: none;
}

.navigation-menu >>> .navigation-menu__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem 4rem;
}

@media (max-width: 575.98px) {
    .container .navigation-menu {
        display: none;
    }

    .navigation-menu >>> .navigation-menu__list {
        flex-direction: column;
    }

    .burger-trigger {
        display: grid;
        margin-left: auto;
    }
}
</style>