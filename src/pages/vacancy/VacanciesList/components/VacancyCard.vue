<template>
  <div class="vacancy">
    <div class="vacancy__id">id: {{ vacancy.id }}</div>
    <div class="vacancy__name">{{ vacancy.name }}</div>

    <div class="vacancy__description">
      <div class="vacancy__status">
        <span v-if="vacancy.published === '1'" class="vacancy__status-style"
          >Опубликована
        </span>
        <span v-else class="vacancy__status-style-reject">Не опубликована</span>
      </div>

      <div class="vacancy__buttons">
        <RouterLink
          :to="{ name: 'candidates', query: { vacancyId: vacancy.id } }"
        >
          <ButtonMain class="vacancy__btn-responses" :align="'start'"
            ><template v-slot:text> Отклики </template>
          </ButtonMain>
        </RouterLink>

        <RouterLink
          :to="{ name: 'vacancy_edit', params: { id: vacancy.id } }"
          class="vacancy__btn-edit"
        >
          <ButtonIcon class="vacancy__btn-edit-btn">
            <template v-slot:icon>
              <EditIcon class="vacancy__btn-edit-icon" />
            </template>
          </ButtonIcon>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonMain from '@/components/ButtonMain.vue';
import EditIcon from '@/assets/icons/edit.svg?component';
import ButtonIcon from '@/components/ButtonIcon.vue';

const props = defineProps(['vacancy']);
</script>

<style scoped>
.vacancy {
  max-width: 300px;
  width: 100%;
  padding: 10px 30px 15px;
  height: 160px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vacancy__name {
  max-height: 40px;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
}

.vacancy__description {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.vacancy__status {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.vacancy__status-style {
  font-weight: 600;
  color: var(--success-color);
}

.vacancy__status-style-reject {
  font-weight: 600;
  color: var(--error-color);
}

.vacancy__id {
  text-align: end;
  margin: 0 -5% -4%;
  font-size: 13px;
  line-height: 22px;
  font-weight: 400;
}

.vacancy__buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  a {
    color: white;
    text-decoration: none;
  }
}

.vacancy__btn-edit {
  display: flex;
  margin-right: -5%;
}

.vacancy__btn-edit-btn {
  padding: 0;
}
</style>
