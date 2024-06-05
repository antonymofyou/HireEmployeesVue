<template>
  <div class="candidate">
    <div class="candidate__box">
      <div class="candidate__description">
        <span class="candidate__name"><b>ФИО:</b> {{ candidate.fio }}</span>
        <span class="candidate__date">
          <b>Дата отклика: </b>{{ candidate.createdAt }}
        </span>
      </div>
      <span class="candidate__status">{{ candidate.status }}</span>
      <div class="candidate__btn">
        <span class="candidate__id"
          ><b>ID:</b> {{ candidate.candidateId }}</span
        >
        <ButtonMain @click="goToCandidate()">
          <template v-slot:text>&#9658;</template>
        </ButtonMain>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ButtonMain from '@/components/ButtonMain.vue';

const router = useRouter();

//Объявление пропса
const props = defineProps({
  candidate: {
    type: Object,
    required: true,
  },
});

//Переход на карточку кандидата
function goToCandidate() {
  router.push({
    name: 'candidate',
    query: { candidateId: props.candidate.candidateId },
  });
}
</script>

<style scoped>
.candidate {
  width: 100%;
  padding: 15px 30px 15px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  font-size: 15px;
  font-weight: 400;
  overflow: hidden;
  word-wrap: break-word;
}

.candidate__box {
  display: flex;
  justify-content: space-between;
}

.candidate__description {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.candidate__id {
  text-align: end;
  font-size: 13px;
  line-height: 22px;
  font-weight: 400;
}

.candidate__status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--cornflower-blue);
}

.candidate__btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@media screen and (max-width: 560px) {
  .candidate__box {
    flex-direction: column;
    gap: 5px;
  }
  .candidate__btn {
    flex-direction: row;
  }
}
</style>
