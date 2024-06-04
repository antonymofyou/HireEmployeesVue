<script setup>
import { computed } from "vue";

const props = defineProps({
  updatedAt: String,
  createdAt: String,
});

// Форматирование даты под RU локаль
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString("ru-RU")} ${d.toLocaleTimeString("ru-RU")}`;
};

// Если даты создания и изменения совпадают - отображаем дату создания, иначе отображаем дату изменения и пометку "изменено"
const formattedDate = computed(() => {
  const createdAt = formatDate(props.createdAt);
  const updatedAt = formatDate(props.updatedAt);
  return createdAt === updatedAt ? createdAt : `${updatedAt} (изменено)`;
});
</script>

<template>
  <div class="comment">
    <p class="comment__date">{{ formattedDate }}</p>
    <p class="comment__text">
      <slot></slot>
    </p>
  </div>
</template>

<style scoped>
.comment {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  background-color: var(--white);
}

.comment__date,
.comment__text {
  margin: 0;
}

.comment__text {
  font-size: 16px;
}

.comment__date {
  font-size: 10px;
}
</style>
