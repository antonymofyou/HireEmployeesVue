<template>
  <Popup :visibleClBtn="true" @clPopup="emit('closePopUp')" class="link-popup">
    <div class="link-popup__content">
      <p class="link-popup__title">Редактирование ссылки</p>
      <input v-model="linkLocal" placeholder="Ссылка..." class="link-popup__input" />
      <div class="link-popup__controls">
        <ButtonCommon buttonColor="var(--cinnabar)" hoverColor="var(--your-pink)" @click="removeLink">
          <template v-slot:text>Удалить</template>
        </ButtonCommon>
        <ButtonCommon buttonColor="var(--ronchi)" hoverColor="var(--apple)" @click="saveLink">
          <template v-slot:text>Сохранить</template>
        </ButtonCommon>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import Popup from '../../UI/Popup.vue';
import ButtonCommon from '../../UI/ButtonCommon.vue';

// Ссылка
const props = defineProps({
  link: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['inputLink', 'closePopUp']);

// Локальная ссылка для изменения
const linkLocal = ref(props.link);

// Следим за изменением props.link, чтобы обновить linkLocal при изменении
watch(() => props.link, (newLink) => {
  linkLocal.value = newLink;
});

// Сохранение ссылки
const saveLink = () => {
  emit('inputLink', linkLocal.value);
}

// Удаление ссылки
const removeLink = () => {
  emit('inputLink', '');
}
</script>

<style scoped>
.link-popup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-left: 10px;
  padding-right: 10px;
}

.link-popup__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.link-popup__title {
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  margin-top: -30px;
  margin-bottom: 10px;
}

.link-popup__controls {
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-top: 15px;
}

.link-popup__input {
  width: 100%;
  border-radius: 16px;
  padding: 16px 20px;
  border: 1px solid var(--light-violet);
  background-color: var(--white);
  font-size: 16px;
  color: var(--mine-shaft);
}

.link-popup__input::placeholder {
  color: var(--trundora);
}

.link-popup__input:focus {
  outline: 2px solid var(--transparent-blue);
}
</style>