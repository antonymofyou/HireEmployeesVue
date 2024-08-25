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
        @click="callbacks.startAddNewDay"
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
              @day-edit="callbacks.handleDayEditDaysList"
              @day-delete="callbacks.handleDayDeleteDaysList"
              @period-select="callbacks.handlePeriodSelectDaysList"
              @period-add="callbacks.handlePeriodAddDaysList"
              @period-delete="callbacks.handlePeriodDeleteDaysList"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Модалка добавления периода -->
  <ModalAddPeriod
    :is-show="isAddPeriodModalVisible"
    :is-loading="isAddNewPeriodRequestNow"
    :for-day="helpers.getDayById(activePeriod.dayId) ?? {}"
    @close="modalsActions.closeAddPeriodModal"
    @period-add="periodsActions.addNewPeriod"
  />

  <!-- Модалка удаления периода -->
  <ModalConfirm
    :is-show="isDeletePeriodModalVisible"
    :is-loading="isDeletePeriodRequestNow"
    title="Удалить период?"
    button-text="Удалить"
    @confirm="periodsActions.deleteSelectedPeriod"
    @close="modalsActions.closeDeletePeriodModal"
  />

  <!-- Модалка удаления рабочего дня -->
   <ModalConfirm
    :is-show="isDeleteDayModalVisible"
    :is-loading="isDeleteDayRequestNow"
    title="Удалить рабочий день?"
    button-text="Удалить"
    @confirm="daysActions.deleteSelectedDay"
    @close="modalsActions.closeDeleteDayModal"
   />
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';

import DaysList from './components/days/DaysList.vue';

import plusIcon from '@/assets/icons/plus.svg';

import { JobGetShedule } from './js/ApiClassesStandardsPage';
import ModalAddPeriod from './components/modals/ModalAddPeriod.vue';
import ModalConfirm from './components/modals/ModalConfirm.vue';

// Идёт ли запрос за периодами (инициализация)
const isJobsRequestNow = ref(false);

// Идёт ли запрос за удалением дня
const isDeleteDayRequestNow = ref(false);

// Идёт ли запрос за добавлением периода
const isAddNewPeriodRequestNow = ref(false);
// Идёт ли запрос за удалением периода
const isDeletePeriodRequestNow = ref(false);

// Видна ли модалка добавления периода
const isAddPeriodModalVisible = ref(false);
// Видна ли модалка удаления периода
const isDeletePeriodModalVisible = ref(false);

// Видна ли модалка удаления рабочего дня
const isDeleteDayModalVisible = ref(false);

// Информация о днях работы
const days = ref([]);
// Информация о периодах по дням работы. Record<DayId, period>
const periodsTimes = ref([]);
// Данные сотрудника
const staffData = ref({});

// Инициализаторы
const initializators = {
  /**
   * Инициализация активного периода
   */
  initActivePeriod() {
    return {
      periodId: null,
      dayId: null,
      action: null
    };
  },

  /**
   * Инициализация активного дня
   */
  initActiveDay() {
    return {
      dayId: null
    };
  }
};

// Активный день
const activeDay = ref(initializators.initActiveDay());

// Активный период
const activePeriod = ref(initializators.initActivePeriod());

watch(activePeriod, (newVal) => {
  console.log(newVal)
})

// Вспомогательные функции
const helpers = {
  /**
   * Сброс активного периода
   */
  resetActivePeriod() {
    if (!activePeriod.value) return;
    if (isDeletePeriodModalVisible.value) return;
  
    activePeriod.value = initializators.initActivePeriod();
  },

  /**
   * Получить день по ID
   * @param {Number} id - ID дня
   */
  getDayById(id) {
    const result = days.value.find((d) => d.dayId === id);
    return result;
  }
};

