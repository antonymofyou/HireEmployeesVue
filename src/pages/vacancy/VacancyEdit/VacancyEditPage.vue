<template>
  <!-- Отображение прелоадера  -->
   <div v-if="!isLoaded" style="text-align: center; margin-top: 100px;">
    <SpinnerMain style="width: 50px" />
   </div>
  <main class="content vacancy-edit" v-if="isLoaded">
    <TopSquareButton
      class="vacancy-edit__back-btn"
      :icon="iconBack"
      @click="$router.push({ name: 'vacanciesList' })"
    >

    </TopSquareButton>
    
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

      <div class="vacancy-edit__description">
        <TextEditor
          v-model="formData.description"
          size="big"
          label="Описание вакансии:"
          id="0"
        />
      </div>

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
            :show="showModalOnRemoveQuestion"
            confirmText="Удалить"
            text="Вы уверены, что хотите удалить вопрос? Это действие нельзя отменить"
            confirmButtonColor="var(--cinnabar)"
            @confirm="removeQuestion(idCardQuestion)"
            @cancel="showModalOnRemoveQuestion = !showModalOnRemoveQuestion"
            :loading="removeQuestionLoad"
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
          <div v-if="questionLoad" style="text-align: center;" class="vacancy-edit__add-btn">
            <SpinnerMain style="width: 50px" />
          </div>
          <ButtonMain
            buttonColor="var(--cinnabar)"
            type="button"
            @click="showModalOnRemoveVacancy = true"
          >
            <template v-slot:text>Удалить вакансию</template>
          </ButtonMain>

          <Teleport to="body">
            <ModalConfirmation
              :show="showModalOnRemoveVacancy"
              confirmText="Удалить"
              text="Вы уверены, что хотите удалить вакансию? Это действие нельзя отменить"
              confirmButtonColor="var(--cinnabar)"
              :loading="removeLoad"
              @confirm="handleConfirmRemoveVacancy"
              @cancel="handleCancelRemoveVacancy"
            />
          </Teleport>
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
        <template v-slot:icon><SaveIcon class="vacancy-edit__icon-button"/></template>
      </ButtonMain>

    </section>
  </main>

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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { isManager } from '@/js/AuthFunctions';
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
import SaveIcon from '@/assets/icons/save-black.svg?component';
import PlusIcon from '@/assets/icons/add.svg?component';

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

// Отображение ошибки
const errorMessage = ref('');

const successSave = ref('');
const successMessage = ref('');

// индикаторы загрузок для кнопок
const questionLoad = ref(false);
const saveLoad = ref(false);
const removeLoad = ref(false);
const removeQuestionLoad = ref(false);
const showModalOnRemoveQuestion = ref(false);
// ID последней карточки с вопросом, у которой была нажата мусорка
const idCardQuestion = ref(0);
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

// Отмена удаления вакансии
const handleCancelRemoveVacancy = () => {
  showModalOnRemoveVacancy.value = false;
};

const updateShowQuestionModal = (id) => {
  idCardQuestion.value = id;
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
    },
    function (err) { // неуспешный результат
      errorMessage.value = err;
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
const removeQuestionFromServer = (callback, id) => {
  removeQuestionLoad.value = true;
  let requestClass = new VacanciesQuestionsDeleteVacancyQuestion();
  requestClass.vacancyId = vacancyId.value;
  requestClass.questionId = id;

  requestClass.request(
    '/vacancies/questions/delete_vacancy_question.php',
    'manager', 
    function (response) { // успешный результат
      callback(response);
      removeQuestionLoad.value = false;
      showModalOnRemoveQuestion.value = false;
    },
    function (err) { // неуспешный результат
      errorMessage.value = err;
    }
  );
};

// Вызов удаления вопроса и обновление formData
const removeQuestion = (id) => {
  removeQuestionFromServer(() => {
    formData.value.questions = formData.value.questions.filter((question) => question.id !== id);
  }, id);
};

// Удаление вакансии
function handleConfirmRemoveVacancy(callback)  {
  removeLoad.value = true;
  let removeVacancy = new MainRequestClass();
  removeVacancy.vacancyId = vacancyId.value;
  removeVacancy.request(
    '/vacancies/delete_vacancy.php',
    'manager',
    function (response) {
      removeLoad.value = false;
      router.go(-1);
    },
    function (err) {
      errorMessage.value = err;
    }
  );
};

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
      errorMessage.value = err;
    }
  );
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 250px 0;
}

.vacancy-edit__title {
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
  margin-top: 50px;
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
  font-size: 25px;
  line-height: 32px;
  font-weight: 600;

  margin: 0;
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
}

.vacancy-edit__add-btn {
  padding: 0;

  cursor: pointer;

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
  left: 30px;
}

@media screen and (max-width: 1200px) {
  .container {
    padding: 60px 60px;
  }
}

@media screen and (max-width: 800px) {
  .container {
    padding: 30px 30px;
  }
}
</style>