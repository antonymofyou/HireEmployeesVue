<template>
  <!-- Отображение прелоадера  -->
   <div v-if="!isLoaded" class="vacancy-edit__loader">
    <SpinnerMain class="vacancy-edit__loader-spinner" />
   </div>
  <div class="content vacancy-edit" v-if="isLoaded">
    <RouterLink :to="{ name: 'vacanciesList' }">
      <TopSquareButton class="vacancy-edit__back-btn" :icon="iconBack" />
    </RouterLink>
    
    <section class="container">
      <h2 class="vacancy-edit__title">Редактирование вакансии</h2>

      <div class="vacancy-edit__main">
        <InputSimple
          v-model="formData.name"
          id="name"
          labelName="Название вакансии"
          inputType="input"
          :isLabelBold=true
          :isTextBold=true
        />

        <div class="vacancy-edit__select">
          <span class="vacancy-edit__select-label">Опубликована:</span>
          <SelectMain
            v-model="formData.published"
            :options="options"
          />
        </div>
      </div>


    <div class="vacancy-edit__link">
      <b>Ссылка на вакансию:</b>
      <div class="vacancy-edit__link-content">
        <a class="vacancy-edit__link-text" :href="vacancyLink" target="_blank">{{ vacancyLink }}</a>
        <ButtonIcon class="vacancy-edit__link-copy-btn" @click="copyToClipboard">
          <template #icon>
            <CopyIcon width="20px" height="20px" class="vacancy-edit__link-copy-icon" />
          </template>
        </ButtonIcon>
      </div>
      <p class="vacancy-edit__link-copy-message vacancy-edit__link-copy-message--success" v-if="isCopied">Ссылка скопирована!</p>
      <p class="vacancy-edit__link-copy-message vacancy-edit__link-copy-message--error" v-else-if="isCopiedError">Не удалось скопировать текст!</p>
    </div>


      <div class="vacancy-edit__description">
        <TextEditor
          v-model="formData.description"
          size="big"
          label="Описание вакансии:"
          id="0"
        />
      </div>

      <VacancyManagers :vacancyId />
      <VacancyStatus :vacancyId />

      <div class="vacancy-edit__questions-block">
        <h2 class="vacancy-edit__questions-title">Вопросы вакансии</h2>
        <transition-group name="list" tag="div" class="vacancy-edit__questions-list">
          <VacancyQuestion
            v-for="(question, index) in formData.questions"
            :labelName="`Вопрос №${index + 1}`"
            :key="question.id"
            :id="question.id"
            :text="question.question"
            :options="options"
            :isPublished="question.published"
            @updateText="updateQuestionText(index, $event)"
            @updateIsPublished="updateIsPublished(index, $event)"
            class="list-item"
            @updateShowModal="updateShowQuestionModal"
          />
        </transition-group>
        <Teleport to="body">
          <ModalConfirmation
            v-model:show="showModalOnRemoveQuestion"
            confirmText="Удалить"
            text="Вы уверены, что хотите удалить вопрос? Это действие нельзя отменить"
            confirmButtonColor="var(--cinnabar)"
            :requestObject="removeQuestionRequestObject"
          />
       </Teleport>
        <div class="vacancy-edit__questions-footer">
          <button
            class="vacancy-edit__add-btn"
            type="button"
            title="Добавить вопрос"
            @click="addQuestion"
            v-if="!questionLoad"
          >
             <PlusIcon class="vacancy-edit__add-btn-icon"/>
          </button>
          <div v-if="questionLoad" class="vacancy-edit__add-btn">
            <SpinnerMain class="vacancy-edit__loader-spinner"/>
          </div>
          <ButtonMain
            v-if="isAdmin()"
            buttonColor="var(--cinnabar)"
            type="button"
            @click="showModalOnRemoveVacancy = true"
          >
            <template v-slot:text>Удалить вакансию</template>
          </ButtonMain>

          <Teleport to="body">
            <ModalConfirmation
              v-model:show="showModalOnRemoveVacancy"
              confirmText="Удалить"
              text="Вы уверены, что хотите удалить вакансию? Это действие нельзя отменить"
              confirmButtonColor="var(--cinnabar)"
              :requestObject="removeVacancyRequestObject"
            />
          </Teleport>
        </div>
        <div class="vacancy-edit__error-add-questions">
          {{ errorMessageQuestion }}
        </div>
      </div>

      <ButtonMain
        class="vacancy-edit__save-btn"
        @click="saveChanges"
        :success="successSave"
        :message="successMessage"
        :align="'end'"
        :isActive="saveLoad"
      >
        <template v-slot:text>Сохранить</template>
        <template v-slot:icon><SaveIcon width="20px" height="20px"class="vacancy-edit__icon-button"/></template>
      </ButtonMain>

    </section>
  </div>

  <Teleport to="body">
    <!-- Вывод сообщения о ошибке -->
    <ErrorNotification v-if="errorMessage" :message="errorMessage" />
  </Teleport>

