<template>
    <div class="process">
        <div class="process__header">
            <button class="process__more-btn" @click="toggleOpen">
                <ArrowIcon class="process__arrow" :class="{ 'process__arrow--active': isOpen }" />
            </button>
            <div class="process__content">
                <span class="process__name" @click="toggleOpen">{{ processName }}</span>
                <UserIcon v-if="process[0].canEdit !== '0'" class="process__edit-icon" @click="() => pickProcess(processName)" />
            </div>
        </div>
        <div class="process__standards" ref="accordionBody">
            <div v-for="standard in process" @click="() => pickStandard(standard.id)" class="process__standard-item">
                <PageIcon class="process__standard-page-icon" width="13" height="13" />
                <span>{{ standard.name ? standard.name : `id${standard.id}` }}</span>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, nextTick, watch } from 'vue';
import ArrowIcon from '../img/arrow.svg?component';
import UserIcon from '../img/user.svg?component';
import PageIcon from '../img/page.svg?component';

// Массив процесса (стандарты, входящие в процесс), название процесса, функция выбора стандарта
const props = defineProps({
    process: {
        type: Array,
        required: true,
    },
    processName: {
        type: String,
        required: true,
    },
    pickStandard: {
        type: Function,
        required: true,
    },
    pickProcess: {
        type: Function,
        required: true,
    },
});

// Статус процесса (развернут или скрыт)
const isOpen = ref(false);
// Ссылка на тело аккордеона
const accordionBody = ref(null);

// Изменение состояния активности аккордеона процесса
const toggleOpen = () => {
    isOpen.value = !isOpen.value;

    nextTick(() => {
        if (isOpen.value) {
            accordionBody.value.style.maxHeight = `${accordionBody.value.scrollHeight}px`;
        } else {
            accordionBody.value.style.maxHeight = '0';
        }
    })
}

watch(() => props.process, () => {
    // Если аккордеон открыт, пересчитываем его высоту
    if (isOpen.value) {
        nextTick(() => {
            accordionBody.value.style.maxHeight = `${accordionBody.value.scrollHeight}px`;
        });
    }
});
</script>
  
<style scoped>
.process__header {
    display: flex;
    align-items: baseline;
    gap: 7px;
    word-break: break-word;
    cursor: pointer;
}

.process__more-btn {
    background: none;
    outline: 0;
    border: none;
    color: inherit;
    cursor: pointer;
}

.process__more-btn:hover {
    color: var(--transparent-blue);
}

.process__arrow {
    width: 10px;
    height: 10px;
    transition: all 0.1s;
}

.process__arrow--active {
    transform: rotate(90deg);
}

.process__content {
    display: flex;
    align-items: center;
    gap: 5px;
}

.process__edit-icon {
    width: 18px;
    height: 18px;
    transition: 0.15s all;
    flex-shrink: 0;
}

.process__edit-icon:hover {
    color: var(--transparent-blue);
}

.process__name {
    font-size: 16px;
    font-weight: 700;
    color: var(--transparent-blue)
}

.process__standards {
    font-size: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    margin-top: 5px;
    padding-left: 24px;

    overflow: hidden;
    max-height: 0;
    transition: all 0.5s;
}

.process__standard-item {
    display: flex;
    gap: 5px;
    cursor: pointer;
    transition: 0.1s all;
    line-height: 1;
    word-break: break-word;
}

.process__standard-item:hover {
    color: var(--transparent-blue);
}

.process__standard-page-icon {
    flex-shrink: 0;
}
</style>