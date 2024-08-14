<template>
  <ButtonIcon class="button">
    <template #icon>
      <IconAdd class="button__icon" />
    </template>
  </ButtonIcon>
</template>

<script setup lang="ts">
import ButtonIcon from '@/components/ButtonIcon.vue';
import IconAdd from "@/assets/icons/add.svg?component";
</script>

<style scoped>
.button__icon:hover {
  opacity: 0.7;
}

.button__icon:active {
  opacity: 0.3;
}

.button__icon {
  width: 25px;
  height: 25px;
}
</style>