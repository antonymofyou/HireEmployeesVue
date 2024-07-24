<template>
  <section class="candidates">
    <div class="candidates__title">
      <RouterLink :to="{ name: 'vacanciesList' }">
        <TopSquareButton
          class="candidates__back-btn"
          :icon="iconBack"
        />
      </RouterLink>
      <h1>Кандидаты вакансии</h1>
    </div>

    <div class="candidates__filter">
      <div v-if="!vacancyId">Выберите вакансию:</div>
      <div class="candidates__filter-title">
        <div v-if="vacancyId && dataFetched">Вакансия:</div>
        <SelectMain
          v-if="dataFetched"
          v-model="vacancyId"
          :options="vacanciesIds"
          @update:modelValue="updateVacancyId"
        />
      </div>
      <div class="candidates__filter-title">
        <div v-if="vacancyId && dataFetched">Статус:</div>
        <SelectMain
          v-if="vacancyId !== '' && dataFetched"
          v-model="status"
          :options="candidateStatus"
          @update:modelValue="updateStatus"
        />
      </div>
    </div>
    <div
    class="status_main"
    >
      <StatusMain
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
      <!-- Отображение прелоадера  -->
      <SpinnerMain v-if="isLoading" style="width: 50px" />
      <span v-else-if="vacancyId && candidates.length === 0"
        >Кандидатов пока нет</span
      >
      <CandidateCard
        v-if="vacancyId && !isLoading"
        v-for="candidate in candidates"
        :key="candidate.candidateId"
        :candidate="candidate"
        :vacancy-id="vacancyId"
        :status="status"
        :respond="candidate.otklikId"
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
import { MainRequestClass } from '@/js/RootClasses.js';
import { CandidatesGetCandidatesByVacancyId, VacanciesGetVacancyStatuses } from './js/CandidatesClasses.js';
import { StorageVacanciesPageActions } from './js/StorageClasses.js';
import CandidateCard from './components/CandidateCard.vue';
import ErrorNotification from '@/components/ErrorNotification.vue';
import SelectMain from '@/components/SelectMain.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';
import iconBack from '@/assets/icons/back.svg';
import StatusMain from '@/components/StatusMain.vue';

const router = useRouter();
const route = useRoute();

//Проверка авторизации пользователя
if (!isManager()) router.push({ name: 'managerAuth' });

// Начальные значения рефов (т.к. используются не один раз)
const initialStatusValue = 'New';

//Ref-переменные
const vacanciesIds = ref([]); // список id вакансий
const candidates = ref([]); // список кандидатов
const vacancyId = ref(''); // ID вакансии
const status = ref(initialStatusValue); // Статус кандидата
const candidateStatus = ref([{ name: 'Все', id: 'Все', color: 'gray' }, {name:'New', id: 'New', color: 'gray', count: 0}]); // Статусы кандидатов

//Флаги загрузки данных
const dataFetched = ref(false);
const isLoading = ref(false);

// Отображение ошибки
const errorMessage = ref('');

// Получение из роута параметров, если есть query
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
          name: `${vacancy.name}(id:${vacancy.id})`,
          id: vacancy.id,
        });
      });

      // Установление флага загрузки данных
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
  let requestClass = new CandidatesGetCandidatesByVacancyId();
  requestClass.vacancyId = vacancyId.value;
  requestClass.status = status.value === 'Все' ? '' : status.value;

  // Установление флага прелоадера
  isLoading.value = true;

  //Получение списка кандидатов
  if (vacancyId.value) {
    requestClass.request(
      '/candidates/get_candidates_by_vacancy_id.php',
      'manager',
      function (response) {
        //успешный результат
        candidates.value = response.candidates;
        isLoading.value = false;
      },
      function (err) {
        //неуспешный результат
        errorMessage.value = err;
        isLoading.value = false;
      }
    );
  }
}

// Получение статусов кандидатов к вакансии
function getVacancyStatuses() {
  let requestClass = new VacanciesGetVacancyStatuses();
  requestClass.vacancyId = vacancyId.value;
  requestClass.withTransfers = '0';
  requestClass.withCountOtklikov = "1"

  //Получение статусов
  if (vacancyId.value) {
    requestClass.request(
      '/vacancies/get_vacancy_statuses.php',
      'manager',
      function (response) {
        //успешный результат
        candidateStatus.value = [{ name: 'Все', id: 'Все', color: 'gray', count: 0}];
        response.statuses.map((status) => {
          let count = isNaN((status.countOtklikov)) ? 0 : (status.countOtklikov);
          candidateStatus.value.push({
            name: status.statusName,
            id: status.statusName,
            color: status.statusColor,
            count: count
          });
          candidateStatus.value[0].count = response.statuses.reduce((sum, status) => { //Считывает кол-во всех заявок 
            count = isNaN(Number(status.countOtklikov)) ? 0 : Number(status.countOtklikov);
            return sum + count;
          }, 0);
        });
      },
      function (err) {
        //неуспешный результат
        errorMessage.value = err;
      }
    );
  }
}

// Получение текущего статуса из localStorage
function getCurrentStatusFromLocalStorage() {
  // Достаём статус текущей вакансии из localStorage
  const currentVacancyStatus = StorageVacanciesPageActions.getVacancyStatus(vacancyId.value);
  if (currentVacancyStatus) status.value = currentVacancyStatus;
  else {
    // Т.к. статус не был найден в localStorage - то не допускаем того,
    // чтобы у нас остался висеть статус от предыдущей вакансии
    status.value = initialStatusValue;
  }
}

//Обработчик смены query параметра при смене id
const updateVacancyId = () => {
  router.push({
    query: { ...route.query, vacancyId: vacancyId.value },
  });
};

//Обработчик смены query параметра при смене id
const updateStatus = () => {
  StorageVacanciesPageActions.updateVacancyStatus(vacancyId.value, status.value);
};

//Получение списка кандидатов при загрузке страницы
onMounted(() => {
  getAllVacanciesManager();
  getCurrentStatusFromLocalStorage();
  if (route.query.vacancyId) {
    getAllCandidatesManager();
    getVacancyStatuses();
  }
});

//Получение списка кандидатов и статусов при обновлении query параметров
watch(
  () => route.query.vacancyId,
  () => {
    getVacancyStatuses();
    getAllCandidatesManager();
    getCurrentStatusFromLocalStorage();
  }
);

//Получение списка кандидатов при обновлении query status
watch(
  status,
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
  padding-bottom: 80px;
}

.candidates__title {
  width: 100%;
  text-align: center;
}

.candidates__filter {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.candidates__filter-title {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.candidates__description {
  text-align: center;
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
  max-width: 95%;
  :nth-child(n) {
    max-width: 700px;
  }
}

.candidates__back-btn {
  position: fixed;
  top: 20px;
}

@media screen and (max-width: 350px) {
  .candidates__title {
    h1 {
      margin-top: 30px;
    }
  }
}

@media screen and (max-width: 450px) {
  .candidates__filter {
    gap: 15px;
  }
}
.status_main{
  margin-top: 25px;
  display: flex;

}

</style>
