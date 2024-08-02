<template>
    <header class="header">
        <div class="container">
            <NavigationMenu :list-items="listNavigation" />
        </div>
    </header>
</template>

<script setup>

import NavigationMenu from "@/components/NavigationMenu.vue";
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
        pathName: 'employees',
        icon: PersonIcon,
    },
    {
        pageName: 'Стандарты',
        pathName: 'standards',
        icon: BookIcon,
    },
];

</script>
  
<style scoped>
.header {
    border-bottom: 1px solid var(--transparent-blue);
}

.container {
    max-width: 90%;
    margin: 0 auto;
    padding: 32px 16px;
}

.navigation-menu:deep(.navigation-menu__list) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    gap: 16px;
}

@media (max-width: 575.98px) {
    .container {
        max-width: 100%;
        padding: 16px;
    }

    .navigation-menu:deep(.navigation-menu__list) {
        justify-content: space-between;
    }

    .navigation-menu:deep(.navigation-menu__text) {
        display: none;
    }

    .navigation-menu:deep(.navigation-menu__icon) {
        width: 24px;
        height: 24px;
    }
}
</style>