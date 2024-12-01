<template>
   <Modal
    :show="props.isShow"
    class="modal-confirm"
    @pointerdown.self="$emit('close')"
  >
    <template #header>
      <div class="modal-confirm__header">
        <span>{{ props.title }}</span>
      </div>
    </template>

    <template #body>
      <div class="modal-confirm__footer">
        <div class="modal-confirm__actions">
          <ButtonMain
            :is-active="props.isLoading"
            align="center"
            @click="handleClickConfirm"
          >
            <template #text>{{ props.confirmText }}</template>
          </ButtonMain>
  
          <ButtonMain
            :is-disabled="props.isLoading"
            @click="$emit('close')"
          >
            <template #text>{{ props.rejectText }}</template>
          </ButtonMain>
        </div>

        <div class="modal-confirm__error">
          {{ props.error }}
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import ButtonMain from '@/components/ButtonMain.vue';
import Modal from '@/components/Modal.vue';

const props = defineProps({
  // Показывается ли модалка
  isShow: {
    type: Boolean,
    required: true,
  },
  // Заголовок
  title: {
    type: String,
    required: true,
  },
  // Статус загрузки
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  // Ошибка
  error: {
    type: String,
    required: false,
    default: ''
  },
  // Текст подтверждения
  confirmText: {
    type: String,
    required: false,
    default: 'Подтвердить'
  },
  // Текст отмены
  rejectText: {
    type: String,
    required: false,
    default: 'Отмена'
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
  flex-direction: column;
  width: 100%;
  max-width: 220px;
  row-gap: 10px;
}

.modal-confirm__actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  color: #fff;
}

.modal-confirm__error {
  font-size: 12px;
  text-align: center;
  color: var(--cinnabar);
}
</style>