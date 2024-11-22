<template>
    <Popup :visibleClBtn="true" @clPopup="closePopUp" class="cancel-comment-popup">
        <p class="cancel-comment-popup__title">Отменить изучение стандарта?</p>
        <div class="cancel-comment-popup__btn">
            <ButtonCommon buttonColor="var(--cinnabar)" hoverColor="var(--your-pink)" :isActive="isActiveCancel" @click="cancelComment">
                <template v-slot:text>Отменить</template>
            </ButtonCommon>
            <ButtonFeedback :success="successCancel" :message="messageCancel" />
        </div>
    </Popup>
</template>
  
<script setup>
import { ref } from 'vue';
import Popup from '../UI/Popup.vue';
import ButtonCommon from '../UI/ButtonCommon.vue';
import ButtonFeedback from '../UI/ButtonFeedback.vue';
import { ResetStandardLearn } from '../../js/StandardsApiClasses';

// Id комментария, функция закрытия модального окна, функция обновления стандартов
const props = defineProps({
    commentId: {
        type: String,
        required: true,
    },
    closePopUp: {
        type: Function,
        required: true,
    },
    updateStandard: {
        type: Function,
        required: true,
    },
})

// Статус кнопки отмены комментария
const isActiveCancel = ref(false);
// Статус выполнения отмены комментария
const successCancel = ref('');
// Сообщение после выполнения отмены комментария
const messageCancel = ref('');

// Обработка возникновения ошибки при отмене
const errorHandleCancel = (errMessage) => {
    successCancel.value = '0';
    messageCancel.value = `Ошибка: ${errMessage}`;
    isActiveCancel.value = false;
}

// Отмена комментария
const cancelComment = () => {
    isActiveCancel.value = true;
    const requestInstance = new ResetStandardLearn();
    requestInstance.learnedCommentId = props.commentId;

    requestInstance.request(
        '/standards/reset_standard_learn.php',
        'manager',
        (response) => {
            if (response.success === '1') {
                isActiveCancel.value = false;
                props.updateStandard();
                props.closePopUp();
            } else {
                errorHandleCancel(response.message);
            }
        },
        (err) => errorHandleCancel(err),
    );
}
</script>
  
<style scoped>
.cancel-comment-popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.cancel-comment-popup__title {
    margin-top: 50px;
    text-align: center;
}

.cancel-comment-popup__btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 15px;
    text-align: center;
}
</style>