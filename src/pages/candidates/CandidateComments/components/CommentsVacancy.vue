<template>
  <div class="vacancy">
    <div class="vacancy__header">
      <h2 class="vacancy__header-title">
        Вакансия:
        <div class="vacancy__header-content">
          <span class="vacancy__header-text">{{ vacancyData.name }}</span>
          <span class="vacancy__header-id">&nbsp;(id{{ vacancyData.id }})</span>
        </div>
      </h2>
      <ButtonIcon @click="showVacancy"
        ><template #icon>
          <ArrowIcon
            :class="[
              'vacancy__header-arrowicon',
              { 'vacancy__header-arrowicon--active': show },
            ]"
          /> </template
      ></ButtonIcon>
    </div>

    <!-- Открытие/сокрытие вакансии -->
    <Transition v-if="show">
      <div class="vacancy__description">
        <h3 class="vacancy__description-title">Описание:</h3>
        <div
          class="vacancy__description-text"
          v-html="vacancyData.description"
        ></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ArrowIcon from '@/assets/icons/arrow.svg?component';
import ButtonIcon from '@/components/ButtonIcon.vue';

// Данные вакансии: id, название, описание
const props = defineProps({
  vacancyData: {
    type: Object,
    required: true,
  },
});

// Флаг показа вакансии
const show = ref(false);

// Показать/скрыть вакансию
const showVacancy = () => {
  show.value = !show.value;
};
</script>

<style scoped>
.vacancy {
  font-size: 15px;
}

.vacancy__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: max-content;
}

.vacancy__header-title {
  font-size: 16px;
  font-weight: 600;

  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 5px;
  margin: 0;

  overflow: hidden;
}

.vacancy__header-text {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  white-space: nowrap;
}

.vacancy__header-id {
  font-size: 12px;
  color: var(--tundora);
}

.vacancy__header-arrowicon {
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
}

@media screen and (max-width: 425px) {
  .vacancy__header-arrowicon {
    width: 25px;
    height: 25px;
  }
}

.vacancy__header-arrowicon--active {
  transform: rotateX(180deg);
}

.vacancy__description-title {
  font-size: 15px;

  margin: 0;
  margin-top: 15px;
  margin-bottom: -5px;
}

.vacancy__description-text {
  word-break: break-all;
  margin-top: 10px;
}
</style>
