<template>
  <Modal
      class="vacancy-edit__modal"
      :show="indicators.isAdd || indicators.isEdit"
      @click.self="
        indicators.isAdd = false;
        indicators.isEdit = false;
      "
  >
    <template v-slot:header>
      <div class="vacancy-edit__modal__title">
        {{ indicators.isAdd ? 'Добавление статуса' : 'Изменение статуса' }}
      </div>
    </template>

    <template v-slot:body>
      <InputSimple
          v-if="indicators.isAdd"
          v-model="statusMod.name"
          id="statusEdit"
          inputType="input"
          placeholder="Название статуса"
      />
      <InputSimple
          v-model="statusMod.comment"
          id="statusEdit"
          inputType="textarea"
          placeholder="Комментарий"
      />

      <div
          v-if="statusMod.action !== 'delete'"
          class="vacancy-edit__modal-select"
      >
        <div>Цвет:</div>
        <select
            v-model="statusMod.color"
            class="vacancy-edit__modal-select-color"
            :style="{ backgroundColor: statusMod.color }"
        >
          <option
              v-for="color in colors"
              :key="color.value"
              :value="color.value"
              :style="{ backgroundColor: color.value }"
          >
            {{ color.value }}
          </option>
        </select>
      </div>

      <ButtonMain
          class="vacancy-edit__modal-btn-add"
          @click="
            indicators.isAdd
              ? handleModification(statusMod.name, 'create')
              : handleModification(statusMod.name, 'update')
          "
          :isActive="request"
          :message="errorMessage"
      >
        <template v-slot:text>{{
            indicators.isAdd ? 'Добавить' : 'Изменить'
          }}</template>
      </ButtonMain>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';

const props = defineProps({
  show: Boolean,
  statusMod: Object,
  indicators: Object,
  colors: Array,
  handleModification: Function,
  errorMessage: String,
  request: Boolean,
});
</script>

<style scoped>

.vacancy-edit__modal-btn-add {
  display: flex;
  align-items: center;
  align-self: center;
  width: fit-content;
  gap: 5px;
}

.vacancy-edit__modal-select {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.vacancy-edit__modal-select-color {
  -webkit-appearance: none;
  appearance: none;
  width: 90px;
  height: 20px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
}

</style>