</template>

<script setup>

import InputSimple from '@/components/InputSimple.vue';
import SelectMain from '@/components/SelectMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';
import iconBack from '@/assets/icons/back.svg';
import VacancyQuestion from './components/VacancyQuestion.vue';
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { isAdmin, isManager } from '@/js/AuthFunctions';
import { VacanciesGetAllVacancyById, 
  VacanciesQuestionsCreateVacancyQuestion,
  VacanciesQuestionsDeleteVacancyQuestion,
  VacanciesUpdateVacancy
} from './js/ApiClassesVacancyEdit.js';
import { MainRequestClass } from "@/js/RootClasses";
import ButtonMain from "@/components/ButtonMain.vue";
import ModalConfirmation from "@/components/ModalConfirmation.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import TextEditor from "@/components/TextEditor.vue";
import SpinnerMain from "@/components/SpinnerMain.vue";
import SaveIcon from '@/assets/icons/save.svg?component';
import PlusIcon from '@/assets/icons/add.svg?component';
import VacancyStatus from './components/VacancyStatus/VacancyStatus.vue';
import VacancyManagers from './components/VacancyManagers/VacancyManagers.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import CopyIcon from '@/assets/icons/copy.svg?component';

const route = useRoute();
const router = useRouter();

// Получение из роута id текущей вакансии
const vacancyId = ref(route.params.id);

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: 'home' });

// Индикатор загрузки компонента
const isLoaded = ref(false);

// Опции для селектов
const options = [
  { name: 'Нет', id: '0', color: 'var(--cinnabar)' },
  { name: 'Да', id: '1', color: 'var(--apple)' },
];

// Данные вакансии: название, описание, статус публикации, массив вопросов
const formData = ref({
  name: '',
  description: '',
  published: '',
  questions: [],
});

// Показ модального окна при удалении вакансии
const showModalOnRemoveVacancy = ref(false);
// Показ модального окна при удалении вопроса 
const showModalOnRemoveQuestion = ref(false);

// Отображение ошибки
const errorMessage = ref('');
const errorMessageQuestion = ref(''); // текст ошибки при добавлении вопроса

const successSave = ref(''); // при значении 1 делает текст успешного сохранения зеленым
const successMessage = ref(''); // текст успешного сохранения

// индикаторы загрузок для кнопок
const questionLoad = ref(false); // true когда идет добавление вопроса
const saveLoad = ref(false); // true когда идет сохранение

//Заполняем formData данными с сервера
onMounted(() => {
  try {
    getVacancyDataManager((vacResp) => {
      const { vacancy, questions } = vacResp;

      formData.value = {
        name: vacancy.name,
        published: vacancy.published,
        description: vacancy.description,
        questions: questions,
      };

      // Загрузка завершена
      isLoaded.value = true;
    });
  } catch (err) {
    errorMessage.value = err;
  }
});

// Скрытие сообщения о удачном сохранении, при изменении данных
watch(formData, () => {
  successMessage.value = '';
}, {deep: true});

