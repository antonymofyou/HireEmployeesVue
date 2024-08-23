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
        @click="handleAddButtonClick"
      />
    </div>

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

  <!-- Модалка добавления периода -->
  <Modal
    :show="isAddPeriodModalVisible"
    class="modal-add-period"
    @click.self="closeAddPeriodModal"
  >
    <template #header>
      <div>Добавление периода</div>
    </template>

    <template #body>
      <PeriodForm
        v-model:for-date="newPeriod.forDate"
        v-model:period-start="newPeriod.periodStart"
        v-model:period-end="newPeriod.periodEnd"
        v-model:report="newPeriod.report"
        id="add-period-form"
        class="modal-add-period__form"
        @submit="addNewPeriod"
      />
    </template>

    <template #footer-control-buttons>
      <div class="modal-add-period__footer">
        <ButtonMain
          :is-active="isAddNewPeriodRequestNow"
          :is-disabled="isAddPeriodButtonDisabled"
          form="add-period-form"
        >
          <template #text>Создать</template>
        </ButtonMain>
      </div>
    </template>
  </Modal>

  <!-- Модалка изменения периода -->
  <Modal
    :show="isEditPeriodModalVisible"
    class="modal-edit-period"
    @click.self="closeEditPeriodModal"
  >
    <template #header>
      <div>Изменение периода</div>
    </template>

    <template #body>
      <PeriodForm
        v-model:for-date="selectedPeriod.editable.forDate"
        v-model:period-start="selectedPeriod.editable.periodStart"
        v-model:period-end="selectedPeriod.editable.periodEnd"
        v-model:report="selectedPeriod.editable.report"
        id="edit-period-form"
        class="modal-edit-period__form"
        @submit="editSelectedPeriod"
      />
    </template>

    <template #footer-control-buttons>
      <div class="modal-edit-period__footer">
        <ButtonMain
          :is-active="isEditPeriodRequestNow"
          :is-disabled="isEditPeriodButtonDisabled"
          form="edit-period-form"
        >
          <template #text>Изменить</template>
        </ButtonMain>
      </div>
    </template>
  </Modal>

  <!-- Модалка удаления периода -->
  <Modal
    :show="isDeletePeriodModalVisible"
    class="modal-delete-period"
    @click.self="closeDeletePeriodModal"
  >
    <template #header>
      <div class="modal-delete-period__header">
        <span>Удалить период?</span>
        <b>{{ selectedPeriod.default.forDate }}</b>
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
// @ts-check
import { computed, onMounted, ref, watchEffect } from 'vue';

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';
import Modal from '@/components/Modal.vue';
import ButtonMain from '@/components/ButtonMain.vue';

import ScheduleList from './components/ScheduleList.vue';
import PeriodForm from './components/PeriodForm.vue';

import plusIcon from '@/assets/icons/plus.svg';

import { JobGetShedule } from './js/ApiClassesStandardsPage';
import { formatTime, getReportText } from './js/utils';

// Идёт ли запрос за периодами (инициализация)
const isJobsRequestNow = ref(false);
// Идёт ли запрос за добавлением периода
const isAddNewPeriodRequestNow = ref(false);
// Идёт ли запрос за изменением периода
const isEditPeriodRequestNow = ref(false);
// Идёт ли запрос за удалением периода
const isDeletePeriodRequestNow = ref(false);

/**
 * Период
 * @typedef {Object} Period
 * @property {String} forDate - Дата периода
 * @property {String} periodStart - Начало рабочего периода
 * @property {String} periodEnd - Конец рабочего периода
 * @property {String} report - Отчёт за период
 */

/** 
 * Выбранный период
 * @typedef {Object} SelectedPeriod
 * @property {Period} default - Значения по умолчанию
 * @property {Period} editable - Редактируемые значения
 * 
*/

/**
 * Фабрика для нового периода. Для избежания дублирования логики сброса
 * @returns {Period}
 */
const createNewPeriod = () => ({
  forDate: '',
  periodStart: '',
  periodEnd: '',
  report: ''
});

/**
 * Фабрика для выбранного периода. Для избежания дублирования логики сброса
 * @returns {SelectedPeriod}
 */
const createSelectedPeriod = () => ({
    default: createNewPeriod(),
    editable: createNewPeriod(),
});

// Новый период
const newPeriod = ref(createNewPeriod());

// Выбранный период
const selectedPeriod = ref(createSelectedPeriod());

