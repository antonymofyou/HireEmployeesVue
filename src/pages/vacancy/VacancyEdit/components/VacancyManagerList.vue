<template>
    <div>
        <div>Менеджеры: {{ managerList.managersAssigned.length || 'не назначены' }}</div>
        <div class="statuslist__list-box">
            <div 
            class="statuslist__list-items"
            v-for="manager in managerList.managersAssigned"
            :key="manager.name"
            >

            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  // Массив статусов
  managerList: {
    type: [Array, Object, Array],
    required: true,
  },
})

</script>

<style scoped>
.vacancy-edit__statuslist {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.statuslist__list-arrow {
  height: fit-content;
  display: flex;
  fill: black;
  width: 25px;
  height: 25px;
}

.statuslist__list-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.statuslist__list-items {
  display: flex;
  gap: 10px;
  align-items: center;
  user-select: none;
}

.statuslist__list-color {
  width: 10px;
  height: 10px;
  border-radius: 100%;
}

.statuslist__list-status {
  display: flex;
  cursor: pointer;
}

.statuslist__list-transfers {
  display: flex;
  gap: 5px;
  cursor: pointer;
}

.statuslist__list-transfers-box {
  display: flex;
  align-items: end;
  &::after {
    content: ',';
  }
  &:last-child::after {
    content: '';
  }
}

.statuslist__list-transfers-item {
  display: flex;
  padding: 5px;
  border-radius: 10px;
  color: white;
  padding: 7px 14px;
}

.statuslist__list-comment-tooltip {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  margin: 0;
  margin-top: -70px;
  margin-left: -3px;
  max-width: 200px;
  max-height: 100px;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  background-color: var(--cornflower-blue);
  color: var(--white);
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
}

.statuslist__list-comment {
  min-height: 25px;
  display: flex;
  align-items: center;
  color: white;
  border-radius: 10px;
  padding: 5px 12px;
}

.statuslist__list-comment:hover,
.statuslist__list-transfers-item:hover {
  .statuslist__list-comment-tooltip {
    visibility: visible;
  }
}

.statuslist__list-btn {
  display: flex;
  padding: 0;
  width: fit-content;
}

.statuslist__list-icon {
  align-self: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  &:hover {
    transform: scale(1.3);
  }
}

.statuslist__list-select {
  font-size: 13px;
  height: 20px;
}

.statuslist__list-icon-edit,
.statuslist__list-icon-delete {
  display: none;
  position: relative;
  margin: 0;
  margin-top: -15px;
  height: 12px;
  width: 12px;
  fill: white;
  &.active {
    display: block;
  }
}

.statuslist__list-icon-edit {
  margin-left: 5px;
}
</style>