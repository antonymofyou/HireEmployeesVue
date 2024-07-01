<template>
  <!-- Компонент Modal с пробросом слотов и обработкой события закрытия -->
  <Modal :show="props.show" @close="handleClose">
    <!-- Слот для заголовка модального окна -->
    <template v-slot:header>
      <h3 class="modal-confirmation__title">{{ props.title }}</h3>
    </template>

    <!-- Слот для основного содержимого модального окна -->
    <template v-slot:body>
      <div class="modal-confirmation__body">
        <p>{{ props.text }}</p>
      </div>
    </template>

    <!-- Слот для кнопок управления в нижней части модального окна -->
    <template v-slot:footer-control-buttons>
      <div class="modal-confirmation__controls">
        <!-- Кнопка отмены -->
        <ButtonMain
          @click="handleCancel"
          :textColor="props.cancelTextColor"
          :buttonColor="props.cancelButtonColor"
          :isBold="true"
        >
          <template v-slot:text>
            {{ props.cancelText }}
          </template>
        </ButtonMain>
        <!-- Кнопка подтверждения -->
        <ButtonMain
          @click="handleConfirm"
          :textColor="props.confirmTextColor"
          :buttonColor="props.confirmButtonColor"
          :isBold="true"
          :isActive="isLoading"
          :message="message"
        >
          <template v-slot:text>
            {{ props.confirmText }}
          </template>
        </ButtonMain>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
import ButtonMain from '@/components/ButtonMain.vue';

// Определение входных параметров компонента
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
    required: true,
  },
  title: {
    type: String,
    default: 'Подтверждение',
    required: false,
  },
  text: {
    type: String,
    default: '',
    required: false,
  },
  confirmText: {
    type: String,
    default: 'Отправить',
    required: false,
  },
  cancelText: {
    type: String,
    default: 'Отмена',
    required: false,
  },
  confirmTextColor: {
    type: String,
    default: 'var(--white)',
    required: false,
  },
  confirmButtonColor: {
    type: String,
    default: 'var(--cornflower-blue)',
    required: false,
  },
  cancelTextColor: {
    type: String,
    default: 'var(--cornflower-blue)',
    required: false,
  },
  cancelButtonColor: {
    type: String,
    default: 'var(--link-water)',
    required: false,
  },
  submitFunction: {
    type: Function,
    required: false,
  },
});

// Определение событий, которые компонент может выбрасывать
const emit = defineEmits(['confirm', 'cancel', 'close']);
const isLoading = ref(false); // Состояние загрузки
const success = ref(''); // Состояние успеха операции
const message = ref(''); // Сообщение о результате операции

// Обработчик нажатия на кнопку подтверждения
const handleConfirm = () => {
  if (props.submitFunction) {
    isLoading.value = true;
    props.submitFunction((response) => {
      const { message: resMessage, success: resSuccess } = response;
      success.value = resSuccess;
      message.value = resSuccess === '1' ? resMessage || 'Успех!' : resMessage || 'Ошибка!';
      isLoading.value = false;
      emit('confirm');
    });
  } else {
    emit('confirm');
  }
};

// Обработчик нажатия на кнопку отмены
const handleCancel = () => {
  emit('cancel');
};

// Обработчик события закрытия модального окна
const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
.modal-confirmation__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.modal-confirmation__body {
  max-width: 400px;
  min-height: 80px;
  text-align: center;
}

.modal-confirmation__controls {
  display: flex;
  gap: 10px;
  margin-left: auto;
}
</style>
