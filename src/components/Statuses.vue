<template>
    <!-- Кнопка открывающая модальное окно -->
    <button class="status__add-btn" @click="show = true"><img src="@/assets/icons/plus.svg" /></button>

    <div>
        <div class="modal__color-select__container">
            <!-- Закрытие модального окна по клику вне окна -->
            <Modal class="modal__color-select" @click.self="show = false" :show="show">
                <template class="modal__color-template" v-slot:header>
                    <div class="modal__color-text">Выберите статус</div>
                </template>
                <template class="modal__color-template" v-slot:body>
                    <div>
                        <InputSimple v-model="statusMod.name" id="statusEdit" inputType="input"
                            maxLength="20" 
                            placeholder="Название статуса" />
                    </div>

                    <div>
                        <InputSimple  v-model="statusMod.comment" 
                        id="statusEdit" 
                        inputType="textarea"
                        maxLength="60"
                        placeholder="Комментарий" />
                    </div>
                    <div class="modal__color-color">
                        <div>
                            <span>Цвет:</span>
                        </div>
                        <select class="modal__color-select-color" v-model="statusMod.color"
                            :style="{ backgroundColor: statusMod.color || '#a3a3a2', borderColor: statusMod.color || '#a3a3a2' }"
                            @change="changeColor">
                            <option v-for="color in colors" :value="color.value"
                                :style="{ backgroundColor: color.value }">
                                {{ color.name }}</option>
                        </select>
                    </div>
                </template>

                <template class="modal__color-template" v-slot:footer-control-buttons>
                    <div class="modal__color-buttons">
                        <ButtonSimple @click="addStatus">
                            <template v-slot:text>
                                Добавить статус
                            </template>
                        </ButtonSimple>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
    <StatusesList :savedData="savedData"/>
</template>

<script setup>
import Modal from "./Modal.vue";
import ButtonSimple from "./ButtonSimple.vue";
import InputSimple from "./InputSimple.vue";
import StatusesList  from "./StatusesList.vue";
import { ref } from "vue";

const show = ref(false);

const statusMod = ref({
  id: 0,
  action: 'create',
  name: '',
  toName: '',
  comment: '',
  color: '#a3a3a2',
});

const savedData = ref([]);

const colors = [
    {
        name: 'Серый',
        value: '#a3a3a2',
    },
    {
        name: 'Зеленый',
        value: '#66b36d',
    },
    {
        name: 'Желтый',
        value: '#FFD700',
    },
    {
        name: 'Красный',
        value: '#cf4c4c',
    },
    {
        name: 'Синий',
        value: '#6197d4',
    },
    {
        name: 'Фиолетовый',
        value: '#c67bd1',
    },
    {
        name: 'Оранжевый',
        value: '#e8983c',
    },
];

// Сохраняем выбранный цвет в статус для фона селекта
const changeColor = () => {
    const selectedColor = colors.find(color => color.name === statusMod.value.color);
    if (selectedColor) {
        statusMod.value = {
            color: selectedColor.value
        }
    }
}

const addStatus = () => {
    statusMod.value.id++;
    savedData.value.push({ ...statusMod.value });
    show.value = false;
};

</script>

<style scoped>
.modal__color-select__container{
    display: flex;
    width: 100%;
    flex-direction: row;
}

.status__add-btn {
    cursor: pointer;
    background: none;
    border-radius: 50%;
    border: 1px solid #000;
    padding: 5px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status__add-btn img {
    width: 1rem;
}

select {
    -webkit-appearance: none;
    /* Убираем стандартный стиль для WebKit (Safari, Chrome) */
    -moz-appearance: none;
    /* Убираем стандартный стиль для Firefox */
    appearance: none;
    /* Убираем стандартный стиль для других браузеров */
    background-image: none;
    /* Убираем фоновое изображение (обычно стрелку) */
    background-color: transparent;
    /* Делаем фон прозрачным */
    padding-right: 0;
    /* Убираем отступ справа */
}


.modal__color-select {
    display: flex;
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
}

.modal__color-text {
    font-weight: 300;
    font-size: 20px;
}

.modal__color-input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #a3a3a2;
    outline: 1px solid #9a9999;
    font-weight: 500;
    font-size: 16px;
}

.modal__color-input:focus {
    outline: 1px solid #9a9999;
    border: 1px solid var(--cornflower-blue);
}

.modal__color-input-comment {
    width: 100%;
    height: 80px;
    display: flex;
    resize: none;
}

.modal__color-color {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.modal__color-select-color {
    width: 100%;
    padding: 2px;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
}

.modal__color-select__container {
    display: flex;
    width: 300px;
}



.modal__color-buttons {
    width: 100%;
    justify-content: center;
    display: flex;
}
</style>