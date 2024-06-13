<template>
  <div class="candidate">
    <div class="candidate__header">
      <h2>Информация о кандидате</h2>
    </div>

    <p v-if="mainErrorMessage" class="candidate__error">
      {{ mainErrorMessage }}
    </p>
    <template v-else>
      <div class="candidate__info">
        <p><b>ФИО:</b> Name Noname Nameovich</p>
        <p><b>Телеграм:</b> Test</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  // ID вакансии
  vacancyId: {
    type: String,
    required: true,
  },
  // ID кандидата
  candidateId: {
    type: String,
    required: true,
  },
});

// Сообщение об ошибках
const mainErrorMessage = ref('');
</script>

<style scoped></style>
