<template>
  <section class="vacancies">
    <h1 class="vacancies__title">Вакансии</h1>
    <div class="vacancies__box-vacancies">
      <button type="button" class="vacancies__add-vacancy-btn" title="Добавить вакансию"
        @click="showModal = true"></button>
      <VacancyCard v-for="vacancy in vacancies" :key="vacancy.id" :vacancy="vacancy" />
    </div>
    <div v-if="vacancies.length === 0">На данный момент вакансий нет</div>
  </section>
  <Teleport to="body">
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>Создать новую вакансию?</h3>
      </template>
      <template #footer-control-buttons>
        <CustomButton :button-color="modalButtonOkColor" :text-color="modalButtonOkTextColor" @click="createVacancy()">
          <template #text>
            Да
          </template>
        </CustomButton>
      </template>
      <template #close-button-text>
        Нет
      </template>
    </modal>
  </Teleport>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router";
import { MainRequestClass } from "../../../js/RootClasses.js";
import { configData } from "@/js/configData";
import { isManager } from "@/js/AuthFunctions";
import VacancyCard from "./components/VacancyCard.vue"
import Modal from '@/components/Modal.vue'
import CustomButton from "@/components/CustomButton.vue";

//Флаг для модального окна
const showModal = ref(false)
const router = useRouter();
const vacancies = ref([]);
//Переменные для цвета кнопки "Да" в модальном окне
const modalButtonOkColor = "var(--light-violet)"
const modalButtonOkTextColor = "var(--white)"

//Проверка авторизации пользователя
if (!isManager())
  router.push({ name: 'home' })

// получение всех вакансий
function getAllVacanciesManager() {
  let requestClass = new MainRequestClass();

  requestClass.request(
    '/vacancies/get_all_vacancies.php',
    'manager',
    function (response) {//успешный результат
      vacancies.value = response.vacancies;
    },
    function (err) {//неуспешный результат
      alert(err);
    }
  );
}

//Создание новой вакансии
function createVacancy() {
  class VacanciesCreateVacancy extends MainRequestClass {
    name = ''; // название вакансии (не обяз.)
    description = ''; // описание вакансии (не обяз.)
    published = ''; // статус публикации у вакансии (0/1) (не обяз., по умолчанию 0)
  }

  let requestClass = new VacanciesCreateVacancy();
  
  requestClass.request(
    '/vacancies/create_vacancy.php',
    'manager', 
    function (response){//успешный результат
      router.push({name:'create'})
    },
    function (err){//неуспешный результат
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
  max-width: 300px;
  width: 100%;
  height: 270px;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, .3);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--milk);
  transition: 0.3s;
  grid-column: 1 / 2;
  grid-row: 1 / 2;

  padding: 0;
  border: 0;
  cursor: pointer;
}

.vacancies__add-vacancy-btn:hover {
  background-color: var(--white)
}

.vacancies__add-vacancy-btn::before {
  content: '';
  opacity: .6;
  background-image: url(./assets/icons/plus-icon.svg);
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}
</style>
