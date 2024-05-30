<template>
  <tgAuth v-if="!isLoggedIn" v-model:isLoggedIn="isLoggedIn"/>
  <main v-else-if="isLoaded" class="content vacancy">
    <header class="vacancy__header">
      <ButtonSimple
        v-if="statusData.isAnswering"
        class="vacancy__header-btn"
        :submitFunction="handleSave"
        successText="Данные успешно сохранены!"
      >
        <template v-slot:text>
          {{ staticText.save }}
        </template>
        <template v-slot:icon>
          <img src="@/assets/icons/save.svg">
        </template>
      </ButtonSimple>

      <Teleport to="body">
        <ModalConfirmation
          :show="showModalOnSave"
          confirmText="Сохранить"
          text="Вы уже сохранили ответы на другом устройстве. При повторном сохранении, предыдущие данные будут утеряны."
          @confirm="handleConfirmSave"
          @cancel="handleCancelSave"
        />
      </Teleport>

      <div class="vacancy__auth">
        <div class="vacancy__auth-info">
          <img class="vacancy__tg-logo" src="./assets/icons/tg.svg">
          <span class="vacancy__auth-nick">{{ candidateData.user.nickname }}</span>
        </div>
        <ButtonSimple
          class="vacancy__header-btn"
          :buttonColor="staticText.logOutButtonColor"
          :submitFunction="logOut"
        >
          <template v-slot:text>
            {{ staticText.logOut }}
          </template>
          <template v-slot:icon>
            <img src="./assets/icons/logOut.svg">
          </template>
        </ButtonSimple>
      </div>
    </header>
    <section class="container">
      <h2 class="vacancy__title">{{ staticText.title }}</h2>

      <div class="vacancy__info-block">
        <h3>Вакансия: <span class="vacancy__name">{{ candidateData.vacancy.name }}</span></h3> 
        <span class="vacancy__status" :class="statusData.class">{{ statusData.text }}</span>
        <div class="vacancy__description" v-html="candidateData.vacancy.description"></div>
      </div>

      <div class="vacancy__questions-block">
        <div class="vacancy__questions-list">
          <InputSimple
            :modelValue="candidateData.user.fio"
            @update:modelValue="updateUserFIO"
            id="fio"
            labelName="ФИО"
            inputType="input"
            :isLabelBold=true
            placeholder="Введите ваше ФИО..."
            :disabled="!statusData.isAnswering"
          />
          <VacancyIdQuestion
            v-for="(question, index) in candidateData.vacancy.questions"
            :title="`Вопрос №${index + 1}`"
            :key="question.id"
            :question="question.question"
            :answer="question.answer"
            @updateAnswer="updateAnswerText(index, $event)"
            class="list-item"
            :disabled="!statusData.isAnswering"
          />
        </div>
      </div>

      <ButtonSimple v-if="statusData.isAnswering" class="vacancy__send-btn" :align="'end'" :submitFunction="handleSend">
        <template v-slot:text>
          {{ staticText.send }}
        </template>
        <template v-slot:icon>
          <img src="@/assets/icons/send.svg">
        </template>
      </ButtonSimple>

      <ModalConfirmation
        :show="showModalOnSend"
        confirmText="Отправить"
        text="Вы точно хотите отправить ответы? Веденные данные нельзя будет изменить."
        @confirm="handleConfirmSend"
        @cancel="handleCancelSend"
      />
    </section>
  </main>
  <Notification v-if="errorMessage" :message="errorMessage"/>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import tgAuth from './components/tgAuth/tgAuth.vue';

import { isSeeker, logOutSeeker } from "@/js/AuthFunctions";

import { VacanciesGetVacancyById, 
    CandidatesSendCandidateAnswers, 
    CandidatesGetCandidateUserInfo,
    } from "./js/ApiClassesVacancy.js"; 
import VacancyIdQuestion from './components/VacancyIdQuestion.vue';
import ButtonSimple from '@/components/ButtonSimple.vue';
import InputSimple from '@/components/InputSimple.vue';
import ModalConfirmation from '@/components/ModalConfirmation.vue';
import Notification from '@/components/ErrorNotification.vue';

// Индикатор загрузки компонента
const isLoaded = ref(false);

// Состояние авторизации
const isLoggedIn = ref(true);

// Разлогин пользователя
const logOut = () => {
  logOutSeeker();
  isLoggedIn.value = false;
}

// Получение из роута id текущей вакансии
const route = useRoute();
const vacancyId = ref(route.params.id);

// Уведомление об ошибке
const errorMessage = ref('');

const showErrorNotification = (message) => {
  // Сброс в пустую строку для повторного отображения после закрытия
  errorMessage.value = '';
  // Асинхронная установка нового сообщения
  setTimeout(() => {
    errorMessage.value = message;
  }, 0);
};

// Статичный текст страницы
const staticText = {
  title: 'Заполнение вакансии',
  logOut: 'Выйти',
  save: 'Сохранить',
  send: 'Отправить',
  logOutButtonColor: 'var(--cinnabar)',
};

