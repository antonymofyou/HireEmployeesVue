<template>
  <TheHeader />

  <section class="schedule-section">
    <div class="schedule-section__header">
      <h1 class="schedule-section__title">
        График работы сотрудника
      </h1>
  
      <TopSquareButton
        :icon="plusIcon"
        class="top-button"
      />
    </div>

    <div class="wrapper">
      <div class="wrapper__inner">
        <div
          v-if="isJobsRequestNow"
          class="wrapper__spinner"
        >
          <SpinnerMain
            class="spinner-loader"
          />
        </div>
      
        <div
          v-else
          class="schedule"
        >
          <div class="schedule__inner">
            <DaysList
              :days="days"
              :periods="periodsTimes"
              :active-period-id="activePeriod.periodId"
              @period-select="handlePeriodSelectDaysList"
              @period-add="handlePeriodAddDaysList"
              @period-delete="handlePeriodDeleteDaysList"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <ModalAddPeriod
    v-if="days[0]"
    :is-show="isAddPeriodModalVisible"
    :is-loading="isAddNewPeriodRequestNow"
    :for-day="days[0]"
    @close="closeAddPeriodModal"
    @period-add="addNewPeriod"
  />

  <!-- Модалка удаления периода -->
  <Modal
    :show="isDeletePeriodModalVisible"
    class="modal-delete-period"
    @click.self="closeDeletePeriodModal"
  >
    <template #header>
      <div class="modal-delete-period__header">
        <span>Удалить период?</span>
      </div>
    </template>

    <template #body>
      <div class="modal-delete-period__footer">
        <ButtonMain
          :is-active="isDeletePeriodRequestNow"
          @click="deleteSelectedPeriod"
        >
          <template #text>Удалить</template>
        </ButtonMain>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';
import Modal from '@/components/Modal.vue';
import ButtonMain from '@/components/ButtonMain.vue';

import DaysList from './components/days/DaysList.vue';

import plusIcon from '@/assets/icons/plus.svg';

import { JobGetShedule } from './js/ApiClassesStandardsPage';
import ModalAddPeriod from './components/modals/ModalAddPeriod.vue';

// Идёт ли запрос за периодами (инициализация)
const isJobsRequestNow = ref(false);
// Идёт ли запрос за добавлением периода
const isAddNewPeriodRequestNow = ref(false);
// Идёт ли запрос за удалением периода
const isDeletePeriodRequestNow = ref(false);

// Активный период (ID, ID дня, и действие над ним)
const activePeriod = ref({
  periodId: null,
  dayId: null,
  action: null
});

/**
 * Сброс активного периода
 */
function resetActivePeriod() {
  if (!activePeriod.value) return;
  if (isDeletePeriodModalVisible.value) return;

  activePeriod.value = {
    periodId: null,
    dayId: null,
    action: null
  };
}

/**
 * Обработка выбора периода
 * @param {Object} periodEmitted - Период
 */
function handlePeriodSelectDaysList(periodEmitted) {
  activePeriod.value = {
    periodId: periodEmitted.periodId,
    dayId: periodEmitted.dayId,
    action: null
  };
}

/**
 * Обработка клика по кнопке удаления периода
 * @param {Object} periodEmitted - Период
 */
function handlePeriodDeleteDaysList(periodEmitted) {
  isDeletePeriodModalVisible.value = true;

  activePeriod.value = {
    periodId: periodEmitted.periodId,
    dayId: periodEmitted.dayId,
    action: periodEmitted.action
  };
}

/**
 * Обработка клика по кнопке добавления периода
 */
function handlePeriodAddDaysList() {
  isAddPeriodModalVisible.value = true;
}

onMounted(() => {
  document.addEventListener('click', resetActivePeriod);
});

onUnmounted(() => {
  document.removeEventListener('click', resetActivePeriod);
});

function getDayById(id) {
  return days.value.find((d) => d.id === id);
}

// Видна ли модалка добавления периода
const isAddPeriodModalVisible = ref(false);
// Видна ли модалка удаления периода
const isDeletePeriodModalVisible = ref(false);

// Моки
const managerId = 1;
const todayDate = new Date();
const tomorrowDate = new Date(new Date(todayDate).setDate(todayDate.getDate() + 1));

// Информация о днях работы
const days = ref([]);
// Информация о периодах по дням работы. Record<DayId, period>
const periodsTimes = ref([]);
// Данные сотрудника
const staffData = ref({});

// Запрос к бэку
onMounted(async () => {
  isJobsRequestNow.value = true;

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const jobGetScheduleInstance = new JobGetShedule();

  jobGetScheduleInstance.staffId = String(managerId);
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

      days.value = [
        {
          dayId: 1,
          date: todayDate.toLocaleDateString('en-CA'),
          workTime: 8,
          report: 'Lorem ipsum dolor sit amet',
          reportId: 1,
          isWeekend: 0,
          comment: 'Comment about this date'
        }
      ];

      periodsTimes.value = {
        1: [
          {
            periodId: 1,
            periodStart: new Date(todayDate).setHours(8),
            periodEnd: new Date(todayDate).setHours(13)
          },
          {
            periodId: 2,
            periodStart: new Date(todayDate).setHours(14),
            periodEnd: new Date(todayDate).setHours(17)
          },
          {
            periodId: 3,
            periodStart: new Date(todayDate).setHours(14),
            periodEnd: new Date(todayDate).setHours(17)
          },
          {
            periodId: 4,
            periodStart: new Date(todayDate).setHours(14),
            periodEnd: new Date(todayDate).setHours(17)
          },
          {
            periodId: 5,
            periodStart: new Date(todayDate).setHours(14),
            periodEnd: new Date(todayDate).setHours(17)
          },
          {
            periodId: 6,
            periodStart: new Date(todayDate).setHours(14),
            periodEnd: new Date(todayDate).setHours(17)
          }
        ]
      };

      staffData.value = {
        id: 1,
        userVkId: 'vkid123',
        name: 'Ivan Ivanov',
        isWorkingTimeNow: true
      };
      
      isJobsRequestNow.value = false;
    }
  );
});

/**
 * Добавление нового периода
 */
async function addNewPeriod(period) {
  isAddNewPeriodRequestNow.value = true;

   // @TODO Запрос на добавление
   await new Promise((resolve) => setTimeout(resolve, 3000));

   console.log('Добавляю новый период: ', period);

   isAddNewPeriodRequestNow.value = false;
   closeAddPeriodModal();
}

/**
 * Удаление выбранного периода
 */
async function deleteSelectedPeriod() {
  isDeletePeriodRequestNow.value = true;

  // @TODO Запрос на удаление
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Удаляю выбранный период: ', activePeriod.value);

  isDeletePeriodRequestNow.value = false;
  closeDeletePeriodModal();
}

/**
 * Закрыть модалку добавления периода
 */
function closeAddPeriodModal() {
  isAddPeriodModalVisible.value = false;
}

/**
 * Закрыть модалку удаления периода
 */
function closeDeletePeriodModal() {
  isDeletePeriodModalVisible.value = false;
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
  margin-top: 60px;
  padding-bottom: 80px;
}

.schedule-section__header {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  padding: 0 20px;
  max-width: 925px;
  width: 100%;
}

.wrapper__spinner {
  display: flex;
  justify-content: center;
}

/* Modal add, edit period */
.modal-add-period__form,
.modal-edit-period__form {
  display: contents;
}

.modal-add-period__footer,
.modal-edit-period__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Modal delete period */
.modal-delete-period__header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-delete-period__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
