<template>
    <nav class="navigation-menu">
        <ul class="navigation-menu__list">
            <li
                v-for="item of listItems"
                :key="item.pageName"
                class="navigation-menu__item"
            >
                <RouterLink
                    @pointerup="emits('transition')"
                    @keydown.enter.space="emits('transition')"
                    :to="{
                        name: item.pathName,
                    }"
                    class="navigation-menu__link"
                >
                    <slot :item="item">
                        {{ item.pageName }}
                        <component v-if="item.icon" class="navigation-menu__icon" :is="item.icon" />
                    </slot>
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>

const props = defineProps({
    listItems: {
        type: Array,
        required: true,
    }
});
const emits = defineEmits({
    transition: null,
});

</script>
  
<style scoped>
.navigation-menu__list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.navigation-menu__link {
    outline: none;
    font-size: 16px;
    line-height: 1.2;
    letter-spacing: 0.02em;
    color: var(--mine-shaft);
    text-decoration: none;
    transition: opacity 0.2s;
}

.navigation-menu__icon {
    margin-left: 8px;
    width: 16px;
    height: 16px;
    transform: translateY(2px);
    fill: currentColor;
}

.router-link-active {
    color:var(--transparent-blue);
}

/* Устройства с мышью */

@media (hover: hover) and (pointer: fine) {
    .navigation-menu__link:hover,
    .navigation-menu__link:focus {
        opacity: 0.5;
    }
}
</style>