// Обновление текста вопроса
const updateQuestionText = (index, value) => {
  formData.value.questions[index].question = value;
};


// Обновление статуса публикации вопроса
const updateIsPublished = (index, value) => {
  formData.value.questions[index].published = value;
};


const updateShowQuestionModal = (id) => {
  removeQuestionRequestObject.dataArg = id;
  showModalOnRemoveQuestion.value = !showModalOnRemoveQuestion.value;
}


// Работа с API

// Получение данных по текущей вакансии с сервера
const getVacancyDataManager = (callback) => {
  let requestClass = new VacanciesGetAllVacancyById();
  requestClass.vacancyId = vacancyId.value;

  requestClass.request(
    '/vacancies/get_all_vacancy_by_id.php',
    'manager', 
    function (response) { // успешный результат
      callback(response); 
    },
    function (err) { // неуспешный результат
      errorMessage.value = err;
    }
  );
};

// Добавление нового вопроса на сервер
const addQuestionToServer = (callback) => {
  questionLoad.value = true;
  let requestClass = new VacanciesQuestionsCreateVacancyQuestion();
  requestClass.vacancyId = vacancyId.value;

  requestClass.request(
    '/vacancies/questions/create_vacancy_question.php',
    'manager', 
    function (response) { // успешный результат
      callback(response);
      questionLoad.value = false;
      errorMessageQuestion.value = '';
    },
    function (err) { // неуспешный результат
      errorMessageQuestion.value = err;
      questionLoad.value = false;
    }
  );
  
};

// Вызов добавления вопроса и обновление formData
const addQuestion = () => {
  addQuestionToServer(({ question }) => {
    formData.value.questions.push(question);
  });
};

// Удаление вопроса с сервера (по передаваемому id)
const removeQuestionFromServer = (success, reject, id) => {
    let requestClass = new VacanciesQuestionsDeleteVacancyQuestion();
    requestClass.vacancyId = vacancyId.value;
    requestClass.questionId = id;

    requestClass.request(
      '/vacancies/questions/delete_vacancy_question.php',
      'manager',
      function (response) { // успешный результат
         success(response);
      },
      function (err) { // неуспешный результат
         reject(err);
      }
    );
};

// Объект для удаления вопроса, передающийся в модальное окно: функция удаления, id вопроса, коллбэк, выполняющийся после запроса
const removeQuestionRequestObject = reactive({
  fetch: removeQuestionFromServer,
  dataArg: '',
  callback: function() {
    formData.value.questions = formData.value.questions.filter((question) => question.id !== this.dataArg);
  },
});

const removeVacancyFromServer = (success, reject, id) => {
  let removeVacancy = new MainRequestClass();
  removeVacancy.vacancyId = id;
  removeVacancy.request(
    '/vacancies/delete_vacancy.php',
    'manager',
    function (response) { // успешный результат
      success(response);
    },
    function (err) { // неуспешный результат
      reject(err);
    }
  );
};

// Объект для удаления вакансии, передающийся в модальное окно: функция удаления, id вакансии, коллбэк, выполняющийся после запроса
const removeVacancyRequestObject = reactive({
  fetch: removeVacancyFromServer,
  dataArg: vacancyId.value,
  callback: function() {
    router.go(-1);
  },
});

// Формирование объекта с вопросами для отправки изменений на сервер
const questionsById = computed(() => {
  return formData.value.questions.reduce((acc, item) => {
    // Ключ - id вопроса, значение объект, состоящий из типа, текста и статуса публикации вопроса
    acc[item.id] = {
      type: item.type,
      question: item.question,
      published: item.published,
    };
    
    return acc;
  }, {})
});

