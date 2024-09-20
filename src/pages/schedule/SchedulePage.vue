<template>
  <TheHeader />

  <section class="schedule-section">
    <div class="schedule-section__header">
      <h1 class="schedule-section__title">
        График работы сотрудника
      </h1>
    </div>

    <div class="wrapper">
      <div class="wrapper__inner">
        <div class="schedule">
          <div class="schedule__inner">
            <DaysList
              v-if="days.length"
              :days="days"
              :periods="periodsTimes"
              :active-period-id="activePeriod.periodId"
              :is-allow-edit="isAllowEditingSchedule"
              :is-editing-day-now="isEditDayRequestNow"
              :editing-day-id="currentEditingDayId"
              :editErrorMessage="errorMessage"
              @day-edit="callbacks.handleDayEditDaysList"
              @day-edit-submit="daysActions.editActiveDay"
              @day-delete="callbacks.handleDayDeleteDaysList"
              @period-select="callbacks.handlePeriodSelectDaysList"
              @period-add="callbacks.handlePeriodAddDaysList"
              @period-delete="callbacks.handlePeriodDeleteDaysList"
            />

            <div
              v-else
              class="schedule__empty-notifier"
            >
              Расписание отсутствует
            </div>

            <div class="schedule__actions">
              <TopSquareButton
                v-if="isAllowEditingSchedule && !isJobsRequestNow"
                :icon="plusIcon"
                class="add-button"
                @click="daysActions.addNewDay"
              />

              <SpinnerMain
                v-else-if="isJobsRequestNow"
                class="spinner-loader"
              />
            </div>
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
    :error="errorMessage"
    max-form-width="300px"
    @close="modalsActions.closeAddPeriodModal"
    @submit="periodsActions.addNewPeriod"
  />

  <!-- Модалка удаления периода -->
  <ModalConfirm
    :is-show="isDeletePeriodModalVisible"
    :is-loading="isDeletePeriodRequestNow"
    :error="errorMessage"
    title="Удалить период?"
    button-text="Удалить"
    @confirm="periodsActions.deleteSelectedPeriod"
    @close="modalsActions.closeDeletePeriodModal"
  />

  <!-- Модалка добавления рабочего дня -->
   <ModalDay
    :is-show="isAddDayModalVisible"
    :is-loading="isAddDayRequestNow"
    :error="errorMessage"
    :removed-fields="['spentTime', 'report', 'comment']"
    max-form-width="200px"
    title="Добавление дня"
    button-text="Добавить"
    @submit="daysActions.addNewDay"
    @close="modalsActions.closeAddDayModal"
   />

  <!-- Модалка удаления рабочего дня -->
   <ModalConfirm
    :is-show="isDeleteDayModalVisible"
    :is-loading="isDeleteDayRequestNow"
    :error="errorMessage"
    title="Удалить рабочий день?"
    button-text="Удалить"
    @confirm="daysActions.deleteSelectedDay"
    @close="modalsActions.closeDeleteDayModal"
   />
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';

import DaysList from './components/days/DaysList.vue';
import ModalAddPeriod from './components/modals/ModalAddPeriod.vue';
import ModalConfirm from './components/modals/ModalConfirm.vue';
import ModalDay from './components/modals/ModalDay.vue';

import plusIcon from '@/assets/icons/plus.svg';

import { JobGetShedule, JobSetDay, JobSetPeriod } from './js/ApiClassesSchedulePage';
import { isManager } from '@/js/AuthFunctions';

const router = useRouter();

// Проверка авторизации пользователя
if (!isManager()) router.push({ name: 'managerAuth' });

// Идёт ли запрос за периодами (инициализация)
const isJobsRequestNow = ref(false);

// Идёт ли запрос за добавлением дня
const isAddDayRequestNow = ref(false);
// Идёт ли запрос за измененим дня
const isEditDayRequestNow = ref(false);
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

// Видна ли модалка добавления рабочего дня
const isAddDayModalVisible = ref(false);
// Видна ли модалка удаления рабочего дня
const isDeleteDayModalVisible = ref(false);

// Находимся ли в состоянии изменения рабочего дня
const isEditingDayStatus = ref(false);

