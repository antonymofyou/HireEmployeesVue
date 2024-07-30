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
    font-size: 1rem;
    line-height: 1.2;
    letter-spacing: 0.02em;
    color: var(--mine-shaft);
    text-decoration: none;
}

.navigation-menu__icon {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
    transform: translateY(2px);
    fill: var(--mine-shaft);
}
</style>