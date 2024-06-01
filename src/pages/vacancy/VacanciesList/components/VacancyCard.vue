<template>
  <article class="vacancy">
    <div class="vacancy__id">id: {{ vacancy.id }}</div>
    <div class="vacancy__name">{{ vacancy.name }}</div>

    <div class="vacancy__description">
      <div class="vacancy__status">
        <span v-if="vacancy.published === '1'" class="vacancy__status-style"
          >Опубликована
        </span>
        <span v-else class="vacancy__status-style-reject">Не опубликована</span>
      </div>
      <div class="vacancy__btn" @click="goToEditVacancy()">Редактировать</div>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps(['vacancy']);

function goToEditVacancy() {
  router.push('/vacancy_edit/' + props.vacancy.id);
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
  line-height: 28px;
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

.vacancy__btn {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  background-color: var(--transparent-blue);
  padding: 5px;
  border-radius: 5px;
  color: var(--white);
  text-align: center;
  padding: 5px;
  border: 0;
  cursor: pointer;
}
</style>
