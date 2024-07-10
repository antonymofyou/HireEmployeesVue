<template>
    <Modal :show="show" @close="cancelFunction">
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
            @click="cancelFunction"
            :textColor="cancelTextColor"
            :buttonColor="cancelButtonColor"
            :isBold=true
          >
            <template v-slot:text>
              {{ cancelText }}
            </template>
          </ButtonMain>
          <ButtonMain
            @click="confirmFunction"
            :textColor="confirmTextColor"
            :buttonColor="confirmButtonColor"
            :isBold=true
            :isActive="loading"
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
  import Modal from '@/components/Modal.vue';
  import ButtonMain from "@/components/ButtonMain.vue";
  import {ref} from "vue";
  
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
    data: {
      type: Object,
    }
  });
  
  const emit = defineEmits(['confirm', 'update:show', 'cancel']);
  // const show = ref(props.show);
  
  //Значения по умолчанию для кастомизации кнопок управления
  const defaultConfirmBtnColor = 'var(--cornflower-blue)';
  const defaultConfirmTextColor = 'var(--white)';
  const defaultCancelBtnColor = 'var(--link-water)';
  const defaultCancelTextColor = 'var(--cornflower-blue)';
  
  const loading = ref(false);
  const errMessage = ref('');

  
  const cancelFunction = () => {
    if (loading.value === false) {
      emit('update:show');
      errMessage.value = '';
    }
  };

async function confirmFunction() {
  loading.value = true;

  // Преобразуем функцию в Promise
  const asyncOperation = () => {
    return new Promise((resolve, reject) => {
      try {
        let response = props.data.fetch(resolve, reject, props.data?.id);
        
      } catch (error) {
        
      }
    });
  };

  try {
    await asyncOperation();
    props.data.callback();
    emit('update:show');
  } catch (error) {
    errMessage.value = error;
  } finally {
    loading.value = false;
  }
}
  
  
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
  