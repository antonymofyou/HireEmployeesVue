<template>
  <div class="manager-list__box">
    <div>Список Менеджеров: {{ managerList.length || 'менеджеры не заданы' }}</div>
  <div class="manager-list__item-box">
      <div
      class="manager-list__item"
      v-for="manager in managerList"
      :key="manager.id"
    >
      {{ manager.name }} 
    </div>
  </div>
  <!-- <ButtonIcon
                class="statuslist__list-btn"
                @click=""
              >
                <template v-slot:icon
                  ><IconDelete
                    class="statuslist__list-icon-delete"
                    :style="{
                      display:
                        indicators.activeTransfer &&
                        statusMod.name === status.statusName
                          ? 'block'
                          : 'none',
                    }"
                /></template>
              </ButtonIcon> -->
  </div>

</template>

<script setup>
import SelectMain from "@/components/SelectMain.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import IconAdd from "@/assets/icons/add.svg?component";
import IconEdit from "@/assets/icons/edit.svg?component";
import IconDelete from "@/assets/icons/close.svg?component";
import IconArrowSharp from "@/assets/icons/arrow-sharp.svg?component";
const props = defineProps({
  // Массив менеджеров
  managerList: {
    type: Array,
    required: true,
  },


/*   // Обработчик изменения статуса
  handleModification: {
    type: Function,
    required: true,
  }, */
});

 

</script>

<style scoped>
.manager-list__box{
  margin-top: 40px;
}
.manager-list__item-box{
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin: 10px 0;
}
.manager-list__item{
  margin-top: 10px;
  padding: 7px;
  border: 1px solid gray;
  border-radius: 10px;
  align-items: center;
  cursor: pointer;
}
</style>
