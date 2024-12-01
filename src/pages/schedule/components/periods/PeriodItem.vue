<template>
  <div
    :class="{
      'period': true,
      'period--selectable': props.isAllowSelect
    }"
    @click.stop="handlePeriodClick"
  >
    <PeriodActions
      v-show="props.isActive"
      class="period__actions"
      @delete="handleDeleteAction"
    />

    <div class="period__body">
      <span>{{ prettifyTime(props.start) }}</span>
      -
      <span>{{ prettifyTime(props.end) }}</span>
    </div>
  </div>
</template>

<script setup>
import PeriodActions from './PeriodActions.vue';
import { prettifyTime } from '../../js/utils';

const props = defineProps({
  periodId: {
    type: [String, Number],
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
  },
  // Разрешено ли выбирать этот период
  isAllowSelect: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits({
  select: (payload) => {
    return Boolean(payload.periodId);
  },

  delete: (payload) => {
    return Boolean(payload.periodId && payload.action === 'delete');
  }
});

/**
 * Обработка клика по периоду
 */
function handlePeriodClick() {
  if (!props.isAllowSelect) return;
  emit('select', { periodId: props.periodId });
}

/**
 * Обработка события удаления с кнопок действия
 */
function handleDeleteAction() {
  emit('delete', { periodId: props.periodId, action: 'delete' });
}
</script>

<style scoped>
.period {
  box-shadow: 0 1px 5px rgba(112, 103, 103, 0.3);
  padding: 7px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: default;
  background: #fff;
}

.period--selectable {
  cursor: pointer;
  transition: opacity ease 0.1s;
}

.period--selectable:hover {
  opacity: 0.8;
}

.period--selectable:active {
  opacity: 0.4;
}

.period__body {
  display: flex;
  gap: 5px;
  font-size: 13px;
}

.period__actions {
  position: absolute;
  right: 7px;
  top: -2px;
}
</style>