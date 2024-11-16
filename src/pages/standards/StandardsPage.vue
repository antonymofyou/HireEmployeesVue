<template>
    <TheHeader />
    <main>
        <h1>Стандарты</h1>
        <SpinnerMain v-if="!isLoaded" style="width: 50px" />
        <ErrorNotification v-if="isError" :message="errorMessage" />
    </main>
</template>

<script setup>

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from "@/components/SpinnerMain.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import { ref, onMounted } from 'vue';
import { GetStandards, GetUsersDidntLearnStandard, GetLearnedComments } from './js/StandardsApiClasses';

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