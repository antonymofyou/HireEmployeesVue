<template>
    <TheHeader />
    <main>
        <div v-if="!isLoaded" class="loader"><SpinnerMain style="width: 50px" /></div>
        <ErrorNotification v-else-if="isError" :message="errorMessage" />
        <section v-else class="standards">
            <h1 class="standards__lead">Стандарты</h1>
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
            <div class="standards__list">
                <div>
                    <h2 class="standards__title">
                        Доступные стандарты
                    </h2>
                    <Card>
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
                    </Card>
                </div>
                <div>
                    <h2 class="standards__title">
                        Необходимо изучить мне
                    </h2>
                    <Card>
                        <p v-if="didntLearnStandards.length === 0">Нет неизученных стандартов</p>
                        <ProcessesList 
                            v-else 
                            :standards="didntLearnStandards" 
                            :updateStandards="updateData" 
                            :treeFormat="false" 
                        />
                    </Card>
                </div>
                <div>
                    <h2 class="standards__title">
                        Не изучили стандарты
                    </h2>
                    <Card>
                        <p v-if="usersDidntLearn.length === 0">Все пользователи изучили стандарты</p>
                        <DidntLearnUsers
                            v-else
                            :users="usersDidntLearn" 
                            :updateStandards="updateData" 
                        />
                    </Card>
                </div>
                <div v-if="learnedComments">
                    <Accordion :defActive="true">
                        <template v-slot:accordion-title>
                            <h2 class="standards__title">Последние 50</h2>
                        </template>
                        <template v-slot:accordion-list>
                            <LearnedComments 
                                :comments="learnedComments" 
                                :updateStandards="updateData" 
                            />
                        </template>
                    </Accordion>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GetStandards, GetUsersDidntLearnStandard, GetLearnedComments } from './js/StandardsApiClasses';
import AddIcon from './img/add.svg?component';
// Components
import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from "@/components/SpinnerMain.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import EditStandard from './components/PopUps/EditStandard.vue';
import EditProcessAccess from './components/PopUps/EditProcessAccess.vue';
import Card from './components/UI/Card.vue';
import ProcessesList from './components/ProcessesList.vue';
import DidntLearnUsers from './components/DidntLearnUsers.vue';
import Accordion from './components/UI/Accordion.vue';
import LearnedComments from './components/LearnedComments.vue';

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

.standards__title {
    font-size: 16px;
    margin: 0 0 16px;
}

.standards__create-btn {
  color: var(--transparent-blue);
  margin-top: 10px;
  cursor: pointer;
  transition: 0.15s all;
}

.standards__create-btn:hover {
  transform: scale(1.1);
}

/* ref */

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item {
  background-color: var(--dark-gray-color);
  border: 2px solid var(--light-gray-color);
  width: max-content;
  padding: 8px 16px;
  border-radius: 16px;
  display: flex;
  align-items: end;
  gap: 5px;
}

.link {
  color: var(--transparent-blue);
  font-size: 12px;
}

.h5 {
  font-size: 16px;
  margin-bottom: 5px;
  margin-top: 15px;
  color: var(--transparent-blue);
}
</style>