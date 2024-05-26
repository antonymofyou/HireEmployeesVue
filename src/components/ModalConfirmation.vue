<template>
  <div>
  <Modal :show="show">
    <template v-slot:header>
      <h3 class="modal__title">{{ title }}</h3>
    </template>

    <template v-slot:body>
      <p>{{ text }}</p>
    </template>

    <template v-slot:footer-control-buttons>
        <SubmitButton
          @click="$emit('cancel')"
          :textColor="cancelTextColor"
          :buttonColor="cancelButtonColor"
          :isBold=true
        >
          <template v-slot:text>
            {{ cancelText }}
          </template>
        </SubmitButton>
        <SubmitButton
          @click="$emit('confirm')"
          :textColor="confirmTextColor"
          :buttonColor="confirmButtonColor"
          :isBold=true
        >
          <template v-slot:text>
            {{ confirmText }}
          </template>
        </SubmitButton>

    </template>

  </Modal>
</div>
</template>

<script setup>
import { defineProps } from 'vue';
import Modal from '@/components/Modal.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// Показ модального окна, заголовок, текст, текст подтверждения, текст отмены,
// цвет текста подтверждения, цвет текста отмены, цвет кнопки подтверждения, цвет кнопки отмены
const props = defineProps({
  show: {
    type: Boolean,
  },
  title: {
    type: String,
    default: 'Подтверждение',
  },
  text: {
    type: String,
  },
  confirmText: {
    type: String,
    default: 'Отправить',
  },
  cancelText: {
    type: String,
    default: 'Отмена',
  },
  confirmTextColor: {
    type: String,
    default: defaultConfirmTextColor,
  },
  confirmButtonColor: {
    type: String,
    default: defaultConfirmBtnColor,
  },
  cancelTextColor: {
    type: String,
    default: defaultCancelTextColor,
  },
  cancelButtonColor: {
    type: String,
    default: defaultCancelBtnColor,
  },
});

//Значения по умолчанию для кастомизации кнопок управления
const defaultConfirmBtnColor = 'var(--cornflower-blue)';
const defaultConfirmTextColor = 'var(--white)';
const defaultCancelBtnColor = 'var(--link-water)';
const defaultCancelTextColor = 'var(--cornflower-blue)';
</script>

<style scoped>
.modal__title {
  font-size: 20px;
  font-weight: 600;

  margin: 0;
}
</style>