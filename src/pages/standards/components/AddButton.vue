<template>
  <ButtonIcon
    class="add-button"
  >
    <template #icon>
      <IconAdd class="add-button__icon" />
    </template>
  </ButtonIcon>
</template>

<script setup>
import ButtonIcon from "@/components/ButtonIcon.vue";
import IconAdd from "@/assets/icons/add.svg?component";
</script>

<style scoped>
.add-button__icon {
  align-self: center;
  transition: transform 0.2s ease, opacity 0.1s ease;
  width: 23px;
  height: 23px;
}

.add-button:hover .add-button__icon {
  transform: scale(1.2);
  opacity: 0.8;
}

.add-button:active .add-button__icon {
  opacity: 0.5;
}
</style>