<template>
	<div class="manager-list__box">
		<div>
			Менеджеры вакансии: {{ managerList.length || 'менеджеры не заданы' }}
		</div>
		<div class="manager-list__item-box">
			<VacancyManagersItem
				v-for="manager in managerList"
				:key="manager.id"
				:manager
				:indicators
				:managerMod
			></VacancyManagersItem>
			<ButtonIcon
				@click="openAddManagersModal"
				class="manager-list__add-btn"
			>
				<template v-slot:icon>
					<IconAdd class="manager-list__list-icon" />
				</template>
			</ButtonIcon>
		</div>
	</div>
</template>

<script setup>
import VacancyManagersItem from './VacancyManagersItem.vue';
import IconAdd from '@/assets/icons/add.svg?component';
import ButtonIcon from '@/components/ButtonIcon.vue';

const props = defineProps({
	// Массив менеджеров
	managerList: {
		type: Array,
		required: true,
	},
	//Функция удаленния менеджера
	requestManagersModification: {
		type: Function,
		required: true,
	},
	// Индикаторы
	indicators: {
		type: Object,
		required: true,
	},
	// Информация об изменяемом менеджере
	managerMod: {
		type: Object,
		required: true,
	},
});

//Открытия попапа добаления менеджеров
const openAddManagersModal = () => {
	props.indicators.isAdd = true;
};
</script>

<style scoped>
.manager-list__box {
	margin-top: 40px;
	user-select: none;
}
.manager-list__item-box {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
	margin: 10px 0;
}
.manager-list__add-btn {
	padding: 0;
}
.manager-list__list-icon {
	align-self: center;
	transition: all 0.3s ease;
	width: 20px;
	height: 20px;
	&:hover {
		transform: scale(1.3);
	}
}
</style>
