<template>
  <section class="candidates">
    <h1 class="candidates__title">Лист кандидатов</h1>
    <InputSimple
      v-model="vacancyId"
      id="vacancyId"
      labelName="ID вакансии"
      inputType="input"
      @keydown.enter.self="getAllCandidatesManager"
    />
    <div v-if="!candidates">Вакансия не найдена</div>
    <div v-else>Всего кандидатов: {{ candidates.length }}</div>

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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { isManager } from "@/js/AuthFunctions";
import { MainRequestClass } from "@/js/RootClasses";
import InputSimple from "@/components/InputSimple.vue";
import CandidateCard from "./components/CandidateCard.vue";

const router = useRouter();

// Ref-переменные
const candidates = ref([]); // список кандидатов
const vacancyId = ref(""); // ID вакансии

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: "home" });

// получение списка кандидатов по id вакансии
function getAllCandidatesManager() {
  class CandidatesGetCandidatesByVacancyId extends MainRequestClass {
    vacancyId = vacancyId.value; // ID вакансии, отклики для которой нужно получить
  }
  let requestClass = new CandidatesGetCandidatesByVacancyId();

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

//Получение списка кандидатов при загрузке страницы
onMounted(() => {
  getAllCandidatesManager();
});
</script>

<style scoped>
.candidates {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  padding-bottom: 80px;
}
</style>
