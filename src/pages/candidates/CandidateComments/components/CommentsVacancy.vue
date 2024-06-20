<template>
  <div class="vacancy">
    <div class="vacancy__header">
      <h2>Вакансия {{ vacancyInfo.name }} (id:{{ vacancyInfo.id }})</h2>
      <EmptyButton @click="showVacancy"
        ><template #icon>
          <ArrowIcon
            :class="[
              'vacancy__header-arrowicon',
              { 'vacancy__header-arrowicon--active': show },
            ]"
          /> </template
      ></EmptyButton>
    </div>
    <p v-if="errorMessage" class="vacancy__error">
      {{ errorMessage }}
    </p>
    <!-- Открытие/сокрытие вакансии -->
    <Transition v-if="show">
      <div class="vacancy__info">
        <div>
          <p><b>Описание: </b></p>
          <p class="vacancy__description" v-html="vacancyInfo.description"></p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { VacanciesGetAllVacancyById } from '../js/CommentsClasses';
import ArrowIcon from '@/assets/icons/arrow-down.svg?component';
import EmptyButton from '@/components/EmptyButton.vue';

const props = defineProps({
  // ID вакансии
  vacancyId: {
    type: String,
    required: true,
  },
});

// Объект информации по вакансии
const vacancyInfo = ref({});
// Сообщение об ошибке
const errorMessage = ref('');
// Флаг показа вакансии
const show = ref(false);

// Запрос данных по вакансии
const requestVacancyInfo = () => {
  const requestInstance = new VacanciesGetAllVacancyById();
  requestInstance.vacancyId = props.vacancyId;
  errorMessage.value = '';

  requestInstance.request(
    '/vacancies/get_all_vacancy_by_id.php',
    'manager',
    (response) => {
      vacancyInfo.value = response.vacancy;
    },
    (err) => (errorMessage.value = err)
  );
};

// Показать/скрыть вакансию
const showVacancy = () => {
  show.value = !show.value;
};

onMounted(requestVacancyInfo);
</script>

<style scoped>
.vacancy__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vacancy__info {
  * {
    margin: 10px 0;
  }
}

.vacancy__error {
  color: var(--error-color);
}

.vacancy__header-arrowicon {
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
}

.vacancy__header-arrowicon--active {
  transform: rotateX(180deg);
}
</style>
