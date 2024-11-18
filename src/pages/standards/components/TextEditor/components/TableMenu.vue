<template>
  <div
    class="table-button-container"
    @mouseenter="showTableMenuNow"
    @mouseleave="hideTableMenuWithDelay"
  >
    <button class="table-button">
      <TableIcon />
    </button>
    <div
      v-if="showTableMenu"
      @mouseenter="clearHideTableMenuTimeout"
      @mouseleave="hideTableMenuWithDelay"
      class="table-menu"
    >
      <button
        v-for="(action, name) in tableActions"
        :key="name"
        @click="action"
        class="table-menu-btn"
      >
        {{ actionNames[name] }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import TableIcon from 'vue-material-design-icons/Table.vue';

// Объект редактора
const editor = inject('editor')

// Управление показом/скрытием меню таблицы
const showTableMenu = ref(false);
let hideMenuTimeout = null;

const showTableMenuNow = () => {
  clearHideTableMenuTimeout();
  showTableMenu.value = true;
}

const hideTableMenuWithDelay = () => {
  hideMenuTimeout = setTimeout(() => {
    showTableMenu.value = false;
  }, 200);
}

const clearHideTableMenuTimeout = () => {
  if (hideMenuTimeout) {
    clearTimeout(hideMenuTimeout);
    hideMenuTimeout = null;
  }
}

// Действия с таблицей
const tableActions = {
  insertTable: () => {
    editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    showTableMenu.value = false;
  },
  addRowBefore: () => {
    editor.value.chain().focus().addRowBefore().run();
    showTableMenu.value = false;
  },
  addRowAfter: () => {
    editor.value.chain().focus().addRowAfter().run();
    showTableMenu.value = false;
  },
  addColumnBefore: () => {
    editor.value.chain().focus().addColumnBefore().run();
    showTableMenu.value = false;
  },
  addColumnAfter: () => {
    editor.value.chain().focus().addColumnAfter().run();
    showTableMenu.value = false;
  },
  mergeOrSplit: () => {
    editor.value.chain().focus().mergeOrSplit().run();
    showTableMenu.value = false;
  },
  deleteRow: () => {
    editor.value.chain().focus().deleteRow().run();
    showTableMenu.value = false;
  },
  deleteColumn: () => {
    editor.value.chain().focus().deleteColumn().run();
    showTableMenu.value = false;
  },
  deleteTable: () => {
    editor.value.chain().focus().deleteTable().run();
    showTableMenu.value = false;
  },
}

// Названия действий
const actionNames = {
  insertTable: 'Вставить таблицу',
  addRowBefore: 'Добавить строку выше',
  addRowAfter: 'Добавить строку ниже',
  addColumnBefore: 'Добавить столбец слева',
  addColumnAfter: 'Добавить столбец справа',
  mergeOrSplit: 'Объединить / разъединить',
  deleteRow: 'Удалить строку',
  deleteColumn: 'Удалить столбец',
  deleteTable: 'Удалить таблицу',
}
</script>

<style scoped>
.table-button-container {
  position: relative;
  display: inline-block;
}

.table-button {
  width: 32px;
  height: 32px;
  padding: 4px;
  background: none;
  border: none;
  color: var(--tundora);
  margin: 0;
  cursor: pointer;
  transition: all .15s ease-in-out;
}

.table-button:hover {
  background: var(--light-gray);
  color: var(--shark);
}

.table-menu {
  position: absolute;
  background-color: var(--white);
  border: 1px solid var(--tundora);
  z-index: 10;
  top: 100%;
  left: 0;
  padding: 5px 0;
  width: 150px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5)
}

.table-menu-btn {
  display: block;
  width: 100%;
  padding: 5px 15px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
}

.table-menu-btn:hover {
  background-color: var(--tundora);
}
</style>