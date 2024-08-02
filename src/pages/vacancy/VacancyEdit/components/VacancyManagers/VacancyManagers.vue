<template>
	<SpinnerMain
		v-if="request"
		class="manager-list__status-spinner"
	/>
	<VacancyManagersList
		v-if="!request"
		:managerList="managerList.assignedManagers"
		:requestManagersModification
		:indicators
		:managerMod
	></VacancyManagersList>

	<Teleport to="body">
		<!-- Вывод модалки для добавления и изменения статуса -->
		<VacancyManagersModal
			:show="indicators.isAdd || indicators.isDelete"
			:managerMod
			:indicators
			:managerList="managerList.unassignedManagers"
			:requestManagersModification
			:request
			:errorMessage
			:formData
		/>
	</Teleport>
</template>

<script setup>
import SpinnerMain from '@/components/SpinnerMain.vue';
import VacancyManagersModal from './VacancyManagersModal.vue';

import {
	VacanciesAccessGetManagerAccessVacancy,
	VacanciesAccessSetManagerAccessVacancy,
} from '../../js/ApiClassesVacancyEdit';
import { onMounted, watch, ref } from 'vue';
import VacancyManagersList from './VacancyManagersList.vue';

const props = defineProps({
	// Id вакансии
	vacancyId: {
		type: String,
		required: true,
	},
});
// Доступные статусы - общие, трансферные, для селекта
const managerList = ref({
	assignedManagers: [],
	unassignedManagers: [],
});
// Информация об изменяемом менеджере
const managerMod = ref({
	action: '',
	permissionType: 'VACANCY_PERMISSION',
	managerId: '',
});
//Данные с MainSelect
const formData = ref({
	id: '',
});

//Индикаторы для открытия попапа и символа крестика
const indicators = ref({
	isDelete: false,
	isAdd: false,
	isHandled: false,
});

// Флаг запроса
const request = ref(false);
// Сообщение об ошибке
const errorMessage = ref({
	error: '',
});

// Запрос менеджеров по id
const requestVacancyManagers = () => {
	const requestInstance = new VacanciesAccessGetManagerAccessVacancy();
	requestInstance.vacancyId = props.vacancyId;
	requestInstance.permissionType = managerMod.value.permissionType;
	request.value = true;
	errorMessage.value.error = '';
	requestInstance.request(
		'/vacancies/access/get_managers_access_vacancy.php',
		'manager',
		(response) => {
			// Обновляем списки менеджеров
			managerList.value.assignedManagers = response.assignedManagers;
			managerList.value.unassignedManagers = response.unassignedManagers;
			request.value = false;
		},
		(err) => {
			request.value = false;
			errorMessage.value.error = err;
		}
	);
};

// Запрос на добавление/удаление менеджера
const requestManagersModification = (action, managerId) => {
	const requestInstance = new VacanciesAccessSetManagerAccessVacancy();
	//Условие нужно для проверки удаляем или добавляем
	managerMod.value.managerId = managerId;

	managerMod.value.action = action;
	requestInstance.action = managerMod.value.action;
	requestInstance.vacancyId = props.vacancyId;
	requestInstance.action = managerMod.value.action;
	requestInstance.permissionType = managerMod.value.permissionType;
	requestInstance.managerId = managerMod.value.managerId;
	request.value = true;
	errorMessage.value.error = '';
	requestInstance.request(
		'/vacancies/access/set_manager_access_vacancy.php',
		'manager',
		(response) => {
			// Обновляем данные менеджеров
			requestVacancyManagers();
			indicators.value.isAdd = false;
			indicators.value.isDelete = false;
			formData.value.id = '';
			managerMod.value.managerId = '';
		},
		(err) => {
			request.value = false;
			errorMessage.value.error = err;
		}
	);
};

//при загрузке делаем запрос к серверу
onMounted(() => {
	requestVacancyManagers();
});

watch(
	() => [indicators.value.isAdd, indicators.value.isDelete],
	() => {
		document.body.style.overflow =
			indicators.value.isAdd || indicators.value.isDelete ? 'hidden' : '';
	}
);
</script>

<style scoped>
.manager-list__status-error {
	color: var(--error-color);
}
.manager-list__status-spinner {
	width: 50px;
}
.manager-list__options-box {
	margin: 20px 0;
	display: flex;
	align-items: center;
}
.manager-list__select-box {
	margin-left: 20px;
	display: flex;
}
</style>
