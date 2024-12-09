<template>
    <div class="didnt-learn-users-standards__list">
        <div class="didnt-learn-users-standards__item" v-for="(standards, standardId) in usersData">
            <h4 class="didnt-learn-users-standard__title" @click="() => pickStandard(standardId)">
                <PageIcon class="didnt-learn-users-standard__page-icon" width="13" height="13" />
                {{ standardsData[standardId].name }}
                <small>(изм. {{ standardsData[standardId].updatedAt }})</small>
                <span v-if="standardsData[standardId].process" class="didnt-learn-users-standard__process">
                    ({{ standardsData[standardId].process }})
                </span>
                <span class="didnt-learn-users-standard__id">id{{ standardId }}</span>
            </h4>

            <div class="didnt-learn-users-standard__users">
                <div v-for="user in standards" class="didnt-learn-users-standard__user">
                    {{ user.userName }} 
                    <a v-if="user.userTgNickname" target="_blank" :href="`https://t.me/${user.userTgNickname}`" class="user-link">tg</a>
                </div>
            </div>
        </div>

        <StandardInfo 
            v-if="pickedStandardId" 
            :id="pickedStandardId" 
            :closeMainPopUp="() => pickStandard('')"
            :updateStandards="updateStandards" 
        />
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import StandardInfo from './PopUps/StandardInfo.vue';
import PageIcon from '../img/page.svg?component';

// Массив пользователей, функция обновления стандартов
const props = defineProps({
    users: {
        type: Array,
        required: true,
    },
    updateStandards: {
        type: Function,
        required: true,
    },
});

// Форматирование даты
const formatDate = (date) => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', '');
}

// Данные стандартов
const standardsData = computed(() => props.users.reduce((acc, user) => {
    acc[user.standardId] ? '' : acc[user.standardId] = { 
      name: user.standardName, 
      process: user.standardProcess,
      updatedAt: formatDate(user.standardUpdatedAt),
    };
    return acc;
}, {}));

// Данные пользователей
const usersData = computed(() => props.users.reduce((acc, user) => {
    acc[user.standardId] ? acc[user.standardId].push(user) : acc[user.standardId] = [user];
    return acc;
}, {}));

// Выбранный стандарт
const pickedStandardId = ref('');
// Выбрать стандарт
const pickStandard = (id) => pickedStandardId.value = id;
</script>
  
<style scoped>
  .didnt-learn-users-standard__title {
    font-size: 16px;
    margin-bottom: 5px;
    cursor: pointer;
    word-break: break-word;
  }

  .didnt-learn-users-standard__title small {
    font-size: 12px;
  }
  
  .didnt-learn-users-standard__page-icon {
    flex-shrink: 0;
    vertical-align: middle;
    margin-bottom: 3px;
  }
  
  .didnt-learn-users-standard__process {
    color: var(--transparent-blue);
  }
  
  .didnt-learn-users-standard__id {
    font-size: 11px;
    margin-left: 3px;
  }
  
  .didnt-learn-users-standards__list {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 25px;
  }
  
  .didnt-learn-users-standards__item {
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }
  
  .didnt-learn-users-standard__users {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .didnt-learn-users-standard__user {
    width: max-content;
    padding: 4px 16px;
    border: 2px solid var(--transparent-blue);
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .user-link {
    color: var(--transparent-blue);
    font-size: 12px;
  }
  
  .user-link:hover {
    text-decoration: underline;
  }
  
  @media screen and (max-width: 500px) {
    .didnt-learn-users-standard__user {
      padding: 2px 8px;
      font-size: 13px;
    }
  
    .didnt-learn-users-standard__users {
      gap: 7px;
    }
  
    .didnt-learn-users-standards__list {
      gap: 15px;
    }
  }
  </style>