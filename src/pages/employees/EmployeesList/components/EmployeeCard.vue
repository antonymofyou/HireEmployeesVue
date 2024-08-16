<template>
   
    <div class="employee">
      <div class="employee__info">
        <div class="employee__name">{{ employee.name }}</div>
        <div class="employee__type">Роль: {{ employee.type }}</div>
        <div class="employee__VK">VK id: {{ employee.userVkId }}</div>
      </div>
        <div class="employee__buttons">
          <div class="employee__id">id: {{ employee.managerId }}</div>
          <RouterLink
              :to="{ }"
              class="employee__btn-edit"
            >
              <ButtonIcon class="employee__btn-edit-btn">
                <template v-slot:icon>
                  <EditIcon class="employee__btn-edit-icon" />
                </template>
              </ButtonIcon>
          </RouterLink>
          <ButtonIcon @click="">
          <template v-slot:icon>
            <IconDelete  />
          </template>
        </ButtonIcon>
        </div>
  </div>

</template>

<script setup>
/* requestEmployeesModification('delete', employee.managerId, [] )
 */
import ButtonIcon from '@/components/ButtonIcon.vue';
import SpinnerMain from '@/components/SpinnerMain.vue';
import EditIcon from '@/assets/icons/edit.svg?component';
import IconDelete from "@/assets/icons/close.svg?component";

const props = defineProps({
  // Existing prop
  employee: {},

  // New prop for indicators
  requestEmployeesModification: {
    type: Function,
    required: true,
  },
});
</script>

<style scoped>
.employee {
  display: flex;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  width: 100%;
  padding: 15px 30px 15px;
  height: 130px;
  justify-content: space-between;
}
.employee__info{
 
  justify-content: space-between;
  display: flex;
  flex-direction: column;

}
.employee__id{
  margin: 0 -5% -4%;
  font-size: 13px;
  line-height: 22px;
  font-weight: 400;
}
.employee__name{
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
}
.employee__buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}
.employee__btn-edit {
}
.employee__btn-edit-btn {
  padding: 0;
}
.employee__btn-delete{
  
}

</style>