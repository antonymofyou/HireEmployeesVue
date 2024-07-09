<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" @click="$emit('close')">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer-control-buttons"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>

const props = defineProps({
  show: Boolean,
});

</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-header {
  text-align: center;
}

.modal-body {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-default-button {
  float: right;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}

/*
 * Следующие стили применяются автоматически к элементам с
 * transition="modal", когда их видимость переключается
 * с помощью Vue.js.
 *
 * Вы с легкостью можете поиграть с появлением модального окна,
 * редактируя эти стили.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
