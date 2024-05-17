<template>
  <h1>CRM для найма сотрудников</h1>
  <div class="auth">
    <h2 class="auth__header">Войдите как менеджер</h2>
    <button class="managerAuth">Войти</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { onMounted } from 'vue'
//Используем роутер для перехода
const router = useRouter();
let button = null

onMounted(() => {
  
  //После монтирования компонента находим кнопку и вешаем событие
  button = document.querySelector('.managerAuth')
  console.log(button)
  if (button) {
    // Добавление обработчика клика по кнопке.
    button.onclick = () => {
      router.push({ name:'managerAuth'})
    }
  }
});

</script>

<style scoped></style>
