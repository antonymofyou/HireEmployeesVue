<template>
  <div
    class="period"
    @click.stop="handlePeriodClick"
  >
    <ActionsButtons
      v-show="props.isActive"
      class="period__actions"
      @delete="handleDeleteAction"
    />

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
  periodId: {
    type: Number,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits({
  select: (payload) => {
    return Boolean(payload.id);
  },

  delete: (payload) => {
    return Boolean(payload.id && payload.action === 'delete');
  }
});

/**
 * Обработка клика по периоду
 */
function handlePeriodClick() {
  console.log('Select: ', props.periodId)
  emit('select', { id: props.periodId });
}

/**
 * Обработка события удаления с кнопок действия
 */
function handleDeleteAction() {
  console.log('Delete: ', props.periodId)
  emit('delete', { id: props.periodId, action: 'delete' });
}
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