// Основные функции (обработчики событий и т.д.)
const callbacks = {
  /**
   * Обработка события изменения дня
   * @param {Number} dayId - ID дня
   */
  handleDayEditDaysList(dayId) {
    alert('[EDIT]: ' + dayId);
  },

  /**
   * Обработка события удаления дня
   * @param {Number} dayId - ID дня
   */
  handleDayDeleteDaysList(dayId) {
    activeDay.value.dayId = dayId;
    isDeleteDayModalVisible.value = true;
  },

  /**
   * Обработка события выбора периода
   * @param {Object} periodEmitted - Период
   */
  handlePeriodSelectDaysList(periodEmitted) {
    activePeriod.value = {
      periodId: periodEmitted.periodId,
      dayId: periodEmitted.dayId,
      action: null
    };
  },

  /**
   * Обработка события добавления периода
   * @param {Object} periodEmitted - Период
   */
  handlePeriodAddDaysList(periodEmitted) {
    console.log('Period = ', periodEmitted)
    activePeriod.value.dayId = periodEmitted.dayId;
    isAddPeriodModalVisible.value = true;
  },

  /**
   * Обработка события удаления периода
   * @param {Object} periodEmitted - Период
   */
  handlePeriodDeleteDaysList(periodEmitted) {
    isDeletePeriodModalVisible.value = true;
  
    activePeriod.value = {
      periodId: periodEmitted.periodId,
      dayId: periodEmitted.dayId,
      action: periodEmitted.action
    };
  },

  /**
   * Начать процесс добавления нового дня
   */
  startAddNewDay() {
    alert('[ADD]');
  }
};

onMounted(() => {
  document.addEventListener('click', helpers.resetActivePeriod);
});

onUnmounted(() => {
  document.removeEventListener('click', helpers.resetActivePeriod);
});

// Моки
const managerId = 1;
const todayDate = new Date();
const tomorrowDate = new Date(new Date(todayDate).setDate(todayDate.getDate() + 1));

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
        },
        {
          dayId: 2,
          date: todayDate.toLocaleDateString('en-CA'),
          workTime: 4,
          report: 'Lorem ipsum dolor sit amet 2',
          reportId: 1,
          isWeekend: 0,
          comment: 'Comment about this date 2'
        },
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
        ],

        2: [
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

// Действия над днями
const daysActions = {
  /**
   * Удаление выбранного дня
   */
  async deleteSelectedDay() {
    isDeleteDayRequestNow.value = true;

    // @TODO запрос за удалением
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('Удаляю: ', activeDay.value.dayId);

    isDeleteDayRequestNow.value = false;

    // Моковое удаление
    days.value = days.value.filter((day) => {
      return day.dayId !== activeDay.value.dayId;
    });

    delete periodsTimes[activeDay.value.dayId];

    modalsActions.closeDeleteDayModal();
  }
};

// Действия над периодами
const periodsActions = {
  /**
   * Добавление нового периода
   */
  async addNewPeriod(period) {
    if (isAddNewPeriodRequestNow.value) return;

    isAddNewPeriodRequestNow.value = true;

    // @TODO Запрос на добавление
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('Добавляю новый период: ', period);

    isAddNewPeriodRequestNow.value = false;
    modalsActions.closeAddPeriodModal();
  },

  /**
   * Удаление выбранного периода
   */
  async deleteSelectedPeriod() {
    if (isDeletePeriodRequestNow.value) return;

    isDeletePeriodRequestNow.value = true;
  
    // @TODO Запрос на удаление
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    console.log('Удаляю выбранный период: ', activePeriod.value);

    // Моковое удаление
    periodsTimes.value[activePeriod.value.dayId] = periodsTimes.value[activePeriod.value.dayId].filter((period) => {
      return period.periodId !== activePeriod.value.periodId;
    });
  
    isDeletePeriodRequestNow.value = false;
    modalsActions.closeDeletePeriodModal();
    helpers.resetActivePeriod();
  }
};

// Действия над модалками
const modalsActions = {
  /**
   * Закрыть модалку добавления периода
   */
  closeAddPeriodModal() {
    isAddPeriodModalVisible.value = false;
  },
  
  /**
   * Закрыть модалку удаления периода
   */
  closeDeletePeriodModal() {
    isDeletePeriodModalVisible.value = false;
  },

  /**
   * Закрыть модалку удаления дня
   */
  closeDeleteDayModal() {
    isDeleteDayModalVisible.value = false;
  }
};
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
</style>
