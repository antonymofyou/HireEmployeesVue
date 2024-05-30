<template>
  <section class="vacancies">
    <h1 class="vacancies__title">Вакансии</h1>
    <TopSquareButton
      class="vacancies__add-vacancy-btn"
      @click="showModal = true"
      :icon="plusIcon"
    >
    </TopSquareButton>
    <div class="vacancies__box-vacancies">
      <VacancyCard
        v-for="vacancy in vacancies"
        :key="vacancy.id"
        :vacancy="vacancy"
        :ref="`vacancy_${vacancy.id}`"
      />
    </div>
    <div v-if="vacancies.length === 0">На данный момент вакансий нет</div>
  </section>

  <!-- Встраивание компонента Modal в DOM -->
  <Teleport to="body">
    <!-- Открытие модального окна добавления вакансии -->
    <Modal :show="showModal" v-if="!modalSuccess">
      <template #header>
        <div class="modal__close">
          <button class="modal__close-btn" @click="showModal = false">
            &times;
          </button>
        </div>

        <h3>Создать новую вакансию?</h3>
      </template>

      <template #body v-if="!modalSuccess">
        <InputSimple
          v-model="formData.name"
          id="name"
          labelName="Название вакансии"
          inputType="input"
          :isLabelBold="true"
          :isTextBold="true"
        />

        <SelectSimple
          v-model="formData.published"
          id="isPublished"
          labelName="Опубликована"
          :options="options"
          :model-value="options[0].value"
        />

        <InputSimple
          v-model="formData.description"
          id="description"
          labelName="Описание вакансии"
          inputType="textarea"
          :isLabelBold="true"
          size="big"
        />
      </template>
      <template #footer-control-buttons>
        <div class="modal__submit">
          <ButtonSimple
            class="vacancy__add-create-btn"
            :submit-function="createVacancy"
          >
            <template v-slot:text>Создать</template>
          </ButtonSimple>
        </div>
      </template>
    </Modal>

    <!-- Открытие модального окна успешного создания вакансии -->
    <Modal :show="modalSuccess">
      <template #header>
        <h3>Вакансия создана!</h3>
      </template>
      <template #body>
        <div class="modal__success">
          <!-- Кнопка перехода к созданной вакансии и закрытия модального окна. Происходит обращение к глобальному объекту refs, который содержит ссылки на ref карточек vacancy_id. через $el(ключ DOM элемента).scrollIntoView происходит переход к созданной вакансии -->
          <ButtonSimple
            @click="
              modalSuccess = false;
              $refs[`vacancy_${createdVacancyId}`][0].$el.scrollIntoView({
                behavior: 'smooth',
              });
            "
          >
            <template v-slot:text>Закрыть</template>
          </ButtonSimple>

          <!-- Кнопка перехода к редактивроанию созданной вакансии -->
          <ButtonSimple
            @click="
              modalSuccess = false;
              $router.push(`/vacancy_edit/${createdVacancyId}`);
            "
          >
            <template v-slot:text>Редактировать</template>
          </ButtonSimple>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { MainRequestClass } from "@/js/RootClasses";
import { isManager } from "@/js/AuthFunctions";
import VacancyCard from "./components/VacancyCard.vue";
import plusIcon from "./assets/icons/plus-icon.svg";
import Modal from "@/components/Modal.vue";
import InputSimple from "@/components/InputSimple.vue";
import SelectSimple from "@/components/SelectSimple.vue";
import ButtonSimple from "@/components/ButtonSimple.vue";
import TopSquareButton from "@/components/TopSquareButton.vue";

const router = useRouter();

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: "home" });

// Вакансии
const vacancies = ref([]);

// Id созданной вакансии
const createdVacancyId = ref(null);

//Флаги для модального окна
const showModal = ref(false);
const modalSuccess = ref(false);

// Данные вакансии: название, описание, статус публикации
const formData = ref({
  name: "",
  description: "",
  published: "",
});

// Опции для селекта
const options = [
  { text: "Нет", value: "0" },
  { text: "Да", value: "1" },
];

// получение всех вакансий
function getAllVacanciesManager() {
  let requestClass = new MainRequestClass();

  requestClass.request(
    "/vacancies/get_all_vacancies.php",
    "manager",
    function (response) {
      //успешный результат
      vacancies.value = response.vacancies;
    },
    function (err) {
      //неуспешный результат
      alert(err);
    }
  );
}

//Создание новой вакансии
function createVacancy(callback) {
  class VacanciesCreateVacancy extends MainRequestClass {
    name = formData.value.name; // название вакансии (не обяз.)
    description = formData.value.description; // описание вакансии (не обяз.)
    published = formData.value.published; // статус публикации у вакансии (0/1) (не обяз., по умолчанию 0)
  }

  let requestClass = new VacanciesCreateVacancy();

  requestClass.request(
    "/vacancies/create_vacancy.php",
    "manager",
    function (response) {
      //успешный результат
      callback(response);

      //получение Id созданной вакансии
      createdVacancyId.value = response.vacancy.id;

      //сброс формы
      formData.value.name = "";
      formData.value.description = "";
      formData.value.published = "";

      //закрытие модального окна создания и открытие модального окна успешного создания"
      showModal.value = false;
      modalSuccess.value = true;

      //получение нового списка вакансий
      getAllVacanciesManager();
    },
    function (err) {
      //неуспешный результат
      alert(err);
    }
  );
}

//Получение данных вакансии при загрузке страницы
onMounted(() => {
  getAllVacanciesManager();
});
</script>

<style scoped>
.vacancies {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  padding-bottom: 80px;
}

.vacancies__title {
  margin: 0;
  font-size: 35px;
  line-height: 42px;
  font-weight: 400;
}

.vacancies__box-vacancies {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min-content, 300px));
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
  width: 100%;
}

.vacancies__add-vacancy-btn {
  position: fixed;
  top: 60px;
  right: 50px;
}

@media screen and (max-width: 426px) {
  .vacancies__add-vacancy-btn {
    top: 20px;
    right: 20px;
  }
}

.modal__close {
  display: flex;
  justify-content: end;
}

.modal__close-btn {
  font-size: 30px;
  padding: 0;

  cursor: pointer;
  transition: 0.5s ease all;

  border: none;
  background: none;
}

.modal__close-btn:hover {
  filter: opacity(0.6);
}

.modal__submit {
  width: 100%;
  display: flex;
  justify-content: center;
}

.modal__success {
  display: flex;
  align-items: center;
  gap: 10px;
}
.vacancy__add-create-btn {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>