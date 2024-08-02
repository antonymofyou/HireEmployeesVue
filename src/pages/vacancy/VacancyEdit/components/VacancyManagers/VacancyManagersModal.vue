<template>
	<Modal
		:show="indicators.isAdd || indicators.isDelete"
		@click.self="
			indicators.isAdd = false;
			indicators.isDelete = false;
			errorMessage.error = '';
		"
	>
		<template v-slot:header>
			<div>
				{{
					indicators.isAdd ? 'Добавить менеджера вакансии' : 'Удалить менеджера'
				}}
			</div>
		</template>

		<template v-slot:body>
			<SelectMain
				v-if="indicators.isAdd"
				class="manager-edit__modal-select"
				v-model="formData.id"
				:options="managerList"
			/>

			<ButtonMain
				class="manager-edit__modal-btn-add"
				@click="
					indicators.isAdd
						? requestManagersModification('create', formData.id)
						: requestManagersModification('delete', managerMod.managerId)
				"
				:isActive="request"
				:message="errorMessage.error"
			>
				<template v-slot:text>
					{{ indicators.isAdd ? 'Добавить' : 'Удалить' }}
				</template>
			</ButtonMain>
		</template>
	</Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import ButtonMain from '@/components/ButtonMain.vue';
import SelectMain from '@/components/SelectMain.vue';

const props = defineProps({
	// Создаваемый/изменяемый статус
	managerMod: {
		type: Object,
		required: true,
	},
	// Индикаторы
	indicators: {
		type: Object,
		required: true,
	},
	// Массив менеджеров
	managerList: {
		type: Array,
		required: true,
	},

	//Функция Добавления менеджера
	requestManagersModification: {
		type: Function,
		required: true,
	},
	// Сообщение об ошибке
	errorMessage: {
		type: Object,
		required: true,
	},
	// Флаг запроса
	request: {
		type: Boolean,
		default: false,
	},
	//Данные с SelectMain
	formData: {
		type: Object,
		required: true,
	},
});
</script>

<style scoped>
* {
	user-select: none;
}

.manager-edit__modal-select {
	align-self: center;
}
.manager-edit__modal-btn-add {
	align-self: center;
	margin-top: 20px;
	align-items: center;
}
</style>
