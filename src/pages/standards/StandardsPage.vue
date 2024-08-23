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
      <form
        id="add-period-form"
        class="modal-add-period__form"
        @submit.prevent="handleAddPeriodFormSubmit"
      >
        <InputSimple
          v-model="newPeriod.forDate"
          placeholder="Дата (yyyy-mm-dd)"
          pattern="\d{4}-\d{2}-\d{2}"
        />
        <InputSimple
          v-model="newPeriod.periodStart"
          placeholder="Начало"
        />
        <InputSimple
          v-model="newPeriod.periodEnd"
          placeholder="Конец"
        />
        <InputSimple
          v-model="newPeriod.report"
          placeholder="Текст отчёта"
          input-type="textarea"
        />
      </form>
    </template>

    <template #footer-control-buttons>
      <div class="modal-add-period__footer">
        <ButtonMain
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
      <form
        id="edit-period-form"
        class="modal-edit-period__form"
        @submit.prevent="handleAddPeriodFormSubmit"
      >
        <InputSimple
          v-model="newPeriod.forDate"
          placeholder="Дата (yyyy-mm-dd)"
          pattern="\d{4}-\d{2}-\d{2}"
        />
        <InputSimple
          v-model="newPeriod.periodStart"
          placeholder="Начало"
        />
        <InputSimple
          v-model="newPeriod.periodEnd"
          placeholder="Конец"
        />
        <InputSimple
          v-model="newPeriod.report"
          placeholder="Текст отчёта"
          input-type="textarea"
        />
      </form>
    </template>

    <template #footer-control-buttons>
      <div class="modal-edit-period__footer">
        <ButtonMain
          :is-disabled="isAddPeriodButtonDisabled"
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
      <div>Удалить период?</div>
    </template>

    <template #body>
      <div class="modal-delete-period__footer">
        <ButtonMain>
          <template #text>Удалить</template>
        </ButtonMain>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import TheHeader from '@/components/TheHeader.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import TopSquareButton from '@/components/TopSquareButton.vue';
import Modal from '@/components/Modal.vue';
import InputSimple from '@/components/InputSimple.vue';
import ButtonMain from '@/components/ButtonMain.vue';

import ScheduleList from './components/ScheduleList.vue';

import plusIcon from '@/assets/icons/plus.svg';

import { JobGetShedule } from './js/ApiClassesStandardsPage';

// Идёт ли запрос за периодами
const isJobsRequestNow = ref(false);

// Новый период
const newPeriod = ref({
  forDate: '',
  periodStart: '',
  periodEnd: '',
  report: ''
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

  for (const key in newPeriod.value) {
    if (newPeriod.value[key].length === 0) {
      isDisabled = true;
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

function handleAddPeriodFormSubmit(event) {
  const form = event.target;

  console.log(form.reportValidity())

  console.log('Submitted: ', newPeriod.value);
}

/**
 * Закрыть модалку добавления периода
 */
function closeAddPeriodModal() {
  isAddPeriodModalVisible.value = false;
}

/**
 * Закрыть модалку изменения периода
 */
function closeEditPeriodModal() {
  isEditPeriodModalVisible.value = false;
}

/**
 * Закрыть модалку удаления периода
 */
function closeDeletePeriodModal() {
  isDeletePeriodModalVisible.value = false;
}

/**
 * Обработка клика по кнопке добавления периода
 */
function handleAddButtonClick() {
  isAddPeriodModalVisible.value = true;
}

/**
 * Обработка клика по изменению периода
 * @param {Object} period - Объект периода
 */
function handleStartEditPeriod(period) {
  isEditPeriodModalVisible.value = true;
}

/**
 * Обработка клика по удаления периода
 * @param {Object} period - Объект периода
 */
function handleDeleteEditPeriod(period) {
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
.modal-delete-period__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
