<template>
    <Popup :visibleClBtn="true" @clPopup="closePopUp">
        <div class="set-learned__textarea-block">
            <label for="comment" class="set-learned__label">Как я понял изменения:</label>
            <long-input class="set-learned__textarea" id="comment" placeholder="Введите текст..." v-model="comment"></long-input>
        </div>
        <div class="set-learned__btn">
            <ButtonCommon :isActive="isActiveSetLearned" @click="setStandardLearnedToServer">
                <template v-slot:text>Отправить</template>
            </ButtonCommon>
            <ButtonFeedback :success="successSetLearned" :message="messageSetLearned" />
        </div>
    </Popup>
</template>
  
<script setup>
import { ref } from 'vue';
import Popup from '../UI/Popup.vue';
import ButtonCommon from '../UI/ButtonCommon.vue';
import ButtonFeedback from '../UI/ButtonFeedback.vue';
import LongInput from '../UI/LongInput.vue';
import { SetStandardLearned } from '../../js/StandardsApiClasses';

const props = defineProps({
    standardId: {
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

// Текст комментария
const comment = ref('');

// Статус кнопки отметки стандарта изученным
const isActiveSetLearned = ref(false);
// Статус выполнения отметки стандарта изученным
const successSetLearned = ref('');
// Сообщение после выполнения отметки стандарта изученным
const messageSetLearned = ref('');

// Обработка возникновения ошибки при отметке стандарта изученным
const errorHandleSetLearned = (errMessage) => {
    successSetLearned.value = '0';
    messageSetLearned.value = `Ошибка: ${errMessage}`;
    isActiveSetLearned.value = false;
}

// Отметка стандарта изученным
const setStandardLearnedToServer = () => {
    isActiveSetLearned.value = true;
    const requestInstance = new SetStandardLearned();
    requestInstance.standardId = props.standardId;
    requestInstance.comment = comment.value;

    requestInstance.request(
        '/standards/standard_learned.php',
        'manager',
        (response) => {
            if (response.success === '1') {
                isActiveSetLearned.value = false;
                props.updateStandard();
                props.closePopUp();
            } else {
                errorHandleSetLearned(response.message);
            }
        },
        (err) => errorHandleSetLearned(err),
    );
}
</script>
  
<style scoped>
.set-learned__label {
    font-weight: 700;
    font-size: 16px;
}

.set-learned__textarea-block {
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    text-align: center;
    margin-top: 50px;
}

.set-learned__btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 20px;
    text-align: center;
}
</style>