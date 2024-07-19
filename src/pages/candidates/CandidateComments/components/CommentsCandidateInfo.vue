<template>
  <div class="candidate-info">
    <h2 class="candidate-info__title">Кандидат</h2>
    <div class="candidate-info__content">
      <div><b>ФИО: </b>{{ fio }}</div>
      <div>
        <b>Телеграм: </b>
        <a target="_blank" :href="`https://t.me/${tgNickname}`">{{ tgNickname }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
// ФИО, Телеграм кандидата
const props = defineProps({
  fio: {
    type: String,
    required: true,
  },
  tgNickname: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.candidate-info {
  font-size: 14px;
}

.candidate-info__title {
  font-size: 16px;
  font-weight: 600;

  margin-top: 10px;
  margin-bottom: 15px;
}

.questions-universal__question {
  margin-bottom: 20px;
}

.candidate-info__content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 5px 0;
}
</style>