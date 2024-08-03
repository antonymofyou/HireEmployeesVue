<template>
    <h1>Сотрудники</h1>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { isAdmin } from '@/js/AuthFunctions';

const router = useRouter();

if (!isAdmin()) router.push({ name: 'vacanciesList' });

</script>