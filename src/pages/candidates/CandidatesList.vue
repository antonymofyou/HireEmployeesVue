<template>
  <section class="candidates">
    <h1 class="candidates__title">Лист кандидатов</h1>
    <SelectSimple
      labelName="ID вакансии"
      id="vacancyId"
      v-model="vacancyId"
      :options="vacanciesIds"
      @update:modelValue="updateVacancyId"
    />

    <div>
      <span v-if="vacancyId === ''">Вакансия не выбрана</span>
      <span v-else><b>Вакансия:</b></span>
      {{ vacanciesIds.find((item) => item.value === vacancyId)?.name }}
    </div>

    <SelectSimple
      v-if="vacancyId !== ''"
      labelName="Статус кандидата"
      id="candidateStatus"
      v-model="status"
      :options="candidateStatus"
      :model-value="candidateStatus[0].value"
      @update:modelValue=""
    />

    <div>
      <span v-if="candidates.length === 0 && vacancyId !== ''"
        >Кандидататов пока нет</span
      >
      <span v-if="candidates.length !== 0"
        >Всего кандидатов:
        {{ filterCandidates(candidates, status).length }}</span
      >
    </div>

    <div class="candidates__box-candidates">
      <CandidateCard
        v-for="candidate in filterCandidates(candidates, status)"
        :key="candidate.candidateId"
        :candidate="candidate"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isManager } from '@/js/AuthFunctions';
import { MainRequestClass } from '@/js/RootClasses';
import CandidateCard from './components/CandidateCard.vue';
import SelectSimple from '@/components/SelectSimple.vue';

const router = useRouter();
const route = useRoute();

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: 'home' });

// Ref-переменные
const vacanciesIds = ref([]); // список id вакансий
const candidates = ref([]); // список кандидатов
const vacancyId = ref(''); // ID вакансии
const status = ref('Все'); // Статус кандидата
const candidateStatus = ref([{ text: 'Все', value: 'Все' }]); // Статусы кандидатов

// Получение из роута id, если есть query параметр
if (route.query.vacancyId) {
  vacancyId.value = route.query.vacancyId;
}

//Получение списка id вакансий при загрузке страницы
function getAllVacanciesManager() {
  let requestClass = new MainRequestClass();

  requestClass.request(
    '/vacancies/get_all_vacancies.php',
    'manager',
    function (response) {
      //успешный результат

      //Заполнение массива id и названия вакансий
      response.vacancies.map((vacancy) => {
        vacanciesIds.value.push({
          text: vacancy.id,
          value: vacancy.id,
          name: vacancy.name,
        });
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
  if (vacanciesIds.value.find((item) => item.value === vacancyId.value)) {
    requestClass.request(
      '/candidates/get_candidates_by_vacancy_id.php',
      'manager',
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

// Получение статусов кандидатов к вакансии
function getVacancyStatuses() {
  class VacanciesGetVacanciesStatuses extends MainRequestClass {
    vacancyId = vacancyId.value; // ID вакансии, для которой нужно получить доступные статусы
  }
  let requestClass = new VacanciesGetVacanciesStatuses();

  //Получение статусов
  if (
    vacanciesIds.value.find((item) => item.value === vacancyId.value) &&
    candidates.value.length === 0
  ) {
    requestClass.request(
      '/vacancies/get_vacancies_statuses.php',
      'manager',
      function (response) {
        //успешный результат
        candidateStatus.value = [{ text: 'Все', value: 'Все' }];
        response.statuses.map((status) => {
          candidateStatus.value.push({ text: status, value: status });
        });
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

//Фильтрация кандидатов по статусу
const filterCandidates = (array, status) => {
  if (status === 'Все') {
    return array;
  }
  return array.filter((candidate) => candidate.status === status);
};

//Получение списка кандидатов при загрузке страницы
onMounted(() => {
  getAllVacanciesManager();
  if (route.query.vacancyId) {
    getAllCandidatesManager();
    getVacancyStatuses();
  }
});

//Получение списка кандидатов при обновлении query параметра vacancyId
watch(
  () => route.query.vacancyId,
  () => {
    getAllCandidatesManager();
    getVacancyStatuses();
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
