<template>
  <div class="actions-buttons">
    <ButtonIcon
      class="button-icon"
    >
      <template #icon>
        <IconCrossDelete class="button-icon__icon" />
      </template>
    </ButtonIcon>
  </div>
</template>

<script setup>
import ButtonIcon from '@/components/ButtonIcon.vue';
import IconCrossDelete from "@/assets/icons/close.svg?component";
</script>

<style scoped>
.actions-buttons {
  display: flex;
  column-gap: 5px;
}

.button-icon:hover {
  opacity: 0.7;
}

.button-icon:active {
  opacity: 0.3;
}

.button-icon {
  width: 15px;
  height: 15px;
  position: relative;
}

.button-icon__icon {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>