// Данные кандидата: пользователь (ник, фио) и вакансия (название, опиание, статус, вопросы)
const candidateData = ref({
  user: {
    nickname:'',
    fio: '',
  },
  vacancy: {
    name: '',
    description: '',
    status: '',
    questions: [],
  }
});

// Обновление ФИО пользователя
const updateUserFIO = (value) => {
  candidateData.value.user.fio = value;
};

//Заполнение vacancyData данными с сервера
const fetchCandidateData = (callback) => {
  getVacancyDataSeeker((vacResp) => {
    // Получение данных о вакансии (название, описание, статус) и массива вопросов
    const { vacancy, questions } = vacResp;

    getCandidateFromServer((userResp) => {
      // Получение ника и ФИО пользователя
      const { tgNickname, fio } = userResp;

      // Формирование объекта со всеми данными по кандидату (вакансии и пользователе)
      const dataFromServer = {
        user: {
          nickname: tgNickname,
          fio: fio,
        },
        vacancy: {
          name: vacancy.name,
          description: vacancy.description,
          status: vacancy.status,
          questions: questions,
        },
      };

        // успешно, передаём данные
        callback(dataFromServer);
      },
      // если возникла ошибка
      (err) => {
        console.error('Произошла ошибка при загрузке данных: ', err);
        showErrorNotification(`Произошла ошибка при загрузке данных вакансии`);
      }
    );
  },
  // если возникла ошибка
  (err) => {
    console.error('Произошла ошибка при загрузке данных: ', err);
    showErrorNotification(`Произошла ошибка при загрузке данных вакансии`);
  });
};

// Обновление данных кандидата (вакансии и пользователя)
const updateCandidateData = (dataFromServer) => {
  candidateData.value = dataFromServer;
};

// Наблюдение за изменением isLoggedIn и загрузка данных при необходимости
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    fetchCandidateData((dataFromServer) => updateCandidateData(dataFromServer));
  }
});

// Проверка состояния при монтировании компонента и загрузка данных при необходимости
onMounted(() => {
  isLoggedIn.value = isSeeker();

  if (isLoggedIn.value) {
    fetchCandidateData((dataFromServer) => {
      updateCandidateData(dataFromServer);

      // Загрузка завершена
      isLoaded.value = true;
    });
  }
});

//Объект с текстом и классом статуса вакансии
const statusData = computed(() => {
  if (candidateData.value.vacancy.status === 'ANSWERING') {
    return {
      isAnswering: true,
      text: 'Вы еще не откликались на эту вакансию',
      class: 'vacancy__status--warning',
    }
  } 
  return {
    isAnswering: false,
    text: 'Ваши ответы успешно записаны',
    class: 'vacancy__status--success',
  };
});

// Обновление текста ответа
const updateAnswerText = (index, value) => {
  candidateData.value.vacancy.questions[index].answer = value;
};

// Получение данных по текущей вакансии с сервера
const getVacancyDataSeeker = (successCallback, errorCallback) => {
  let requestClass = new VacanciesGetVacancyById()
  requestClass.vacancyId = vacancyId.value;

  requestClass.request(
    '/vacancies/get_vacancy_by_id.php',
    'seeker',
    function(response) {  // успешный результат
      successCallback(response);
    },
    function(err) { // неуспешный результат
      errorCallback(err);
    }
  );
};

// Получение информации о текущем пользователе
const getCandidateFromServer = (successCallback, errorCallback) => {
  let requestClass = new CandidatesGetCandidateUserInfo();

  requestClass.request(
    '/candidates/get_candidate_user_info.php',
    'seeker',
    function(response) { // успешный результат
      successCallback(response.userInfo);
    },
    function(err) { // неуспешный результат
      errorCallback(err);
    }
  );
};

//Отправка ФИО и никнейма пользователя на сервер
const sendUserData = (successCallback, errorCallback) => {
  let requestClass = new CandidatesGetCandidateUserInfo();
  requestClass.userInfo = candidateData.value.user;

  requestClass.request(
    '/candidates/get_candidate_user_info.php',
    'seeker',
    function(response) { // успешный результат
      successCallback(response);
    },
    function(err) { // неуспешный результат
      errorCallback(err);
    }
  );
};

// Функция для сохранения и отправки ответов
const submitAnswers = ({ force = 0, finish = 0 } = {}, successCallback, errorCallback) => {
  // Формирование объекта с ответами для отправки изменений на сервер
  const formattedAnswers = candidateData.value.vacancy.questions.reduce((acc, item) => {
    // Ключ - id вопроса, значение - ответ
    acc[item.id] = item.answer; 
    return acc;
  }, {});

  // Сначала отправляем данные пользователя, а затем через колбэк ответы пользователя
  sendUserData(() => {
    let requestClass = new CandidatesSendCandidateAnswers();
    requestClass.answers = formattedAnswers;
    requestClass.forceSave = force;
    requestClass.finish = finish;

    requestClass.request(
      '/candidates/send_candidate_answers.php',
      'seeker',
      function(response) { // успешный результат
        successCallback(response);
      },
      function(err) { // неуспешный результат
        errorCallback(err);
      }
    );
  });
};