// Текущий день на изменение
const currentEditingDayId = computed(() => {
  // Если не находимся в состоянии изменения рабочего дня - не ищем активный день
  if (!isEditingDayStatus.value) return null;

  const findDay = days.value.find((day) => day.dayId === activeDay.value.dayId);

  return findDay?.dayId ?? null;
});

// Сообщение об ошибке (запросы к серверу и т.д.)
const errorMessage = ref('');

// Информация о днях работы
const days = ref([]);
// Информация о периодах по дням работы. Record<DayId, Array<Period>>
const periodsTimes = ref([]);
// Данные сотрудника
const staffData = ref({});

// Разрешено ли пользователю редактировать расписание
const isAllowEditingSchedule = computed(() => {
  return Boolean(staffData.value.isSelfSchedule);
});

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

// Вспомогательные функции
const helpers = {
  /**
   * Сброс активного периода
   */
  async resetActivePeriod() {
    if (!activePeriod.value) return;

    // Если есть модалки - не сбрасываем
    if (document.querySelectorAll('*[class^="modal"]').length !== 0) return;
  
    activePeriod.value = initializators.initActivePeriod();
  },

  /**
   * Получить день по ID
   * @param {Number} id - ID дня
   * @returns {Object | null} - День или его отсутствие
   */
  getDayById(id) {
    if (!days.value) return null;

    const result = days.value.find((d) => d.dayId === id);
    return result;
  },

  /**
   * Сброс сообщения об ошибке
   */
  resetError() {
    errorMessage.value = '';
  }
};

// Основные функции (обработчики событий и т.д.)
const callbacks = {
  /**
   * Обработка события изменения дня
   * @param {Number} dayId - ID дня
   */
  handleDayEditDaysList(dayId) {
    helpers.resetError();

    if (activeDay.value.dayId && dayId === activeDay.value.dayId) {
      daysActions.resetEditDay();
    } else {
      daysActions.setEditDay(dayId);
    }
  },

  /**
   * Обработка события удаления дня
   * @param {Number} dayId - ID дня
   */
  handleDayDeleteDaysList(dayId) {
    daysActions.resetEditDay();

    helpers.resetError();

    activeDay.value.dayId = dayId;
    isDeleteDayModalVisible.value = true;
  },

  /**
   * Обработка события выбора периода
   * @param {Object} periodEmitted - Период
   */
  handlePeriodSelectDaysList(periodEmitted) {
    helpers.resetError();

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
    helpers.resetError();

    activePeriod.value.dayId = periodEmitted.dayId;
    isAddPeriodModalVisible.value = true;
  },

  /**
   * Обработка события удаления периода
   * @param {Object} periodEmitted - Период
   */
  handlePeriodDeleteDaysList(periodEmitted) {
    helpers.resetError();

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
    helpers.resetError();

    isAddDayModalVisible.value = true;
  }
};

onMounted(() => {
  document.addEventListener('click', helpers.resetActivePeriod);
});

onUnmounted(() => {
  document.removeEventListener('click', helpers.resetActivePeriod);
});

onMounted(() => {
  requests.fetchSchedule();
});