// Сохранение изменений в вакансии
const saveChanges = (callback) => {
  saveLoad.value = true;
  let requestClass = new VacanciesUpdateVacancy();

  // данные вакансии: название, описание и статус публикации
  const vacancyData = {
    name: formData.value.name,
    description: formData.value.description,
    published: formData.value.published,
  }

  requestClass.vacancyId = vacancyId.value;
  requestClass.vacancy = vacancyData;
  requestClass.questions = questionsById.value;

  requestClass.request(
    '/vacancies/update_vacancy.php',
    'manager', 
    function (response) {
      //callback(response);// успешный результат
      successMessage.value = 'Данные успешно сохранены!';
      successSave.value = '1';
      saveLoad.value = false;
    },
    function (err) {// неуспешный результат
      successSave.value = '0';
      successMessage.value = err;
      saveLoad.value = false;
    }
  );
};

// Ссылка на вакансию
const vacancyLink = computed(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/vac/${vacancyId.value}`;
});

// Состояние копирования
const isCopied = ref(false);
// Состояние ошибки при копировании
const isCopiedError = ref(false);

// Копирование ссылки в буфер обмена
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(vacancyLink.value);
    isCopied.value = true;
    // Скрытие сообщения через 2 секунды
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    isCopiedError.value = true;
  }
}
</script>

<style scoped>
.content {
  margin-top: 60px;
}

.container {
  margin: 0 auto;
  width: 100%;
  max-width: 925px;
}

.vacancy-edit__title {
  margin-bottom: 40px;
  text-align: center;
}

.vacancy-edit__main {
  width: 100%;
}

.vacancy-edit__select {
  display: flex;
  align-items: baseline;
  gap: 10px;

  margin-top: 15px;
}

.vacancy-edit__select-label {
  font-weight: 600;
}

.vacancy-edit__description {
  margin-top: 40px;
  width: 100%;
}

.vacancy-edit__description-label {
  margin-bottom: 10px;
  font-weight: 600;
}

.vacancy-edit__questions-block {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  margin: 40px 0;
}

.vacancy-edit__questions-title {
  margin-bottom: 40px;
  text-align: center;
}

.vacancy-edit__questions-list {
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 100%;
}

.vacancy-edit__questions-footer {
  margin-top: 20px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.vacancy-edit__error-add-questions {
  color: var(--error-color);
}

.vacancy-edit__add-btn {
  padding: 0;

  cursor: pointer;

  text-align: center;

  transition: 0.2s ease transform;
  border: 0;
  background-color: transparent;
  margin-left: 45%;
}


.vacancy-edit__add-btn-icon {
  width: 45px;
  height: 45px;
}

.vacancy-edit__icon-button {
  fill: var(--white);
}

.vacancy-edit__add-btn:hover {
  transform: scale(1.15);
}

.list-item {
  display: inline-block;
  margin-right: 10px;
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

.vacancy-edit__save-btn {
  position: fixed;
  top: 20px;
  right: 30px;
  z-index: 10;
}

.vacancy-edit__back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
}

.vacancy-edit__loader {
  margin-top: 100px;
  text-align: center;
}

.vacancy-edit__loader-spinner {
  width: 50px;
}

.vacancy-edit__link {
  width: max-content;

  margin-top: 40px;
}

.vacancy-edit__link-content {
  display: flex;
  align-items: center;

  margin-top: 10px;
}

.vacancy-edit__link-text {
  font-weight: 500;

  color: var(--cornflower-blue);
  text-decoration: none;

  transition: all 0.2s ease;
}

.vacancy-edit__link-text:hover {
  opacity: 0.65;
}

.vacancy-edit__link-copy-btn {
  padding: 0;
  padding-left: 10px;
}

.vacancy-edit__link-copy-icon {
  color: var(--tundora);

  transition: all 0.2s ease;
}

.vacancy-edit__link-copy-icon:hover {
  opacity: 0.6;
}

.vacancy-edit__link-copy-message {
  font-size: 12px;

  margin: 0;
  margin-top: 5px;

  text-align: right;
}

.vacancy-edit__link-copy-message--success {
  color: var(--apple);
}

.vacancy-edit__link-copy-message--error {
  color: var(--cinnabar);
}
</style>