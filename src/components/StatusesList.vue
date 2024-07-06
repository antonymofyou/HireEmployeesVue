<template>
    <div>
        <div class="statuses-list">
            <div v-for="status in savedData" :key="status.id">
                <Modal class="modal-status" @click.self="show = false" :show="status.id === selectedStatusId">
                    <!-- Отображение информации о выбранном статусе -->
                    <template class="modal-status__template" v-slot:body >
                        <div >
                            <div><h2>Название статуса</h2><p>{{ status.name }}</p></div>
                           <div><h2>Комментарий</h2><p>{{ status.comment }}</p></div>
                        </div>
                        <div class="modal-status__buttons"> 
                        <ButtonSimple class="button button--close" @click="selectedStatusId = null">
                                <template v-slot:text>
                                    Закрыть
                                </template>
                        </ButtonSimple>
                        <button @click="deleteStatus(status.id)" class="button button--delete">Удалить</button>
                        </div>
                    </template>
                </Modal>
                <div class="statuses-list__status" @click="selectedStatusId = status.id" :style="{ background: status.color }">
                    <p class="statuses-list__name">{{ status.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Modal from "./Modal.vue";
import ButtonSimple from "./ButtonSimple.vue";
import { ref } from "vue";




const selectedStatusId = ref(null);


const props = defineProps({
    savedData: {
        type: Array,
        required: true
    }
});

const status = ref(...savedData);


const deleteStatus = (statusId) => {
    const updatedData = props.savedData.filter(status => status.id !== statusId);
    // Обновляем локальную копию savedData
    props.savedData = updatedData;
}

</script>

<style scoped>
.statuses-list {
    display: inline;
    flex-direction: row;
}

.modal-status{
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
}

.modal-status__template{
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
    justify-content: center;
}

.statuses-list__name{
    text-align: center;
    user-select: none;
    cursor: pointer;
}

.modal-status__buttons{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
}

.button{
    transition: 0.3s ease-in-out;
}

.button:hover{
    scale: 1.1;
}

.button--delete{
    background: var(--cinnabar);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
</style>