<template>
  <section class="vacancies">
    <h1 class="vacancies__title">Вакансии</h1>
    <div v-if="vacancies.length>0" class="vacancies__box-vacancies">
      <VacancyCard v-for="vacancy in vacancies" :key="vacancy.id" :vacancy="vacancy" />
    </div>
    <div v-else>На данный момент вакансий нет</div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router";
import { MainRequestClass } from "../../../js/RootClasses.js";
import { configData } from "@/js/configData";
import VacancyCard from "./components/VacancyCard.vue"

const router = useRouter();
const vacancies = ref([]);

if ((localStorage.getItem(configData.MANAGER_TOK_NAME) === null)
    && (localStorage.getItem(configData.MANAGER_DEVICE_NAME) === null))
        router.push({name:'home'})

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
  gap: 20px;
  margin-top: 40px;
  width: 100%;
}
</style>
