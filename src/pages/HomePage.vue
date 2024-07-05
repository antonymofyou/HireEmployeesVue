<template>
  <div>
    <h1>Добро пожаловать</h1>
    <p>это домашняя страница</p>
  </div>
</template>

<script setup>

import { useRouter } from "vue-router";
import { isManager } from "@/js/AuthFunctions";

const router = useRouter();

if (isManager()) router.push({ name: "vacanciesList" });
else router.push({ name: "managerAuth" });

</script>

<style lang="scss" scoped></style>