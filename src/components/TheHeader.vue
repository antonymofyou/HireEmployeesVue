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
    padding: 32px 0;
    border-bottom: 1px solid var(--transparent-blue);
}

.container {
    max-width: 75%;
    margin: 0 auto;
    padding: 0 16px;
}

.navigation-menu:deep(.navigation-menu__list) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    gap: 16px;
}

@media (max-width: 575.98px) {
    .navigation-menu:deep(.navigation-menu__text) {
        display: none;
    }

    .navigation-menu:deep(.navigation-menu__icon) {
        width: 32px;
        height: 32px;
    }
}
</style>