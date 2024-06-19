<template>
  <div class="vacancy">
    <div class="vacancy__header">
      <h2>Вакансия</h2>
    </div>

    <p v-if="errorMessage" class="vacancy__error">
      {{ errorMessage }}
    </p>
    <div v-else class="vacancy__info">
      <p><b>ID: </b>{{ vacancyInfo.id }}</p>
      <p><b>Название: </b> {{ vacancyInfo.name }}</p>
      <div>
        <p><b>Описание: </b></p>
        <p class="vacancy__description" v-html="vacancyInfo.description"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { VacanciesGetAllVacancyById } from '../js/CommentsClasses';

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

onMounted(requestVacancyInfo);
</script>

<style scoped>
.vacancy__header {
  display: flex;
}

.vacancy__error {
  color: var(--error-color);
}

</style>
