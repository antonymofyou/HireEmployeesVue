<template>
  <TheHeader />

  <main>
    <h1>
      Стандарты
    </h1>
  </main>

  <hr>

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
          <ul class="schedule-list">
            <li
              v-for="period in jobPeriods"
              class="schedule-list__item period"
            >
              <p class="period__text">
                Дата:
                <span class="period__highlight">
                  {{ period.forDate }}
                </span>
              </p>
              <p class="period__text">
                Начало:
                {{ formatTime(period.periodStart) }}
              </p>
              <p class="period__text">
                Конец: 
                {{ formatTime(period.periodStart) }}
              </p>
              <p class="period__text">
                Наличие отчёта:
                {{
                  isExistReportForDate(period.forDate) ? 'Есть' : 'Отсутствует'
                }}
              </p>
              <p
                v-if="isExistReportForDate(period.forDate)"
                class="period__text"
              >
                Текст отчёта:
                {{
                  dataByDate.find((d) => d.forDate === period.forDate).report
                }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// @ts-check
import { onMounted, ref } from 'vue';

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';

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

  await new Promise((resolve) => setTimeout(resolve, 3000));

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

/**
 * Существует ли отчёт для заданной даты
 * @param {String} date - Дата в yyyy-mm-dd формате
 * @returns {Boolean} - Статус наличия отчёта
 */
function isExistReportForDate(date) {
  return Boolean(dataByDate.value.find((d) => d.forDate === date)?.haveReport);
}

/**
 * Отформатировать время
 * @param {String | Date} time - Время для форматирования
 * @returns {String} - Отформатированное время
 */
function formatTime(time) {
  const formatter = new Intl.DateTimeFormat(
    'RU',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return formatter.format(new Date(time));
}
</script>

<style scoped>
/* Spinner */
.spinner-loader {
  width: 50px;
}

/* Wrapper */
.wrapper {
  display: flex;
  justify-content: center;
}

.wrapper__inner {
  max-width: 400px;
}

/* Schedule list */
.schedule-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.schedule-list__item {
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  background: #fff;
  padding: 10px 30px 15px;
  border-radius: 10px;
}

/* Period */
.period__highlight {
  font-weight: bold;
}
</style>
