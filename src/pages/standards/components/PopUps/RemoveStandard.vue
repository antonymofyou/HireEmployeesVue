<template>
    <Popup :visibleClBtn="true" @clPopup="closePopUp" class="remove-standard-popup">
      <p class="remove-standard-popup__title">Вы уверены, что хотите удалить стандарт?</p>
      <div class="remove-standard-popup__btn">
        <ButtonCommon buttonColor="var(--cinnabar)" hoverColor="var(--error-color)" :isActive="isActiveRemove" @click="removeStandard">
          <template v-slot:text>Удалить</template>
        </ButtonCommon>
        <ButtonFeedback :success="successRemove" :message="messageRemove" />
      </div>
    </Popup>
</template>
  
  <script setup>
import { ref } from 'vue';
import Popup from '../UI/Popup.vue';
import ButtonCommon from '../UI/ButtonCommon.vue';
import ButtonFeedback from '../UI/ButtonFeedback.vue';
import { SetStandard } from '../../js/StandardsApiClasses';

// Id стандарта, функция закрытия модального окна, функция обновления стандартов, функция закрытия главного модального окна стандарта
const props = defineProps({
    standardId: {
        type: String,
        required: true,
    },
    closePopUp: {
        type: Function,
        required: true,
    },
    updateStandards: {
        type: Function,
        required: true,
    },
    closeMainPopUp: {
        type: Function,
        required: true,
    },
})

// Статус кнопки удаления
const isActiveRemove = ref(false);
// Статус выполнения удаления
const successRemove = ref('');
// Сообщение после выполнения удаления
const messageRemove = ref('');

// Обработка возникновения ошибки при удалении
const errorHandleRemove = (errMessage) => {
    successRemove.value = '0';
    messageRemove.value = `Ошибка: ${errMessage}`;
    isActiveRemove.value = false;
}

// Удаление стандарта
const removeStandard = () => {
    isActiveRemove.value = true;
    const requestInstance = new SetStandard();
    requestInstance.standardId = props.standardId;
    requestInstance.action = 'delete';

    requestInstance.request(
        '/standards/set_standard.php',
        'manager',
        (response) => {
            if (response.success === '1') {
                isActiveRemove.value = false;
                props.closePopUp();
                props.closeMainPopUp();
                props.updateStandards();
            } else {
                errorHandleRemove(response.message);
            }
        },
        (err) => errorHandleRemove(err),
    );
}
</script>
  
<style scoped>
.remove-standard-popup {
    display: flex;
    flex-direction: column;
    align-items: center;
}
  
.remove-standard-popup__title {
    margin-top: 50px;
    text-align: center;
}
  
.remove-standard-popup__btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 15px;
    text-align: center;
}
</style>