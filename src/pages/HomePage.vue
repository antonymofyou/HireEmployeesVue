<template>
  <div>
    <h1>Добро пожаловать</h1>
    <p>это домашняя страница</p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

router.push({ name: 'vacanciesList' });
</script>

<style scoped></style>
