<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<style scoped>
.card {
    padding: 20px;
    border: 1px solid var(--milk);
    background-color: var(--white);
    border-radius: 16px;
    width: 100%;
    color: var(--tundora);
}
</style>