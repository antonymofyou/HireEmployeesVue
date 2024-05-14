<script setup>
import InputComponent from '@/components/InputComponent.vue';
import SelectComponent from '@/components/SelectComponent.vue';
import VacancyQuestion from '@/components/VacancyQuestion.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { VacanciesGetAllVacancyById, 
  VacanciesQuestionsCreateVacancyQuestion,
  VacanciesQuestionsDeleteVacancyQuestion,
  VacanciesUpdateVacancy
} from '@/js/ApiClassesVacancyEdit';

// Индикатор загрузки компонента
const isLoaded = ref(false);

// Опции для селектов
const options = [
  { text: 'Нет', value: '0' },
  { text: 'Да', value: '1' },
];

// Статичный текст страницы
const staticText = {
  title: 'Редактирование вакансии',
  questionsTitle: 'Вопросы вакансии',
  save: 'Сохранить',
};

// Данные вакансии: название, описание, статус публикации, массив вопросов
const formData = ref({
  name: '',
  description: '',
  published: '',
  questions: [],
});

//Заполняем formData данными с сервера
onMounted(() => {
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
});

// Обновление текста вопроса
const updateQuestionText = (index, value) => {
  formData.value.questions[index].question = value;
};

// Обновление статуса публикации вопроса
const updateIsPublished = (index, value) => {
  formData.value.questions[index].published = value;
};

// Получение из роута id текущей вакансии
const route = useRoute();
const vacancyId = ref(route.params.id);

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
      alert(err);
    }
  );
};

// Добавление нового вопроса на сервер
const addQuestionToServer = (callback) => {
  let requestClass = new VacanciesQuestionsCreateVacancyQuestion();
  requestClass.vacancyId = vacancyId.value;

  requestClass.request(
    '/vacancies/questions/create_vacancy_question.php',
    'manager', 
    function (response) { // успешный результат
      callback(response);
    },
    function (err) { // неуспешный результат
      alert(err);
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
  let requestClass = new VacanciesQuestionsDeleteVacancyQuestion();
  requestClass.vacancyId = vacancyId.value;
  requestClass.questionId = id;

  requestClass.request(
    '/vacancies/questions/delete_vacancy_question.php',
    'manager', 
    function (response) { // успешный результат
      callback(response);
    },
    function (err) { // неуспешный результат
      alert(err);
    }
  );
};

// Вызов удаления вопроса и обновление formData
const removeQuestion = (id) => {
  removeQuestionFromServer(() => {
    formData.value.questions = formData.value.questions.filter((question) => question.id !== id);
  }, id);
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
      callback(response); // успешный результат
    },
    function (err) { // неуспешный результат
      alert(err);
    }
  );
};
</script>

<template>
  <main class="content vacancy-edit" v-if="isLoaded">
    <section class="container">
      <h2>{{ staticText.title }}</h2>

      <div class="vacancy-edit__main">
        <InputComponent
          v-model="formData.name"
          id="name"
          labelName="Название вакансии"
          inputType="input"
          :isLabelBold=true
          :isTextBold=true
        />

        <SelectComponent
          v-model="formData.published"
          id="isPublished"
          :options="options"
          labelName="Опубликована"
          class="vacancy-edit__is-published-select"
        />
      </div>

      <div class="vacancy-edit__description">
        <InputComponent
          v-model="formData.description"
          id="description"
          labelName="Описание вакансии"
          inputType="textarea"
          :isLabelBold=true
          size="big"
        />
      </div>


      <div class="vacancy-edit__questions-block">
        <h2 class="vacancy-edit__questions-title">{{ staticText.questionsTitle }}</h2>
        <transition-group name="list" tag="div" class="vacancy-edit__questions-list">
          <VacancyQuestion
            v-for="(question, index) in formData.questions"
            :labelName="`Вопрос №${index + 1} (id${question.id})`"
            :key="question.id"
            :id="question.id"
            :text="question.question"
            :options="options"
            :isPublished="question.published"
            @updateText="updateQuestionText(index, $event)"
            @updateIsPublished="updateIsPublished(index, $event)"
            :remove="removeQuestion"
            class="list-item"
          />
        </transition-group>
        <button
          class="vacancy-edit__add-btn"
          type="button"
          title="Добавить вопрос"
          @click="addQuestion()"
        ></button>
      </div>

      <SubmitButton class="vacancy-edit__save-btn" :submit-function="saveChanges">
        {{ staticText.save }}
      </SubmitButton>

    </section>
  </main>
</template>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 250px 0;
}

.vacancy-edit__main {
  width: 100%;
}

.vacancy-edit__is-published-select {
  margin-top: 15px;
}

.vacancy-edit__description {
  margin-top: 50px;
  width: 100%;
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
  gap: 35px;
  width: 100%;
}

.vacancy-edit__add-btn {
  background-image: url('@/assets/icons/add.svg');
  background-size: 100% 100%;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: 0.2s ease transform;
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
</style>