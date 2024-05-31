<template>
  <article class="candidate">
    <div class="candidate__box">
      <div class="candidate__description">
        <div class="candidate__name"><b>ФИО:</b> {{ candidate.fio }}</div>
        <div class="candidate__date">
          <b>Дата отклика: </b>{{ candidate.createdAt }}
        </div>
      </div>
      <div class="candidate__status">{{ candidate.status }}</div>
      <div class="candidate__btn">
        <div class="candidate__id"><b>ID:</b> {{ candidate.candidateId }}</div>
        <ButtonSimple @click="goToCandidate()">
          <template v-slot:text>&#9658;</template>
        </ButtonSimple>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from "vue-router";
import ButtonSimple from "@/components/ButtonSimple.vue";

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
  router.push({ name: "candidate", query: { candidateId: props.candidate.candidateId } });
}
</script>

<style scoped>
.candidate {
  max-width: 90%;
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

</style>
