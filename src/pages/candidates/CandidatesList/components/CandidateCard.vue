<template>
  <div class="candidate">
    <div class="candidate__box">
      <div class="candidate__description">
        <div class="candidate__name"><b>ФИО:</b> {{ candidate.fio }}</div>
        <div class="candidate__date"><b>Дата: </b><span class="candidate__date-text">{{ candidate.createdAt }}</span></div>
        <div class="candidate__id"><b>ID откл.:</b> {{ candidate.otklikId }}</div>
      </div>
      <div class="candidate__status"><StatusColored :status-text="candidate.status ?? ''" :status-color="candidate.statusColor ?? 'none'"></StatusColored></div>
      <div class="candidate__btn">
        <div>
          <RouterLink
            class="candidate__link"
            :to="{
              name: 'candidate',
              query: {
                otklikId: candidate.otklikId,
              },
            }"
          >
            <ButtonMain>
              <template v-slot:text> 
                <div class="button__triangle"></div>
              </template>
            </ButtonMain>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ButtonMain from '@/components/ButtonMain.vue';
import StatusColored from '@/components/StatusColored.vue';

const router = useRouter();

//Объявление пропсов
const props = defineProps({
  candidate: {
    type: Object,
    required: true,
  },
  vacancyId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.button__triangle {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #fff;
}
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

.candidate__date-text{
  font-size: 13px;
}

.candidate__box {
  display: flex;
  justify-content: flex-start;
  position: relative;
}

.candidate__description {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.candidate__id {
  font-size: 10px;
  margin-top: 5px;
}

.candidate__status, .candidate__btn{
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 10px;
}


.candidate__link {
  text-decoration: none;
}

@media screen and (max-width: 560px) {
  .candidate__box {
    flex-direction: column;
    gap: 5px;
  }
  .candidate__status, .candidate__btn {
    flex-direction: row;
  }
}
</style>
