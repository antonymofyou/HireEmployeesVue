<template>
    <header class="header">
        <div class="container">
            <BurgerTrigger :aria-expanded="isOpenBurgerMenu" :class="{'active': isOpenBurgerMenu}" @pointerup="toggleBurgerMenu" @keydown.enter.space="toggleBurgerMenu" />
            <NavigationMenu :list-items="listNavigation" />
        </div>
        <BurgerMenu v-if="isRenderBurgerMenu" :model-value="isOpenBurgerMenu" @update:model-value="isOpenBurgerMenu = $event">
            <NavigationMenu @transition="closeBurgerMenu" :list-items="listNavigation" />
        </BurgerMenu>
    </header>
</template>

<script setup>

import { ref } from 'vue';

import NavigationMenu from "@/components/NavigationMenu.vue";
import BurgerTrigger from "@/components/BurgerTrigger.vue";
import BurgerMenu from "@/components/BurgerMenu.vue";
import breakpoints from '@/assets/js/breakpoints';
import BookIcon from '@/assets/icons/book.svg?component';
import PersonIcon from '@/assets/icons/person.svg?component';
import BriefcaseIcon from '@/assets/icons/briefcase.svg?component';

const listNavigation = [
    {
        pageName: 'Вакансии',
        pathName: 'vacanciesList',
        icon: BriefcaseIcon,
    },
    {
        pageName: 'Сотрудники',
        pathName: 'home',
        icon: PersonIcon,
    },
    {
        pageName: 'Стандарты',
        pathName: 'home',
        icon: BookIcon,
    },
];
const isOpenBurgerMenu = ref(false);
const isRenderBurgerMenu = ref(false);

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

breakpoints({
    // 576px
    [576]: closeBurgerMenu,
    // 0px
    [0] : function() {
        isRenderBurgerMenu.value = true;
    },
});

</script>
  
<style scoped>
.header {
    padding: 32px 0;
}

.container {
    max-width: 80%;
    margin: 0 auto;
    padding: 0 16px;
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
    justify-content: space-evenly;
    gap: 16px 32px;
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
        margin: 0 auto;
    }
}
</style>