<template>
    <TheHeader />
    <main>
        <div v-if="!isLoaded" class="loader"><SpinnerMain style="width: 50px" /></div>
        <ErrorNotification v-else-if="isError" :message="errorMessage" />
        <section v-else class="standards">
            <h1 class="standards__lead">Стандарты</h1>
            <div class="standards__list">
                <div class="standards__item">
                    <h2 class="standards__title">
                        Доступные стандарты
                    </h2>
                    <ProcessesList 
                        :standards="avaliableStandards" 
                        :updateStandards="updateData" 
                        :treeFormat="true"
                        :pickProcess="(processName) => pickProcess(processName)" 
                    />
                    <AddIcon 
                        v-if="avaliableStandards.length === 0 || avaliableStandards[0].canEdit !== '0'" 
                        @click="toggleCreatePopUp"
                        class="standards__create-btn" 
                    />
                </div>
                <div class="standards__item">
                    <h2 class="standards__title">
                        Необходимо изучить мне
                    </h2>
                    <p v-if="didntLearnStandards.length === 0">Нет неизученных стандартов</p>
                    <ProcessesList 
                        v-else 
                        :standards="didntLearnStandards" 
                        :updateStandards="updateData" 
                        :treeFormat="false" 
                    />
                </div>
                <div class="standards__item">
                    <h2 class="standards__title">
                        Не изучили стандарты
                    </h2>
                    <p v-if="usersDidntLearn.length === 0">Все пользователи изучили стандарты</p>
                    <DidntLearnUsers
                        v-else
                        :users="usersDidntLearn" 
                        :updateStandards="updateData" 
                    />
                </div>
                <div v-if="learnedComments" class="standards__item">
                    <Accordion :initial-value="true">
                        <template v-slot:title>
                            <span class="standards__title">Последние 50</span>
                        </template>
                        <template v-slot:content>
                            <LearnedComments 
                                :comments="learnedComments" 
                                :updateStandards="updateData" 
                            />
                        </template>
                    </Accordion>
                </div>
            </div>
            <EditStandard 
                v-if="isOpenCreatePopUp" 
                :closePopUp="toggleCreatePopUp" 
                :standardData="emptyStandardData"
                :updateStandards="updateData" 
                action="create" 
            />
            <EditProcessAccess
                v-if="pickedProcessName" 
                :closePopUp="() => pickedProcessName = ''" 
                :processName="pickedProcessName"
                :updateStandards="updateData"  
            />
        </section>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isManager } from '@/js/AuthFunctions';
import { GetStandards, GetUsersDidntLearnStandard, GetLearnedComments } from './js/StandardsApiClasses';
import AddIcon from './img/add.svg?component';
import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from "@/components/SpinnerMain.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import EditStandard from './components/PopUps/EditStandard.vue';
import EditProcessAccess from './components/PopUps/EditProcessAccess.vue';
import ProcessesList from './components/ProcessesList.vue';
import DidntLearnUsers from './components/DidntLearnUsers.vue';
import Accordion from '@/components/Accordion.vue';
import LearnedComments from './components/LearnedComments.vue';

const router = useRouter();

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: 'managerAuth' });

// Все стандарты
const avaliableStandards = ref([]);
// Неизученные стандарты
const didntLearnStandards = ref([]);
// Пользователи, неизучившие стандарты
const usersDidntLearn = ref([]);
// Комментарии пользователей, изучивших стандарты (последние 50)
const learnedComments = ref([]);

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

// Обработка получения всех доступных стандартов
const handleGetavaliableStandards = (successCallback) => {
    getStandardsDataFromServer(
        'all',
        (response) => {
            if (response.success === '1') {
                avaliableStandards.value = response.standards;
                successCallback();
            } else {
                handleError(response.message);
            }
        },
        (error) => {
            handleError('Ошибка получения стадартов: ' + error);
        }
    )
}

