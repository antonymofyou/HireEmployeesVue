<template>
  <section class="candidates">
    <h1 class="candidates__title">Лист кандидатов</h1>

    <div v-if="!vacancyId">Выберите вакансию</div>
    <div v-else>Всего кандидатов: {{ candidates.length }}</div>
    <SelectSimple
      labelName="ID вакансии"
      id="vacancyId"
      v-model="vacancyId"
      :options="vacanciesIds"
      @update:modelValue="updateVacancyId"
    />

    <div class="candidates__box-candidates">
      <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.candidateId"
        :candidate="candidate"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isManager } from "@/js/AuthFunctions";
import { MainRequestClass } from "@/js/RootClasses";
import CandidateCard from "./components/CandidateCard.vue";
import SelectSimple from "@/components/SelectSimple.vue";

const router = useRouter();
const route = useRoute();

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: "home" });

// Ref-переменные
const vacanciesIds = ref([]); // список id вакансий
const candidates = ref([]); // список кандидатов
const vacancyId = ref(""); // ID вакансии

// Получение из роута id, если есть query параметр
if (route.query.vacancyId) {
  vacancyId.value = route.query.vacancyId;
}

//Получение списка id вакансий при загрузке страницы
function getAllVacanciesManager() {
  let requestClass = new MainRequestClass();

  requestClass.request(
    "/vacancies/get_all_vacancies.php",
    "manager",
    function (response) {
      //успешный результат

      //Заполнение массива id вакансий
      response.vacancies.map((vacancy) => {
        vacanciesIds.value.push({ text: vacancy.id, value: vacancy.id });
      });
    },
    function (err) {
      //неуспешный результат
      alert(err);
    }
  );
}

// получение списка кандидатов по id вакансии
function getAllCandidatesManager() {
  class CandidatesGetCandidatesByVacancyId extends MainRequestClass {
    vacancyId = vacancyId.value; // ID вакансии, отклики для которой нужно получить
  }
  let requestClass = new CandidatesGetCandidatesByVacancyId();

  //Получение списка кандидатов
  if (vacancyId.value) {
    requestClass.request(
      "/candidates/get_candidates_by_vacancy_id.php",
      "manager",
      function (response) {
        //успешный результат
        candidates.value = response.candidates;
      },
      function (err) {
        //неуспешный результат
        alert(err);
      }
    );
  }
}

//Обработчик смены query параметра при смене id
const updateVacancyId = () => {
  router.push({ query: { vacancyId: vacancyId.value } });
};

//Получение списка кандидатов при загрузке страницы
onMounted(() => {
  getAllVacanciesManager();
  getAllCandidatesManager();
});

//Получение списка кандидатов при обновлении query параметра
watch(
  () => route.query.vacancyId,
  () => {
    getAllCandidatesManager();
  }
);
</script>

<style scoped>
.candidates {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  padding-bottom: 80px;
}

.candidates__box-candidates {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
  width: 100%;
}
</style>
