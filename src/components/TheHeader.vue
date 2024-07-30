<template>
    <header class="header">
        <div class="container">
            <BurgerTrigger v-if="isRenderBurgerMenu" :aria-expanded="isOpenBurgerMenu" :class="{'active': isOpenBurgerMenu}" @pointerup="toggleBurgerMenu" @keydown.enter.space="toggleBurgerMenu" />
            <NavigationMenu :list-items="listNavigation" />
        </div>
        <BurgerMenu v-if="isRenderBurgerMenu" :model-value="isOpenBurgerMenu" @update:model-value="isOpenBurgerMenu = $event">
            <NavigationMenu @transition="closeBurgerMenu" :list-items="listNavigation" />
        </BurgerMenu>
    </header>
</template>

<script setup>

import { ref, watch, onBeforeUnmount } from 'vue';

import NavigationMenu from "@/components/NavigationMenu.vue";
import BurgerTrigger from "@/components/BurgerTrigger.vue";
import BurgerMenu from "@/components/BurgerMenu.vue";
import BookIcon from '@/assets/icons/book.svg?component';
import PersonIcon from '@/assets/icons/person.svg?component';
import BriefcaseIcon from '@/assets/icons/briefcase.svg?component';
import debounce from '@/assets/js/debounce';

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
const innerWidth = ref(window.innerWidth);
const updateInnerWidth = debounce(function() {
    innerWidth.value = window.innerWidth;
}, 400);
const isRenderBurgerMenu = ref(false);

watch(() => innerWidth.value, function() {
    if (innerWidth.value < 576) {
        isRenderBurgerMenu.value = true;
    }

    if (innerWidth.value >= 576) {
        closeBurgerMenu();
    }
},
    { immediate: true }
);

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

window.addEventListener('resize', updateInnerWidth);

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateInnerWidth);
})

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