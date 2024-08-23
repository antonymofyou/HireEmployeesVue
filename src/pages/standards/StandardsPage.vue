<template>
  <TheHeader />

  <section class="schedule-section">
    <h1 class="schedule-section__title">
      График работы сотрудника
    </h1>

    <TopSquareButton
      :icon="plusIcon"
      class="top-button"
      @click="handleAddButtonClick"
    />

    <div class="wrapper">
      <div class="wrapper__inner">
        <SpinnerMain
          v-if="isJobsRequestNow"
          class="spinner-loader"
        />
      
        <div
          v-else
          class="schedule"
        >
          <div class="schedule__inner">
            <ScheduleList
              :job-periods="jobPeriods"
              :data-by-date="dataByDate"
              @start-edit="handleStartEditPeriod"
              @start-delete="handleDeleteEditPeriod"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { onMounted, ref } from 'vue';

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';

import ScheduleList from './components/ScheduleList.vue';

import plusIcon from '@/assets/icons/plus.svg';

import { JobGetShedule } from './js/ApiClassesStandardsPage';

const isJobsRequestNow = ref(false);

const managerId = 1;
const todayDate = new Date();
const tomorrowDate = new Date(new Date(todayDate).setDate(todayDate.getDate() + 1));

/** 
 * Расписание сотрудника. Содержит начало и конец рабочего периода для каждой даты
 */
const jobPeriods = ref([]);

/**
 * Данные для графика. Содержит общее время работы, наличие отчёта, текст отчёта
 */
const dataByDate = ref([]);

onMounted(async () => {
  isJobsRequestNow.value = true;

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const jobGetScheduleInstance = new JobGetShedule();

  jobGetScheduleInstance.managerId = String(managerId);
  jobGetScheduleInstance.filterStartDate = String(todayDate.getTime());
  jobGetScheduleInstance.filterEndDate = String(tomorrowDate.getTime());

  jobGetScheduleInstance.request(
    '/job/get_shedule.php',
    'manager',
    (response) => {
      console.log(response, '<<<');
      isJobsRequestNow.value = false;
    },
    (error) => {
      console.log(error, '@@@');
      jobPeriods.value = [
        {
          managerId,
          forDate: todayDate.toLocaleDateString('en-CA'),
          periodStart: new Date(new Date().setHours(8)),
          periodEnd: new Date(new Date().setHours(16)),      
        },
        {
          managerId,
          forDate: tomorrowDate.toLocaleDateString('en-CA'),
          periodStart: new Date(new Date().setHours(8)),
          periodEnd: new Date(new Date().setHours(16)),      
        }
      ];

      dataByDate.value = [
        {
          forDate: todayDate.toLocaleDateString('en-CA'),
          workTime: 1000 * 60 * 60 * 8,
          haveReport: true,
          report: 'Lorem ipsum dolor sit amet'
        },
        {
          forDate: tomorrowDate.toLocaleDateString('en-CA'),
          workTime: 1000 * 60 * 60 * 8,
          haveReport: false,
          report: ''
        },
      ];
      isJobsRequestNow.value = false;
    }
  );
});

function handleAddButtonClick() {
  alert('[CREATE] Under construct');
}

function handleStartEditPeriod(period) {
  alert('[UPDATE] Under construct ' + period.forDate);
}

function handleDeleteEditPeriod(period) {
  alert('[DELETE] Under construct ' + period.forDate);
}
</script>

<style scoped>
/* Spinner */
.spinner-loader {
  width: 50px;
}

/* Section */
.schedule-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  padding-bottom: 80px;
}

.schedule-section__title {
  margin: 0;
  line-height: 42px;
}

/* Top Button */
.top-button {
  position: sticky;
  align-self: flex-end;
  top: 60px;
  right: 20px;
  transform: translateY(-100%);
  display: flex;
}

/* Wrapper */
.wrapper {
  display: flex;
  justify-content: center;
}

.wrapper__inner {
  max-width: 400px;
}
</style>
