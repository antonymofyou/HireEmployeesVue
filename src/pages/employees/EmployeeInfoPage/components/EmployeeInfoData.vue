<template>
  <div class="info__box">
    <p class="info__info-title">Общая информация:</p>
    <div class="info__id">id: {{ employeeInfo.managerId }}</div>
    <div class="info__name">{{ employeeInfo.name }}</div>
    <div class="info__type">Роль: {{ employeeInfo.type }}</div>
    <div class="info__VK">VK id: {{ employeeInfo.userVkId }}</div>
  </div>
  <div class="info__box">
    <p class="info__info-title">Информация из Vk:</p>
  </div>
</template>

<script setup>
const props = defineProps({
  // информации о сотруднике
  employeeInfo: {},
});
</script>

<style scoped>
.info__box {
  border: 1px solid blue;
  border-radius: 10px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}
.info__info-title {
  font-weight: 600;
  font-size: medium;
  margin: 0;
}
</style>
