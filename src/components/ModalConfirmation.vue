<template>
  <Modal :show="show" @close="handleCancel">
    <template v-slot:header>
      <h3 class="modal-confirmation__title">{{ title }}</h3>
    </template>

    <template v-slot:body>
      <div class="modal-confirmation__body">
        <p>{{ text }}</p>
      </div>
    </template>

    <template v-slot:footer-control-buttons>
      <div class="modal-confirmation__controls">
        <ButtonMain
          @click="handleCancel"
          :textColor="cancelTextColor"
          :buttonColor="cancelButtonColor"
          :isBold=true
        >
          <template v-slot:text>
            {{ cancelText }}
          </template>
        </ButtonMain>
        <ButtonMain
          @click="handleConfirm"
          :textColor="confirmTextColor"
          :buttonColor="confirmButtonColor"
          :isBold=true
          :isActive="isActive"
          :message="errMessage"
        >
          <template v-slot:text>
            {{ confirmText }}
          </template>
        </ButtonMain>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
import ButtonMain from "@/components/ButtonMain.vue";

// Показ модального окна, заголовок, текст, текст подтверждения, текст отмены,
// цвет текста подтверждения, цвет текста отмены, цвет кнопки подтверждения, цвет кнопки отмены, статус модального окна
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
    default: defaultConfirmTextColor,
    required: false,
  },
  confirmButtonColor: {
    type: String,
    default: defaultConfirmBtnColor,
    required: false,
  },
  cancelTextColor: {
    type: String,
    default: defaultCancelTextColor,
    required: false,
  },
  cancelButtonColor: {
    type: String,
    default: defaultCancelBtnColor,
    required: false,
  },
  requestObject: {
    type: Object,
    required: false,
  },
});

//Значения по умолчанию для кастомизации кнопок управления
const defaultConfirmBtnColor = 'var(--cornflower-blue)';
const defaultConfirmTextColor = 'var(--white)';
const defaultCancelBtnColor = 'var(--link-water)';
const defaultCancelTextColor = 'var(--cornflower-blue)';

const emit = defineEmits(['confirm', 'update:show', 'cancel']);

// Статус кнопки (отправка запроса)
const isActive = ref(false);
// Сообщение об ошибке
const errMessage = ref('');

// Обработка отмены
const handleCancel = () => {
  if (isActive.value === false) {
    emit('update:show');
    errMessage.value = '';
  }
}

const handleConfirm = () => {
  isActive.value = true;

  props.requestObject.fetch(
    (response) => {
      props.requestObject.callback(response);
      emit('update:show');
      isActive.value = false;
    },
    (error) => {
      errMessage.value = error;
      isActive.value = false;
    },
    props.requestObject.dataArg,
  );
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