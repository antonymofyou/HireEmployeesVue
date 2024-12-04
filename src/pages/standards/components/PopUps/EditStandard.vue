<template>
    <Popup 
        :visibleClBtn="true"
        @clPopup="closePopUp" 
        class="result-popup"
    >
        <div v-if="!isLoaded" class="loader"><SpinnerMain style="width: 50px" /></div>
        <ErrorNotification v-else-if="isError" :message="errorMessage" />
        <div v-else class="popup-edit-standard">
            <h3 class="popup__title">
                {{ action === 'update' ? 'Редактирование' : 'Создание' }} стандарта
                <span v-if="action === 'update'" class="popup-edit-standard__id">(id{{ standardData.id }})</span>
            </h3>
            <div class="edit-standard__block">
                <label for="standard_name" class="edit-standard__label">Название стандарта</label>
                <input class="edit-standard__input" id="standard_name" v-model="standard.name" />
            </div>

            <div class="edit-standard__block">
                <label for="process_name" class="edit-standard__label">Процесс</label>
                <SelectSimple
                    :options="processesOptions"
                    v-model="selectedProcess"
                    class="edit-standard__select"
                />
                <input v-if="isNewProcess" class="edit-standard__input edit-standard__input--new-process" id="process_name" v-model="standard.process" placeholder="Новый процесс..." />
            </div>

            <div class="edit-standard__block">
                <label for="standard_link" class="edit-standard__label">Ссылка на стандарт</label>
                <input class="edit-standard__input" id="standard_link" v-model="standard.link" />
            </div>

            <div class="edit-standard__block">
                <label class="edit-standard__label">Html описание</label>
                <TextEditor v-model="standard.htmlDescription" />
            </div>

            <div class="edit-standard__block edit-standard__block-date">
                <label for="standard_date" class="edit-standard__label">Дата обновления стандарта</label>
                <span class="edit-standard__set-current-date" @click="setCurrentDate">Установить текущее</span>
                <input class="edit-standard__input" id="standard_date" type="datetime-local" v-model="formattedDate" />
            </div>

            <div class="edit-standard__save-btn">
                <ButtonCommon :isActive="isActiveSubmit" @click="handleSubmit">
                    <template v-slot:text>{{ props.action === 'create' ? 'Создать' : 'Сохранить' }}</template>
                </ButtonCommon>
                <ButtonFeedback :success="successSubmit" :message="messageSubmit" />
            </div>

            <div v-if="action === 'update'" class="edit-standard__controls">
                <RemoveIcon @click="toggleRemovePopUp" class="edit-standard__btn-remove" />
            </div>
        </div>
    </Popup>

    <RemoveStandard 
        v-if="isOpenRemovePopUp" 
        :standardId="standardData.id" 
        :closePopUp="toggleRemovePopUp" 
        :updateStandards="updateStandards"
        :closeMainPopUp="closeMainPopUp" 
    />
</template>
  
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Popup from '../UI/Popup.vue';
import SpinnerMain from "@/components/SpinnerMain.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import SelectSimple from '../UI/SelectSimple.vue';
import ButtonCommon from '../UI/ButtonCommon.vue';
import ButtonFeedback from '../UI/ButtonFeedback.vue';
import RemoveIcon from '../../img/remove.svg?component';
import { MainRequestClass } from '@/js/RootClasses';
import { SetStandard } from '../../js/StandardsApiClasses';
import RemoveStandard from './RemoveStandard.vue';
import TextEditor from '../TextEditor/TextEditor.vue';

