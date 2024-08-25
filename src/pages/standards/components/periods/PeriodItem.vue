<template>
  <div
    class="period"
  >
    <ActionsButtons class="period__actions" />

    <div class="period__body">
      <span>{{ props.start }}</span>
      -
      <span>{{ props.end }}</span>
    </div>
  </div>
</template>

<script setup>
import ActionsButtons from '../ActionsButtons.vue';

const props = defineProps({
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.period {
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.period__body {
  display: flex;
  gap: 5px;
}

.period__actions {
  position: absolute;
  right: 15px;
  top: 4px;
}
</style>