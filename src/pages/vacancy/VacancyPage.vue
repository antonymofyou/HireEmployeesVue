<template>
    <TheHeader />
    <main>
        <router-view></router-view>
    </main>
</template>

<script setup>

import TheHeader from '@/components/TheHeader.vue';
import { RouterView } from 'vue-router';

</script>