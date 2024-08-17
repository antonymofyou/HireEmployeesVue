<template>
  <div class="employee">
    <div class="employee__id">id: {{ employee.managerId }}</div>
    <div class="employee__name">{{ employee.name }}</div>
    <div class="employee__type">Роль: {{ employee.type }}</div>
    <div class="employee__VK">VK id: {{ employee.userVkId }}</div>
    <div class="employee__buttons">
      <RouterLink
        class="employee__responses-link"
        :to="{
          name: 'employeeInfo',
          query: { employeeId: employee.managerId },
        }"
      >
        <ButtonMain :align="'start'"
          ><template v-slot:text> Подробнее </template>
        </ButtonMain>
      </RouterLink>
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
    </div>
  </div>
</template>

<script setup>
import ButtonIcon from "@/components/ButtonIcon.vue";
import EditIcon from "@/assets/icons/edit.svg?component";
import ButtonMain from "@/components/ButtonMain.vue";

const props = defineProps({
  employee: {},
});
</script>

<style scoped>
.employee {
  max-width: 300px;
  width: 100%;
  padding: 10px 30px 15px;
  height: 180px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.employee__id {
  text-align: end;
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
  font-weight: 600;
}
.employee__buttons {
  display: flex;
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
.employee__responses-link {
  text-decoration: none;
}
</style>
