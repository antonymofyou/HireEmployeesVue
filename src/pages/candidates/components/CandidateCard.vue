<template>
    <article class="candidate">
      <div class="candidate__id">id: {{ candidate.candidateId }}</div>
      <div class="candidate__description">
        <div class="candidate__name">{{ candidate.fio }}</div>
        <div class="candidate__tg">Telegram никнейм: {{ candidate.tgNickname }}, ID: {{ candidate.tgId }}</div>
        <div class="candidate__date">Дата регистрации:{{ candidate.createdAt }}</div>
        <div class="candidate__btn">Ответить</div>
      </div>
    </article>
  </template>

  <script setup>
  //Объявление пропса
  const props = defineProps(["candidate"]);
  
  </script>
  
  <style scoped>

  </style>
  