// Запросы к серверу
const requests = {
  /**
   * Запрос на получение расписания
   * @param {Function} onSuccess - Коллбек для успешного завершения
   */
  fetchSchedule: (onSuccess) => {
    isJobsRequestNow.value = true;

    const jobGetScheduleInstance = new JobGetShedule();

    return jobGetScheduleInstance.request(
      '/job/get_schedule.php',
      'manager',
      (response) => {
        const { 
          days: responseDays,
          periodsTimes: responsePeriods,
          staffData: responseStaffData
        } = response;

        // Устанавливаем пришедшие значения в состояние
        days.value = responseDays || [];
        periodsTimes.value = responsePeriods;
        staffData.value = responseStaffData;

        isJobsRequestNow.value = false;
        onSuccess();
      },
      () => {
        isJobsRequestNow.value = false;
      }
    );
  },

  /**
   * Запрос на добавление нового дня
   * @param {Object} newDay - Новый день
   */
  fetchAddNewDay: (newDay) => {
    isAddDayRequestNow.value = true;

    // Берём дату последнего дня в списке
    const lastDay = days.value.at(-1)?.date ?? new Date().toLocaleDateString('en-CA');

    // Дата для добавления, манипулируем ей
    const addDate = new Date(lastDay);
    addDate.setDate(addDate.getDate() + 1);

    // Отформатированная строка завтрашней даты
    const tomorrowFormattedDate = addDate.toLocaleDateString('en-CA');

    // Отправляемый на бэк день
    const tomorrowDay = {
      date: tomorrowFormattedDate,
      isWeekend: 0,
      comment: ''
    };

    const jobSetDayInstance = new JobSetDay();
    jobSetDayInstance.action = 'create';
    jobSetDayInstance.setDay = tomorrowDay;

    jobSetDayInstance.request(
      '/job/set_day.php',
      'manager',
      (response) => {
        // Обработка успешного добавления
        modalsActions.closeAddDayModal();
        helpers.resetError();

        isAddDayRequestNow.value = false;

        console.log(response);

        requests.fetchSchedule(
          () => {
            // Ставим добавленный день в режим редактирования
            const lastDay = days.value.at(-1);

            // Если нет последнего дня - ничего не делаем
            if (!lastDay) return;

            daysActions.setEditDay(lastDay.dayId);
          }
        );
      },
      (error) => {
        // Обработка ошибки при добавлении
        errorMessage.value = error;

        isAddDayRequestNow.value = false;
      }
    );
  },

  /**
   * Запрос на изменение дня
   * @param {String | Number} dayId - ID изменяемого дня
   * @param {Object} editedDay - Изменённый день
   */
  fetchEditDay: async (dayId, editedDay) => {
    isEditDayRequestNow.value = true;

    // Запрос на изменение дня
    const jobSetDayInstance = new JobSetDay();

    jobSetDayInstance.action = 'update';
    jobSetDayInstance.dayId = dayId;
    jobSetDayInstance.setDay = {
      date: editedDay.date,
      isWeekend: String(Number(editedDay.isWeekend)),
      spentTime: editedDay.spentTime,
      report: editedDay.report,
      comment: editedDay.comment
    };

    jobSetDayInstance.request(
      '/job/set_day.php',
      'manager',
      () => {
        activeDay.value = initializators.initActiveDay();
        helpers.resetError();
        
        isEditingDayStatus.value = false;
        isEditDayRequestNow.value = false;

        requests.fetchSchedule();
      },
      (error) => {
        errorMessage.value = error;
        isEditDayRequestNow.value = false;
      }
    );
  },

  /**
   * Запрос на удаление дня
   * @param {String | Number} dayId - ID удаляемого дня
   */
  fetchDeleteDay: (dayId) => {
    isDeleteDayRequestNow.value = true;

    // Запрос на удаление дня
    const jobSetDayInstance = new JobSetDay();

    jobSetDayInstance.action = 'delete';
    jobSetDayInstance.dayId = dayId;

    jobSetDayInstance.request(
      '/job/set_day.php',
      'manager',
      (response) => {
        modalsActions.closeDeleteDayModal();
        activeDay.value = initializators.initActiveDay();
        helpers.resetError();

        isDeleteDayRequestNow.value = false;

        // При успешном запросе - обновляем состояние
        if (response.success === '1') {
          const deleteDayIndex = days.value.findIndex((day) => day.dayId === dayId);

          console.log(deleteDayIndex)

          if (deleteDayIndex !== -1) {
            days.value.splice(deleteDayIndex, 1);
          }
        }
      },
      (error) => {
        errorMessage.value = error;
        isDeleteDayRequestNow.value = false;
      }
    );
  },

  /**
   * Запрос на добавление периода
   * @param {Number | String} dayId - ID дня, к которому добавляем период
   * @param {Object} newPeriod - Новый период
   */
  fetchAddNewPeriod: (dayId, newPeriod) => {
    isAddNewPeriodRequestNow.value = true;

    // Запрос на добавление периода
    const jobSetPeriodInstance = new JobSetPeriod();

    jobSetPeriodInstance.action = 'create';
    jobSetPeriodInstance.dayId = dayId;
    jobSetPeriodInstance.periodStart = newPeriod.periodStart;
    jobSetPeriodInstance.periodEnd = newPeriod.periodEnd;

    jobSetPeriodInstance.request(
      '/job/set_period.php',
      'manager',
      (response) => {
        console.log(response);

        modalsActions.closeAddPeriodModal();

        helpers.resetError()
        
        isAddNewPeriodRequestNow.value = false;
        
        // При успешном запросе - меняем состояние периодов
        if (response.success === '1') {
          helpers.resetActivePeriod();
          periodsTimes.value[dayId] = response.periodsTimes[dayId];
        }
      },
      (error) => {
        errorMessage.value = error;

        isAddNewPeriodRequestNow.value = false;
      }
    );
  },

  /**
   * Запрос на удаление периода
   * @param {Number | String} dayId - ID дня, у которого удаляем период
   * @param {Number | String} periodId - ID удаляемого периода
   */
  fetchDeletePeriod: (dayId, periodId) => {
    isDeletePeriodRequestNow.value = true;
  
    const jobSetPeriodInstance = new JobSetPeriod();

    jobSetPeriodInstance.action = 'delete';
    jobSetPeriodInstance.dayId = dayId;
    jobSetPeriodInstance.periodId = periodId;

    jobSetPeriodInstance.request(
      '/job/set_period.php',
      'manager',
      () => {
        modalsActions.closeDeletePeriodModal();
        helpers.resetActivePeriod();
        helpers.resetError();

        isDeletePeriodRequestNow.value = false;

        requests.fetchSchedule();
      },
      (error) => {
        errorMessage.value = error;
        isDeletePeriodRequestNow.value = false;
      }
    );
  }
};

