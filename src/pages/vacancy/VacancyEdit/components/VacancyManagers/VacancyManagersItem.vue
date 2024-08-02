<template>
	<div>
		<div
			@click="handleManagerClick"
			class="manager-item__box"
		>
			<ManagerAssigned :ManagerText="manager.name" />
			<ButtonIcon
				class="manager-item__btn"
				v-if="indicators.isHandled"
				@click="handleManagerDeleteClick(manager)"
			>
				<template v-slot:icon>
					<IconDelete class="manager-item__icon" />
				</template>
			</ButtonIcon>
		</div>
	</div>
</template>

<script setup>
import ManagerAssigned from '@/components/ManagerAssigned.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import IconDelete from '@/assets/icons/close.svg?component';

const props = defineProps({
	// менеджер
	manager: {
		type: Object,
		required: true,
	},
	// Индикаторы кнопок
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

//Отображение крестика для удаления
const handleManagerClick = () => {
	props.indicators.isHandled = !props.indicators.isHandled;
};

// Открытие попапа для удаления
const handleManagerDeleteClick = (manager) => {
	props.indicators.isDelete = true;
	props.managerMod.managerId = manager.id;
};
</script>

<style scoped>
.manager-item__box {
	display: flex;
	user-select: none;
	padding: 7px 13px;
	border: 1px solid gray;
	border-radius: 20px;
	display: flex;
	transition: opacity 0.3s ease, background-color 0.3s ease; /* Добавили transition для background-color */
	cursor: pointer;
	align-items: center;
}
.manager-item__box:hover {
	background-color: #d3d3d3; /* Цвет при наведении */
}
.manager-item__icon {
	position: relative;
	margin-top: -9px;
	height: 12px;
	width: 12px;
	display: block;
}
.manager-item__btn {
	padding: 0 0 0 1px;
}
</style>
