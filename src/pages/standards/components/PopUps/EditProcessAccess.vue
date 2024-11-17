<template>
    <Popup :visibleClBtn="true" class="big-popup" @clPopup="closePopUp">
        <div v-if="!isLoaded" class="loader"><SpinnerMain style="width: 50px" /></div>
        <ErrorNotification v-else-if="isError" :message="errorMessage" />
        
        <div v-else>
            <h3 class="edit-process__title">Доступ к процессу</h3>
            <h4 class="edit-process__subtitle">{{ processName }}</h4>
            <div class="edit-process__users">
                <template v-if="users.length">
                    <UserAccessCard 
                        v-for="user in users" 
                        :key="user.userId" 
                        :name="user.userName" 
                        v-model="user.accessType" 
                    />
                </template>
                <p v-else>Нет пользователей</p>
            </div>

            <div class="edit-process__btn">
                <ButtonCommon :isActive="isActiveSave" @click="setAccessesToServer">
                    <template v-slot:text>Сохранить</template>
                </ButtonCommon>
                <ButtonFeedback :success="successSave" :message="messageSave" />
            </div>
        </div>
    </Popup>
</template>
  
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { GetUsersForProcess, SetUsersForProcess } from '../../js/StandardsApiClasses';
import Popup from '../UI/Popup.vue';
import SpinnerMain from "@/components/SpinnerMain.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import ButtonCommon from '../UI/ButtonCommon.vue';
import ButtonFeedback from '../UI/ButtonFeedback.vue';
import UserAccessCard from '../UserAccessCard.vue';

// Название процесса, функция закрытия попапа, функция обновления стандартов
const props = defineProps({
    processName: {
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
})

// Объект с пользователями процесса
const processUsers = ref([]);
// Массив пользователей
const users = computed(() => processUsers.value[props.processName] || []);

// Загружены ли данные
const isLoaded = ref(false);
// Возникла ли ошибка при запросе
const isError = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');

// Обработка ошибки
const handleError = (err) => {
    isLoaded.value = true;
    isError.value = true;
    errorMessage.value = err;
}

// Статус кнопки сохранения
const isActiveSave = ref(false);
// Статус выполнения сохранения
const successSave = ref('');
// Сообщение после выполнения сохранения
const messageSave = ref('');

// Обработка возникновения ошибки при сохранении
const errorHandleSave = (errMessage) => {
    successSave.value = '0';
    messageSave.value = `Ошибка: ${errMessage}`;
    isActiveSave.value = false;
}

// Отправка изменений доступов на сервер
const setAccessesToServer = () => {
    isActiveSave.value = true;
    const requestInstance = new SetUsersForProcess();
    requestInstance.process = props.processName;
    requestInstance.processAccess = users.value;

    requestInstance.request(
        '/standards/set_users_for_process.php',
        'manager',
        (response) => {
            if (response.success === '1') {
                props.updateStandards();
                isActiveSave.value = false;
                successSave.value = '1';
                messageSave.value = 'Изменения успешно сохранены';
            } else {
                errorHandleSave(response.message);
            }
        },
        (err) => errorHandleSave('Ошибка: ' + err));
}

// Отслеживание полей для очистки сообщения об изменении
watch(users, () => {
    messageSave.value = '';
}, { deep: true });

// Получение пользователей с сервера
const getUsersFromServer = () => {
    const requestInstance = new GetUsersForProcess();
    requestInstance.process = props.processName;

    requestInstance.request(
        '/standards/get_users_for_process.php',
        'manager',
        (response) => {
            if (response.success === '1') {
                processUsers.value = response.processesAccess;
                isLoaded.value = true;
            } else {
                handleError(response.message);
            }
        },
        (err) => handleError('Ошибка получения пользователей: ' + err));
}

onMounted(() => getUsersFromServer());
</script>
  
<style scoped>
.loader {
    text-align: center;
}

.edit-process__title {
    margin-top: -40px;
    font-size: 19px;
    text-align: center;
}

.edit-process__subtitle {
    font-size: 17px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 20px;
}

.edit-process__users {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.edit-process__btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 30px;
    text-align: center;
}
</style>