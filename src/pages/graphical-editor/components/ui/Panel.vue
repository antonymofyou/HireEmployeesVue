<template>
  <div class="panel">
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.panel {
  background: #edf2fa;
  padding: 7px 15px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel *:not(:last-child) {
  border-right: 1px solid #c7c7c7;
  padding-right: 10px;
}
</style>