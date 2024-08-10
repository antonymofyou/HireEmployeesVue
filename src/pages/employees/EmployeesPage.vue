<template>
    <TheHeader />
    <main>
        <h1>
            Сотрудники
        </h1>
    </main>
</template>

<script setup>

import TheHeader from '@/components/TheHeader.vue';
import { useRouter } from 'vue-router';
import { isAdmin } from '@/js/AuthFunctions';

const router = useRouter();

if (!isAdmin()) router.push({ name: 'vacanciesList' });

</script>