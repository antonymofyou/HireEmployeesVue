<template>
  <section class="candidates">
    <h1 class="candidates__title">Кандидаты вакансии</h1>

    <div class="candidates__filter">
      <span v-if="!vacancyId" class="candidates__filter-title"
        >Выберите вакансию:</span
      >
      <SelectMain
        v-if="dataFetched"
        v-model="vacancyId"
        :options="vacanciesIds"
        @update:modelValue="updateVacancyId"
      />

      <SelectMain
        v-if="vacancyId !== '' && dataFetched"
        v-model="status"
        :options="candidateStatus"
        @update:modelValue="updateStatus"
      />
    </div>

    <div class="candidates__description" v-if="vacancyId !== ''">
      <span>{{
        vacanciesIds.find((vacancy) => vacancy.id === vacancyId)?.name
      }}</span>
    </div>

    <div class="candidates__box-candidates">
      <CandidateCard
        v-for="candidate in filterCandidates(candidates, status)"
        :key="candidate.candidateId"
        :candidate="candidate"
      />
    </div>
    <!-- Встраивание элемента в DOM дерево -->
    <Teleport to="body">
      <!-- Вывод сообщения о ошибке -->
      <ErrorNotification v-if="errorMessage" :message="errorMessage" />
    </Teleport>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isManager } from '@/js/AuthFunctions';
import { MainRequestClass } from '@/js/RootClasses';
import CandidateCard from './components/CandidateCard.vue';
import ErrorNotification from '@/components/ErrorNotification.vue';
import SelectMain from '@/components/SelectMain.vue';

const router = useRouter();
const route = useRoute();

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: 'home' });

//Ref-переменные
const vacanciesIds = ref([]); // список id вакансий
const candidates = ref([]); // список кандидатов
const vacancyId = ref(''); // ID вакансии
const status = ref('Все'); // Статус кандидата
const candidateStatus = ref([{ name: 'Все', id: 'Все' }]); // Статусы кандидатов

//Флаг загрузки данных
const dataFetched = ref(false);

// Отображение ошибки
const errorMessage = ref('');

// Получение из роута параметров, если есть query
if (route.query.vacancyId) {
  vacancyId.value = route.query.vacancyId;
  if (route.query.status) {
    status.value = route.query.status;
  }
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
          name: `${vacancy.name}(id:${vacancy.id})`,
          id: vacancy.id,
        });
      });

      dataFetched.value = true;
    },
    function (err) {
      //неуспешный результат
      errorMessage.value = err;
    }
  );
}

//Получение списка кандидатов по id вакансии
function getAllCandidatesManager() {
  class CandidatesGetCandidatesByVacancyId extends MainRequestClass {
    vacancyId = vacancyId.value; // ID вакансии, отклики для которой нужно получить
  }
  let requestClass = new CandidatesGetCandidatesByVacancyId();

  //Получение списка кандидатов
  if (vacancyId) {
    requestClass.request(
      '/candidates/get_candidates_by_vacancy_id.php',
      'manager',
      function (response) {
        //успешный результат
        candidates.value = response.candidates;
      },
      function (err) {
        //неуспешный результат
        errorMessage.value = err;
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
  if (vacancyId) {
    requestClass.request(
      '/vacancies/get_vacancies_statuses.php',
      'manager',
      function (response) {
        //успешный результат
        candidateStatus.value = [{ name: 'Все', id: 'Все' }];
        response.statuses.map((status) => {
          candidateStatus.value.push({ name: status, id: status });
        });
      },
      function (err) {
        //неуспешный результат
        errorMessage.value = err;
      }
    );
  }
}

//Обработчик смены query параметра при смене id
const updateVacancyId = () => {
  router.push({
    query: { ...route.query, vacancyId: vacancyId.value, status: status.value },
  });
};
//Обработчик смены query параметра при смене id
const updateStatus = () => {
  router.push({ query: { ...route.query, status: status.value } });
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

.candidates__filter {
  display: flex;
  align-items: center;
  gap: 20px;
}

.candidates__description {
  margin-top: 30px;
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
