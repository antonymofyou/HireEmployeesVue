<template>
  <section class="vacancies">
    <h1 class="vacancies__title">Вакансии</h1>
    <button
      type="button"
      class="vacancies__add-vacancy-btn"
      title="Добавить вакансию"
      @click="showModal = true"
    ></button>
    <div class="vacancies__box-vacancies">
      <VacancyCard
        v-for="vacancy in vacancies"
        :key="vacancy.id"
        :vacancy="vacancy"
      />
    </div>
    <div v-if="vacancies.length === 0">На данный момент вакансий нет</div>
  </section>
  <Teleport to="body">
    <Modal :show="showModal">
      <template #header>
        <div class="modal__close">
          <button class="modal__close-btn" @click="showModal = false">
            &times;
          </button>
        </div>

        <h3>Создать новую вакансию?</h3>
      </template>

      <template #body>
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
          :model-value="0"
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
        <div
          :class="modalButtonActive ? 'modal__submit' : 'modal__submit-success'"
        >
          <ButtonSimple
            class="vacancy__add-create-btn"
            :submit-function="createVacancy"
          >
            <template v-slot:text>Создать</template>
          </ButtonSimple>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { MainRequestClass } from "../../../js/RootClasses.js";
import { isManager } from "@/js/AuthFunctions";
import VacancyCard from "./components/VacancyCard.vue";
import Modal from "@/components/Modal.vue";
import InputSimple from "@/components/InputSimple.vue";
import SelectSimple from "@/components/SelectSimple.vue";
import ButtonSimple from "@/components/ButtonSimple.vue";

//Флаг для модального окна
const showModal = ref(false);

//Флаг для кнопки submit модального окна
const modalButtonActive = ref(true);

// Данные вакансии: название, описание, статус публикации
const formData = ref({
  name: "",
  description: "",
  published: "",
});

// Опции для селектов
const options = [
  { text: "Нет", value: "0" },
  { text: "Да", value: "1" },
];

const router = useRouter();
const vacancies = ref([]);

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: "home" });

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

      // установка флага для кнопки "создать вакансию"
      modalButtonActive.value = false;

      //закрытие модального окна и сброс флага кнопки "создать"
      setTimeout(() => {
        showModal.value = false;
        modalButtonActive.value = true;
      }, 3000);

      //получение нового списка вакансий
      getAllVacanciesManager();
    },
    function (err) {
      //неуспешный результат
      alert(err);
    }
  );
}

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
  max-width: 40px;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--milk);
  transition: 0.3s;

  position: fixed;
  top: 60px;
  right: 50px;

  padding: 0;
  border: 0;
  cursor: pointer;
}

@media screen and (max-width: 426px) {
  .vacancies__add-vacancy-btn {
    top: 20px;
    right: 20px;
  }
}

.vacancies__add-vacancy-btn:hover {
  background-color: var(--white);
}

.vacancies__add-vacancy-btn::before {
  content: "";
  opacity: 0.6;
  background-image: url(./assets/icons/plus-icon.svg);
  background-size: 100% 100%;
  width: 25px;
  height: 25px;
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

.modal__submit,
.modal__submit-success {
  width: 100%;
  display: flex;
  justify-content: center;
}

.modal__submit-success {
  >>> .submit__button {
    display: none;
  }
}

.vacancy__add-create-btn {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
