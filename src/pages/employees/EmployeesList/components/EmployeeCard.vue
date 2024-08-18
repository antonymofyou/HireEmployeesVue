<template>
    <div  class="employee">
        <div class="employee__info">
          <div class="employee__name">
            {{ employee.name }}
            <a class="employee__vk-link" :href="`https://vk.com/id${employee.userVkId}`" target="_blank" rel="noopener noreferrer">
              https://vk.com/id{{ employee.userVkId }}
            </a>
          </div>          
          <div class="employee__type" :style="{ color: getColor(employee.type) }">
            {{ employee.type }} 
          </div>
        </div>
        <div class="employee__buttons">
          <div class="employee__id">
            <span :style="{ color: getColor(employee.type) }"> id: {{employee.managerId}}</span>   
          </div>
          <div class="employee__router-buttons">
            <RouterLink
            :to="{
              name: 'employeeEdit',
              query: { employeeId: employee.managerId },
            }"
            class="employee__btn-edit"
          >
            <ButtonIcon class="employee__btn-edit-btn">
              <template v-slot:icon>
                <EditIcon class="employee__btn-edit-icon" />
              </template>
            </ButtonIcon>
          </RouterLink>
          <RouterLink
             class="employee__btn-edit"
            :to="{
              name: 'employeeInfo',
              query: { employeeId: employee.managerId },
            }"
          >
            <ButtonMain class="employee__btn-edit-btn">
              <template v-slot:icon>
                <PersonIcon class="employee__btn-edit-icon" />
              </template>
            </ButtonMain>
          </RouterLink>

          </div>
          
        </div>
      </div>
</template>

<script setup>
import ButtonIcon from "@/components/ButtonIcon.vue";
import EditIcon from "@/assets/icons/edit.svg?component";
import ButtonMain from "@/components/ButtonMain.vue";
import PersonIcon from '@/assets/icons/person.svg?component';

const props = defineProps({
  employee: {},
});

const getColor = (type) => {
  switch (type) {
    case "Админ":
      return "green";
    case "Менеджер":
      return "#ff9044";
    case "Сотрудник":
      return "blue";
    default:
      return "black"; // Default color if type is unknown
  }
};
</script>

<style scoped>
.employee {
  max-width: 500px;
  width: 100%;
  padding: 10px 30px 15px;
  height: 80px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(112, 103, 103, 0.3);
  transition: box-shadow .2s;
  display: flex;
  justify-content: space-between;
  margin: auto;
  text-decoration: none;
  color: #111;
}
.employee__info{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.employee__id {
  margin: 0 -5% -4%;
  font-size: 13px;
  line-height: 22px;
  font-weight: 400;
}
.employee__name {
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 15px;
  line-height: 20px;
}
.employee__type{
  font-size: 15px;
  line-height: 20px;
}
.employee__vk-link{
  text-decoration: none;
  font-size: 14px;
  color: blue;
}
.employee__vk-link:hover{
  text-decoration: underline;
}
.employee__buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}
.employee__btn-edit {
  display: flex;
  margin-right: -5%;
}
.employee__btn-edit-btn {
  padding: 0;
}
.employee:hover{
  box-shadow: 0 5px 20px rgba(112, 103, 103, 0.5);
}
.employee__type[data-type="Админ"] {
  color: red;
}

.employee__type[data-type="Менеджер"] {
  color: blue;
}

.employee__type[data-type="Сотрудник"] {
  color: green;
}
.button__triangle {

}
.employee__router-buttons{
  display: flex;
  gap: 10px;
}
</style>