// Показ модального окна при сохранении
const showModalOnSave = ref(false);
// Текущая функция сохранения для дальнейшего вызова при подтверждении
const currentSaveFunction = ref(null);

// Обработка сохранения с проверкой пришедшего success
const saveAnswersWrapper = (successCallback, errorCallback) => {
  submitAnswers({ force: 0, finish: 0 }, (response) => {
    // Если уже было сохранение на другом устройстве, функция принудительного сохранения становится текущей
    if (response.success === "22") {
      showModalOnSave.value = true;
      currentSaveFunction.value = () => submitAnswers({ force: 1, finish: 0 }, successCallback, errorCallback);
    } else {
      successCallback(response);
    }
  },
  // если возникла ошибка
  (err) => {
    console.error('Произошла ошибка при сохранении данных: ', err);
    showErrorNotification(`Произошла ошибка: не удалось сохранить данные`);
  });
};

// Обработчик подтверждения сохранения в модальном окне
const handleConfirmSave = () => {
  showModalOnSave.value = false;
  // Вызов принудительного сохранения
  if (currentSaveFunction.value) {
    currentSaveFunction.value();
  }
};

// Обработчик отмены сохранения в модальном окне
const handleCancelSave = () => {
  showModalOnSave.value = false;
};

// Обработчик нажатия кнопки сохранения
const handleSave = (successCallback, errorCallback) => {
  saveAnswersWrapper(successCallback, errorCallback);
};

// Изначально функция сохранения — это saveAnswersWrapper
currentSaveFunction.value = saveAnswersWrapper;

// Показ модального окна при отправке
const showModalOnSend = ref(false);
// Функция отправки для дальнейшего вызова при подтверждении
const sendFunction = ref(null);

const sendAnswersWrapper = (callback) => {
  showModalOnSend.value = true;
  sendFunction.value = () => sendAnswers(callback);
};

//Отправка ответов на сервер и изменение статуса вакансии на SENT
const sendAnswers = (callback) => {
  submitAnswers({ finish: 1 }, (response) => {
    callback(response);
    // Если данные успешно отправились, обновляем данные кандидата
    if (response.success === '1') {
      fetchCandidateData((dataFromServer) => updateCandidateData(dataFromServer));
    }
  },
  // если возникла ошибка
  (err) => {
    console.error('Произошла ошибка при отправке данных: ', err);
    showErrorNotification(`Произошла ошибка: не удалось отправить данные`);
  });
};

// Обработчик подтверждения отправки в модальном окне
const handleConfirmSend = () => {
  showModalOnSend.value = false;
  // Вызов отправки
  if (sendFunction.value) {
    sendFunction.value();
  }
};

// Обработчик отмены отправки в модальном окне
const handleCancelSend = () => {
  showModalOnSend.value = false;
};

// Обработчик нажатия кнопки отправки
const handleSend = (callback) => {
  sendAnswersWrapper(callback);
};

// Изначально функция отправки — это sendAnswersWrapper
sendFunction.value = sendAnswersWrapper;
</script>

<style>
.container {
  display: flex;
  flex-direction: column;

  padding: 100px 250px 40px;
}

.vacancy__title {
  text-align: center;
}

.vacancy__questions-block {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  margin: 40px 0;
}

.vacancy__questions-title {
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;

  margin-bottom: 15px;
}

.vacancy__questions-list {
  display: flex;
  flex-direction: column;
  gap: 35px;
  width: 100%;
}

.list-item {
  display: inline-block;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

@media screen and (max-width: 1200px) {
  .container {
    padding: 100px 60px 60px;
  }
}

@media screen and (max-width: 800px) {
  .container {
    padding: 100px 30px 60px;
  }
}

@media screen and (max-width: 450px) {
  .container {
    padding-top: 150px;
  }
}

.vacancy__header {
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 10;

  display: flex;
  justify-content: space-between;
  width: 100%;

  background-color: var(--white);
  
  box-shadow: 0 3px 6px rgba(0,0,0,0.02), 0 3px 6px rgba(0,0,0,0.05);
}

.vacancy__auth {
  display: flex;
  align-items: center;
}

.vacancy__auth-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.vacancy__tg-logo {
  width: 30px;
  height: 30px;
}

.vacancy__auth-nick {
  font-weight: 600;
}

.vacancy__header-btn {
  margin: 15px 20px;
}

@media screen and (max-width: 450px) {
  .vacancy__header-btn {
    margin: 15px 5px;
  }
}

.vacancy__info-block {
  width: 100%;
}

.vacancy__name {
  font-weight: 400;
}

.vacancy__status--success {
  color: var(--apple);
}

.vacancy__status--warning {
  color: var(--ronchi);
}

.vacancy__description {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vacancy__send-btn {
  align-self: flex-end;
}
</style>