<template>
  <div class="vacancy">
    <div class="vacancy__header">
      <div class="vacancy__header-title">
        Вакансия&nbsp;
        <span class="vacancy__header-title-name"> {{ vacancyInfo.name }}</span>
        (id:{{ vacancyInfo.id }})
      </div>
      <ButtonIcon @click="showVacancy"
        ><template #icon>
          <ArrowIcon
            :class="[
              'vacancy__header-arrowicon',
              { 'vacancy__header-arrowicon--active': show },
            ]"
          /> </template
      ></ButtonIcon>
    </div>
    <div v-if="errorMessage" class="vacancy__error">
      {{ errorMessage }}
    </div>
    <!-- Открытие/сокрытие вакансии -->
    <Transition v-if="show">
      <div class="vacancy__info">
        <div><b>Описание: </b></div>
        <div
          class="vacancy__description"
          v-html="vacancyInfo.description"
        ></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { VacanciesGetAllVacancyById } from '../js/CommentsClasses';
import ArrowIcon from '@/assets/icons/arrow-down.svg?component';
import ButtonIcon from '@/components/ButtonIcon.vue';

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
.vacancy {
  font-size: 15px;
}

.vacancy__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.vacancy__header-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-weight: 600;
  overflow: hidden;
}

.vacancy__header-title-name {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  white-space: nowrap;
}

.vacancy__error {
  color: var(--error-color);
}

.vacancy__header-arrowicon {
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
}

@media screen and (max-width: 425px) {
  .vacancy__header-arrowicon {
    width: 25px;
    height: 25px;
  }
}

.vacancy__header-arrowicon--active {
  transform: rotateX(180deg);
}

.vacancy__description {
  word-break: break-all;
}
</style>
