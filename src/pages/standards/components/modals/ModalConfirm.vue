<template>
   <Modal
    :show="props.isShow"
    class="modal-confirm"
    @click.self="$emit('close')"
  >
    <template #header>
      <div class="modal-confirm__header">
        <span>{{ props.title }}</span>
      </div>
    </template>

    <template #body>
      <div class="modal-confirm__footer">
        <ButtonMain
          :is-active="props.isLoading"
          @click="handleClickConfirm"
        >
          <template #text>{{ props.buttonText }}</template>
        </ButtonMain>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import ButtonMain from '@/components/ButtonMain.vue';
import Modal from '@/components/Modal.vue';

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: false,
    default: 'Подтвердить'
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

/**
 * Обработка клика по кнопке подтверждения
 */
function handleClickConfirm() {
  emit('confirm');
}
</script>

<style scoped>
.modal-confirm__header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-confirm__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>