watchEffect(() => {
  console.log(selectedPeriod.value);
});

// Видна ли модалка добавления периода
const isAddPeriodModalVisible = ref(false);
// Видна ли модалка изменения периода
const isEditPeriodModalVisible = ref(false);
// Видна ли модалка удаления периода
const isDeletePeriodModalVisible = ref(false);

// Задизейблена ли кнопка добавления периода
const isAddPeriodButtonDisabled = computed(() => {
  let isDisabled = false;

  // [x] Если что-то пусто - оставляем задизейбленным

  for (const key in newPeriod.value) {
    if (newPeriod.value[key].length === 0) {
      isDisabled = true;
      break;
    }
  }

  return isDisabled;
});

// Задизейблена ли кнопка изменения периода
const isEditPeriodButtonDisabled = computed(() => {
  let isDisabled = true;

  // [x] Если предыдущие значения периода равны новым (ничего не изменилось) - оставляем задизейбленной
  // [x] Если что-то пусто - тоже оставляем задизейбленным

  for (const key in selectedPeriod.value.editable) {
    if (selectedPeriod.value.editable[key].length === 0) {
      isDisabled = true;
      break;
    }

    if (selectedPeriod.value.default[key] !== selectedPeriod.value.editable[key]) {
      isDisabled = false;
      break;
    }
  }

  return isDisabled;
});

// Моки
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

/**
 * Добавление нового периода
 */
async function addNewPeriod() {
  isAddNewPeriodRequestNow.value = true;

   // @TODO Запрос на добавление
   await new Promise((resolve) => setTimeout(resolve, 3000));

   console.log('Добавляю новый период: ', newPeriod.value);

   isAddNewPeriodRequestNow.value = false;
   closeAddPeriodModal();
}

/**
 * Изменение выбранного периода
 */
 async function editSelectedPeriod() {
  isEditPeriodRequestNow.value = true;

  // @TODO Запрос на изменение
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Изменяю выбранный период: ', selectedPeriod.value.default.forDate);
  console.log('Поставлю значения: ', selectedPeriod.value.editable);

  isEditPeriodRequestNow.value = false;
  closeEditPeriodModal();
}

/**
 * Удаление выбранного периода
 */
async function deleteSelectedPeriod() {
  isDeletePeriodRequestNow.value = true;

  // @TODO Запрос на удаление
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Удаляю выбранный период: ', selectedPeriod.value.default.forDate);

  isDeletePeriodRequestNow.value = false;
  closeDeletePeriodModal();
}

/**
 * Закрыть модалку добавления периода
 */
function closeAddPeriodModal() {
  isAddPeriodModalVisible.value = false;
  newPeriod.value = createNewPeriod();
}

/**
 * Закрыть модалку изменения периода
 */
function closeEditPeriodModal() {
  isEditPeriodModalVisible.value = false;
  selectedPeriod.value = createSelectedPeriod();
}

/**
 * Закрыть модалку удаления периода
 */
function closeDeletePeriodModal() {
  isDeletePeriodModalVisible.value = false;
  selectedPeriod.value = createSelectedPeriod();
}

/**
 * Обработка клика по кнопке добавления периода
 */
function handleAddButtonClick() {
  isAddPeriodModalVisible.value = true;
}

/**
 * Клонирование и приведение в читабельный вид периода
 * @param {Object} period - Объект периода
 * @returns {Period} - Стандартизованный объект периода
 */
function cloneAndPrettifyPeriod(period) {
  return {
    ...period,
    periodStart: formatTime(period.periodStart),
    periodEnd: formatTime(period.periodEnd),
    report: getReportText(dataByDate.value, period)
  };
}

/**
 * Обработка клика по изменению периода
 * @param {Period} period - Объект периода
 */
function handleStartEditPeriod(period) {
  selectedPeriod.value.default = cloneAndPrettifyPeriod(period);
  selectedPeriod.value.editable = cloneAndPrettifyPeriod(period);

  isEditPeriodModalVisible.value = true;
}

/**
 * Обработка клика по удаления периода
 * @param {Period} period - Объект периода
 */
function handleDeleteEditPeriod(period) {
  selectedPeriod.value.default = cloneAndPrettifyPeriod(period);
  selectedPeriod.value.editable = cloneAndPrettifyPeriod(period);

  isDeletePeriodModalVisible.value = true;
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
  max-width: 925px;
  width: 100%;
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