// Действия над днями
const daysActions = {
  /**
   * Добавление нового дня
   * @param {Object} newDay - Новый день
   */
  async addNewDay(newDay) {
    if (isAddDayRequestNow.value) return;
    helpers.resetError();

    // Отправляем запрос на добавление дня
    requests.fetchAddNewDay(newDay);
  },

  /**
   * Изменение выбранного дня
   * @param {Object} editedDay - Изменённый день
   */
  async editActiveDay(editedDay) {
    if (isEditDayRequestNow.value) return;
    helpers.resetError();

    // Отправляем запрос на изменение дня
    requests.fetchEditDay(activeDay.value.dayId, editedDay);
  },

  /**
   * Удаление выбранного дня
   */
  async deleteSelectedDay() {
    if (isDeleteDayRequestNow.value) return;
    helpers.resetError();

    requests.fetchDeleteDay(activeDay.value.dayId);
  },

  /**
   * Поставить день в редактируемый
   * @param {String|Number} dayId - ID редактируемого дня
   */
  setEditDay(dayId) {
    isEditingDayStatus.value = true;
    activeDay.value.dayId = dayId;
  },

  /**
   * Сбросить редактируемый день
   */
  resetEditDay() {
    isEditingDayStatus.value = false;
    activeDay.value.dayId = initializators.initActiveDay();
  }
};

// Действия над периодами
const periodsActions = {
  /**
   * Добавление нового периода
   */
  async addNewPeriod(period) {
    if (isAddNewPeriodRequestNow.value) return;
    helpers.resetError();
    
    // Запрос за добавлением нового периода
    requests.fetchAddNewPeriod(period.dayId, period)
  },

  /**
   * Удаление выбранного периода
   */
  async deleteSelectedPeriod() {
    if (isDeletePeriodRequestNow.value) return;
    helpers.resetError();

    // Запрос за удалением периода
    requests.fetchDeletePeriod(activePeriod.value.dayId, activePeriod.value.periodId);
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
   * Закрыть модалку добавления дня
   */
  closeAddDayModal() {
    isAddDayModalVisible.value = false;
  },

  /**
   * Закрыть модалку удаления дня
   */
  closeDeleteDayModal() {
    isDeleteDayModalVisible.value = false;
    activeDay.value.dayId = initializators.initActiveDay();
  }
};
</script>

<style scoped>
/* Выключаем скролл когда активирована модалка */
:global(body:has(*[class^="modal"])) {
  overflow-y: hidden !important;
}

/* Spinner */
.spinner-loader {
  width: 40px;
}

.wrapper__spinner:not(.visible) {
  position: absolute;
  pointer-events: none;
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
  margin-bottom: 20px;
}

.schedule-section__title {
  margin: 0;
  line-height: 42px;
  text-align: center;
}

.schedule__empty-notifier {
  text-align: center;
}

.schedule__actions {
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

/* Add Button */
.add-button {
  display: flex;
}

@media (width < 390px) {
  .add-button {
    transform: translate(0px, -20%);
  }
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
