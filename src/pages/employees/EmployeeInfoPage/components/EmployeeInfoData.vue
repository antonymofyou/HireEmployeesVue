<template>
  <div class="info__box">
    <p class="info__info-title">Общая информация:</p>
    <div class="info__id"><b>id:</b> {{ employeeInfo.managerId }}</div>
    <div class="info__name"><b>Имя: </b>{{ employeeInfo.name }}</div>
    <div class="info__type"><b>Роль: </b> {{ employeeInfo.type }}</div>
    <div class="info__VK"><b>VK id: </b>{{ employeeInfo.userVkId }}</div>
    <div class="info__VK">
      <b>VK link: </b>
      <a
        class="employee__vk-link"
        :href="`https://vk.com/id${employeeInfo.userVkId}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://vk.com/id{{ employeeInfo.userVkId }}
      </a>
    </div>
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
