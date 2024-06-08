<template>
  <div class="vacancy">
    <div class="vacancy__id">id: {{ vacancy.id }}</div>
    <div class="vacancy__name">{{ vacancy.name }}</div>

    <div class="vacancy__description">
      <div class="vacancy__status">
        <span v-if="vacancy.published === '1'" class="vacancy__status-style"
          >Опубликована
        </span>
        <span v-else class="vacancy__status-style-reject">Не опубликована</span>
      </div>

      <div class="vacancy__buttons">
        <ButtonMain class="vacancy__btn" :align="'start'" @click="goToVacancy()"
          ><template v-slot:text>Отклики</template>
        </ButtonMain>
        <ButtonMain
          class="vacancy__btn"
          :align="'start'"
          @click="goToEditVacancy()"
          ><template v-slot:text>Редактировать</template>
        </ButtonMain>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import ButtonMain from "@/components/ButtonMain.vue";


const router = useRouter();
const props = defineProps(["vacancy"]);

function goToEditVacancy() {
  router.push({ name: "vacancy_edit", params: { id: props.vacancy.id } });
}

function goToVacancy() {
  router.push({ name: "candidates", query: { vacancyId: props.vacancy.id } });
}
</script>

<style scoped>
.vacancy {
  max-width: 300px;
  width: 100%;
  padding: 10px 30px 15px;
  height: 160px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vacancy__name {
  overflow: hidden;
  word-wrap: break-word;
  margin: 0;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
}

.vacancy__description {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.vacancy__status {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.vacancy__status-style {
  font-weight: 600;
  color: var(--success-color);
}

.vacancy__status-style-reject {
  font-weight: 600;
  color: var(--error-color);
}

.vacancy__id {
  text-align: end;
  margin: 0 -5% -4%;
  font-size: 13px;
  line-height: 22px;
  font-weight: 400;
}

.vacancy__buttons {
  display: flex;
  gap: 10px;
}
</style>
