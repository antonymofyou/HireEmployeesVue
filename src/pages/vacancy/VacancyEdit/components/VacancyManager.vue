<template>
    <div class="vacancy-edit__status">
        <SpinnerMain v-if="request" class="vacancy-edit__status-spinner" />
        <p
            class="vacancy-edit__status-error"
            v-if="errorMessage && !isAdd && !isEdit"
        >
         {{ errorMessage }}
        </p>

        <!-- Список менеджеров -->
        <VacancyManagerList
            v-if="!request"
            :managerList
        />

        <!-- Кнопка добавления менеджера -->
        <div class="vacancy-edit__status-add">
        <ButtonIcon
            class="vacancy-edit__status-add-btn"
            @click="
            (indicators.isAdd = true),
              (managerMod = {
                action: 'create',
                name: '',
                id: ''
              })
            "
        >
            <template v-slot:icon
            ><IconAdd class="vacancy-edit__status-add-icon" />
            </template>
        </ButtonIcon>
        </div>
    </div>

    <Teleport to="body">
    <!-- Вывод модалки для добавления и изменения менеджера -->
    <Modal
      class="vacancy-edit__modal"
      :show="indicators.isAdd || indicators.isEdit"
      @click.self="
        indicators.isAdd = false;
        indicators.isEdit = false;
      "
    >
      <template v-slot:header>
        <div class="vacancy-edit__modal__title">
          {{ indicators.isAdd ? 'Добавление менеджера' : 'Изменение менеджера' }}
        </div>
      </template>

      <template v-slot:body>

        <SelectMain
          v-if="indicators.isAdd"
          v-model="managerMod.name"
          :options="managerList.managersUnassigned"
        />

        <ButtonMain
          class="vacancy-edit__modal-btn-add"
          @click="
            indicators.isAdd
              ? handleModification(managerMod.name, 'create')
              : handleModification(managerMod.name, 'update')
          "
          :isActive="request"
          :message="errorMessage"
        >
          <template v-slot:text>{{
            indicators.isAdd ? 'Добавить' : 'Изменить'
          }}</template>
        </ButtonMain>
      </template>
    </Modal>
  </Teleport>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { VacanciesAccessGetManagerAccessVacancy } from '../js/ApiClassesVacancyEdit';
import IconAdd from '@/assets/icons/add.svg?component';
import SpinnerMain from '@/components/SpinnerMain.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import VacancyManagerList from '../components/VacancyManagerList.vue'
import ButtonMain from '@/components/ButtonMain.vue';
import InputSimple from '@/components/InputSimple.vue';
import Modal from '@/components/Modal.vue';
import SelectMain from '@/components/SelectMain.vue';


const props = defineProps({
  // Id вакансии
  vacancyId: {
    type: String,
    required: true,
  },
});
// Индикаторы
const indicators = ref({
  isAdd: false,
  isEdit: false,
  isTransfer: false,
  activeHandlers: false,
  activeTransfer: false,
});
// Список менеджеров
const managerList = ref({
  managersAssigned: [],
  managersUnassigned: [],
  xyu: []
});
// Создаваемый/изменяемый менеджер
const managerMod = ref({
  action: 'create',
  name: '',
  id: ''
});
// Флаг запроса
const request = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');

const handleModification = (managerName, method) => {
  //Присваиваем данные модификации
  managerMod.value.action = method;
  managerMod.value.name = managerName;
}
const requestVacancyManager = () => {
  const requestInstance = new VacanciesAccessGetManagerAccessVacancy();
  request.value = true;
  requestInstance.vacancyId = props.vacancyId;
  requestInstance.statusName = ''; 
  requestInstance.permissionType = 'VACANCY_PERMISSION'; 
  errorMessage.value = ''
  requestInstance.request(
    '/vacancies/access/get_managers_access_vacancy.php',
    'manager',
    (response) => {
        console.log(response);
        // Получаем массив назначенных менеджеров вакансии.
        managerList.value.managersAssigned = response.assignedManagers.map((manager) => {
         return { id: manager.id, name: manager.name };
        });
        // Получаем массив неназначенных менеджеров вакансии.
        managerList.value.managersUnassigned = response.unassignedManagers.map((manager) => {
         return { id: manager.id, name: manager.name };
        });
        // Если менеджеров нет - создаем шаблонный.
        if (!managerList.value.managersAssigned.length) {
            request.value = false;
            // managerMod.value = {
            //     action: 'create',
            //     name: 'New',
            //     id: ''
            // }
        };
        request.value = false;
    },
    (err) => {
        request.value = false;
        errorMessage.value = err
    }
)}


onMounted(() => {
    requestVacancyManager();
});
</script>

<style scoped>
.vacancy-edit__status {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 50px;
}

.spinner__svg {
  align-self: center;
}

.vacancy-edit__status-error {
  color: var(--error-color);
}

.vacancy-edit__status-add {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: fit-content;
  max-width: fit-content;
}

.vacancy-edit__status-add-btn {
  display: flex;
  padding: 0;
  width: fit-content;
}

.vacancy-edit__status-add-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
}

.vacancy-edit__modal-btn-add {
  display: flex;
  align-items: center;
  align-self: center;
  width: fit-content;
  gap: 5px;
}

.vacancy-edit__modal-select {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.vacancy-edit__modal-select-color {
  -webkit-appearance: none;
  appearance: none;
  width: 90px;
  height: 20px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
}

.vacancy-edit__status-spinner {
  width: 50px;
}
</style>