<template>
  <Transition name="fade">
    <div
      v-if="props.show"
      class="day-loader"
    >
      <SpinnerMain width="35" />
    </div>
  </Transition>
</template>

<script setup>
import SpinnerMain from '@/components/SpinnerMain.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<style scoped>
.day-loader {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: all ease 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>