// Обработка получения неизученных стандартов
const handleGetDidntLearnStandards = (successCallback) => {
    getStandardsDataFromServer(
        'didnt_learn',
        (response) => {
            if (response.success === '1') {
                didntLearnStandards.value = response.standards;
                successCallback();
            } else {
                handleError(response.message);
            }
        },
        (error) => {
            handleError('Ошибка получения стадартов: ' + error);
        }
    )
}

// Обработка получения пользователей, неизучивших стандарты
const handleGetUsersDidntLearn = (successCallback) => {
    getUsersDidntLearnFromServer(
        (response) => {
            if (response.success === '1') {
                usersDidntLearn.value = response.users;
                successCallback();
            } else {
                handleError(response.message);
            }
        },
        (error) => {
            handleError('Ошибка получения пользователей: ' + error);
        }
    )
}

// Обработка получения комментариев пользователей, изучивших стандарт
const handleGetLearnedComments = (successCallback) => {
    getLearnedCommentsFromServer(
        (response) => {
            if (response.success === '1') {
                learnedComments.value = response.comments;
                successCallback();
            } else {
                handleError(response.message);
            }
        }, (error) => {
            handleError('Ошибка получения комментариев: ' + error)
        }
    )
}

// Статус открытия модального окна создания нового стандарта
const isOpenCreatePopUp = ref(false);
// Изменение статуса открытия модального окна
const toggleCreatePopUp = () => isOpenCreatePopUp.value = !isOpenCreatePopUp.value;
// Пустая структура нового стандарта
const emptyStandardData = {
    name: '',
    process: '',
    link: '',
    updatedAt: '',
}

// Название выбранного процесса
const pickedProcessName = ref('');
// Функция выбора процесса
const pickProcess = (name) => pickedProcessName.value = name;

// Получение стандартов с сервера
const getStandardsDataFromServer = (type, response, reject) => {
    const requestInstance = new GetStandards();
    requestInstance.type = type;

    requestInstance.request(
        "/standards/get_standards.php",
        "manager",
        response,
        reject
    );
};

// Получение пользователей, которые не ознакомились с стандартами
const getUsersDidntLearnFromServer = (response, reject) => {
    const requestInstance = new GetUsersDidntLearnStandard();
    requestInstance.standardId = 'all';

    requestInstance.request(
        '/standards/get_users_didnt_learn_standard.php',
        'manager',
        response,
        reject,
    );
}

// Получение комментариев пользователей, изучивших стандарт
const getLearnedCommentsFromServer = (response, reject) => {
    const requestInstance = new GetLearnedComments();
    requestInstance.standardId = '';
    requestInstance.userId = '';

    requestInstance.request(
        '/standards/get_learned_comments.php',
        'manager',
        response,
        reject
    );
}

const updateData = () => {
    // Сначала загружаем все стандарты
    handleGetavaliableStandards(() => {
        // Затем загружаем неизученные стандарты
        handleGetDidntLearnStandards(() => {
            // Затем загружаем пользователей, неизучивших стандарты
            handleGetUsersDidntLearn(() => {
                // Затем загружаем последние комментарии пользователей
                handleGetLearnedComments(() => {
                    // Если все завершилось успешно, отмечаем, что данные загружены
                    isLoaded.value = true;
                })
            });
        });
    });
}

onMounted(() => updateData())

</script>

<style scoped>
main {
    padding: 60px 80px;
}

.loader {
    text-align: center;
}

.standards__lead {
    text-align: center;
}

.standards__list {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 0 20px;
}

.standards__item {
    padding: 20px;
    border: 1px solid var(--milk);
    border-radius: 16px;
    width: 100%;
    color: var(--tundora);
}

.standards__item > *:not(:last-child) {
    margin: 0 0 16px;
}

.standards__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--tundora);
}

.standards__create-btn {
  color: var(--transparent-blue);
  cursor: pointer;
  transition: 0.15s all;
}

.standards__create-btn:hover {
  transform: scale(1.1);
}
</style>