// Данные стандарта, функция закрытия попапа, функция обновления стандартов, действие (create / update),
// функция закрытия основного попапа
const props = defineProps({
    standardData: {
        type: Object,
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
    action: {
        type: String,
        required: true,
    },
    closeMainPopUp: {
        type: Function,
        required: false,
    },
})

// Данные стандарта для заполнения
const standard = ref({
    name: props.standardData.name,
    process: props.standardData.process,
    link: props.standardData.link,
    htmlDescription: props.standardData.htmlDescription,
    updatedAt: props.standardData.updatedAt,
});

// Доступные процессы
const availableProcesses = ref([]);
// Выбранный процесс
const selectedProcess = ref(standard.value.process);
// Новый процесс
const isNewProcess = ref('');
// Селект доступных процессов
const processesOptions = computed(() => {
    const available = availableProcesses.value.map((process) => ({
        name: process,
        id: process,
    }));
    return [...available, { name: 'Добавить новый', id: 'Добавить новый' }];
})

// Показ/скрытие инпута с вводом нового процесса
watch(selectedProcess, (newVal, oldVal) => {
    if (newVal === 'Добавить новый') {
        standard.value.process = '';
        isNewProcess.value = true;
    }
    if (oldVal === 'Добавить новый') {
        isNewProcess.value = false;
    }
});

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

// computed для получения и форматирования даты
const formattedDate = computed({
    get() {
        // Возвращаем дату без секунд
        return standard.value.updatedAt.slice(0, -3).replace('T', ' ');
    },
    set(value) {
        // Обновляем дату в стандартных данных, добавляя ":00" в конец
        standard.value.updatedAt = value.replace('T', ' ') + ':00';
    }
})

// Попап удаления стандарта
const isOpenRemovePopUp = ref(false);
const toggleRemovePopUp = () => isOpenRemovePopUp.value = !isOpenRemovePopUp.value;

// Получение доступных процессов с сервера
const getProcesses = () => {
    const requestInstance = new MainRequestClass();

    requestInstance.request(
        '/standards/get_processes.php',
        'manager',
        (response) => {
            if (response.success === '1') {
                availableProcesses.value = response.processes;
                isLoaded.value = true;
            } else {
                handleError(response.message);
            }
        },
        (err) => handleError('Ошибка получения процессов: ' + err));
}

// Статус кнопки отправки
const isActiveSubmit = ref(false);
// Статус выполнения отправки
const successSubmit = ref('');
// Сообщение после выполнения отправки
const messageSubmit = ref('');

// Обработка возникновения ошибки при отправке
const errorHandleSubmit = (errMessage) => {
    successSubmit.value = '0';
    messageSubmit.value = `Ошибка: ${errMessage}`;
    isActiveSubmit.value = false;
}

// Обработка отправки изменения
const handleSubmit = () => {
    isActiveSubmit.value = true;
    sendChangesToServer((response) => {
        if (response.success === '1') {
            isActiveSubmit.value = false;
            successSubmit.value = '1';
            messageSubmit.value = props.action === 'create' ? 'Стандарт успешно создан' : 'Изменения успешно сохранены';
            props.updateStandards();
        } else {
            errorHandleSubmit(response.message);
        }
    },
        (err) => errorHandleSubmit(err))
}

// Отправка изменений на сервер
const sendChangesToServer = (successCallback, errorCallback) => {
    // Процесс: если выбран "новый" - то раздел равен значению поля ввода, иначе выбранный из существующих
    const processValue = selectedProcess.value === 'Добавить новый' ? standard.value.process : selectedProcess.value;
    // Данные стандарта
    const standardFields = {
        name: standard.value.name,
        process: processValue,
        link: standard.value.link,
        htmlDescription: standard.value.htmlDescription,
        updatedAt: standard.value.updatedAt,
    };

    // Класс запроса (update или create)
    let requestInstance = new SetStandard();
    requestInstance.standard = standardFields;
    requestInstance.action = props.action;

    if (props.action === 'update') {
        requestInstance.standardId = props.standardData.id;
    }

    requestInstance.request(
        '/standards/set_standard.php',
        'manager',
        (response) => successCallback(response),
        (err) => errorCallback(err),
    );
}

// Отслеживание полей для очистки сообщения об изменении
watch(
    [standard, selectedProcess],
    () => {
        messageSubmit.value = '';
    },
    { deep: true }
);

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const setCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    standard.value.updatedAt = formattedDate;
}

onMounted(() => getProcesses());
</script>
  
<style scoped>
.loader {
  text-align: center;
}

.popup__title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 15px;
    margin-top: -40px;
}

.popup-edit-standard__id {
    font-size: 11px;
}

.popup-edit-standard__id-number {
    font-weight: 700;
    color: var(--transparent-blue);
}

.edit-standard__block {
    margin-bottom: 20px;
}

.edit-standard__block-date {
    display: flex;
    flex-direction: column;
}

.edit-standard__set-current-date {
    color: var(--transparent-blue);
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 5px;
    transition: 0.15s all;
    cursor: pointer;
}

.edit-standard__set-current-date:hover {
    color: var(--apple);
}

.edit-standard__label {
    display: inline-block;
    font-weight: 700;
    margin-bottom: 5px;
}

input[type="datetime-local"] {
    position: relative;
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    color: transparent;
    background: none;
    z-index: 1;
    cursor: pointer;
}

input[type="datetime-local"]::after {
    display: block;
    content: "\1F4C5";
    font-size: 16px;
    position: absolute;
    width: 15px;
    height: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 25px;
}

.edit-standard__save-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 20px;
    text-align: center;
}

.edit-standard__input {
    border-radius: 16px;
    padding: 12px 16px;
    width: 100%;
    border: 1px solid var(--transparent-blue);
    background-color: var(--white);
    font-size: 16px;
    font-weight: 400;
}

.edit-standard__input:focus {
    outline: 2px solid var(--transparent-blue);
}

.edit-standard__input--new-process {
    margin-top: 10px;
}

.edit-standard__select {
    min-width: max-content;
}

.edit-standard__controls {
    display: flex;
    gap: 5px;
    justify-content: end;
}

.edit-standard__btn-remove {
    cursor: pointer;
    transition: 0.15s all;
}

.edit-standard__btn-remove:hover {
    color: var(--cinnabar);
}
</style>