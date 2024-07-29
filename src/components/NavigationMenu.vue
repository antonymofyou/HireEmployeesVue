<template>
    <nav class="navigation-menu">
        <ul class="navigation-menu__list">
            <li
                v-for="[pageName, pathName] of listItems"
                :key="pageName"
                class="navigation-menu__item"
            >
                <RouterLink
                    @pointerup="emits('transition')"
                    @keydown.enter.space="emits('transition')"
                    :to="{
                        name: pathName,
                    }"
                    class="navigation-menu__link"
                >
                    <slot>{{ pageName }}</slot>
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
</style>