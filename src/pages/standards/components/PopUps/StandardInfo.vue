<template>
  <Popup 
    :visibleClBtn="true" 
    @clPopup="closeMainPopUp" 
    class="result-popup"
  >
    <div v-if="!isLoaded" class="loader"><SpinnerMain style="width: 50px" /></div>
    <ErrorNotification v-else-if="isError" :message="errorMessage" />

    <div v-else class="popup-standard">
      <h3 class="popup-standard__title">
        {{ standardData.name }} 
        <span class="popup-standard__id">(id{{ standardData.id }})</span>
      </h3>
      <p v-if="standardData.process" class="popup-standard__subtitle">
        ({{ standardData.process }})
      </p>
      <div class="popup-standard__content">
        <IframeContent v-if="standardData.htmlDescription" :content="standardData.htmlDescription" class="editor-content popup-standard__description card" />
        <a v-if="standardData.link" class="popup-standard__link" :href="standardData.link" target="_blank">Ссылка</a>
        <iframe v-if="formattedLink" class="popup-standard__presentation" :src="formattedLink" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
      </div>

      <div class="popup-standard__meta">
        <p>Изменён: 
          <b>{{ formatDate(standardData.updatedAt) }}</b>
        </p>
        <p>Изучен: 
          <b :class="isLearnedAfterUpdate ? 'popup-standard__meta--learned-after' : 'popup-standard__meta--learned-before'">
            {{ standardData.learnedAt ? formatDate(standardData.learnedAt) : 'не изучен' }}
          </b>
        </p>
      </div>

      <div v-if="!isLearnedAfterUpdate" class="popup-standard__learn-btn">
        <ButtonCommon @click="toggleSetLearnedPopUp">
          <template v-slot:text>Отметить изученным</template>
        </ButtonCommon>
      </div>

      <div v-else class="popup-standard__learned-comment">
        <b>Как я понял измения:</b>
        <p class="popup-standard__comment-text">{{ standardData.learnedComment }}</p>
      </div>

      <Accordion 
        v-if="commentsData.length && standardData.canEdit" 
        :initial-value="commentsListActive"
        class="popup-standard__learned-comments-list card"
      >
        <template v-slot:title>
          <h4>Как поняли изменения</h4>
        </template>
        <template v-slot:content>
          <div class="popup-standard__comments">
            <template v-for="(comment, index) in commentsData">
              <UserComment
                :userName="comment.userName"
                :tgNick="comment.userTgNickname"
                :date="comment.learnedAt"
                :commentText="comment.learnedComment"
                :learnedCommentId="comment.learnedCommentId"
                :canEdit="comment.canEdit"
                @setCancelComment="setCancelComment"
              />
              <hr v-if="index < commentsData.length - 1" class="divider" />
            </template>
          </div>
        </template>
      </Accordion>

      <div v-if="standardData.canEdit" class="popup-standard__controls">
        <EditIcon @click="toggleMode" class="popup-standard__btn popup-standard__btn--edit" />
      </div>
    </div>
  </Popup>

  <SetStandardLearned 
    v-if="isOpenSetLearnedPopUp" 
    :standardId="id" 
    :closePopUp="toggleSetLearnedPopUp" 
    :updateStandard="updateStandardInfo" 
  />

  <CancelComment 
    v-if="isOpenCancelPopUp" 
    :commentId="commentIdForCancel" 
    :closePopUp="toggleCancelPopUp" 
    :updateStandard="updateStandardAfterCancel" 
  />

  <EditStandard 
    v-if="editMode" 
    :closePopUp="closeEdit" 
    :closeMainPopUp="closeMainPopUp" 
    :standardData="standardData"
    :updateStandards="updateStandards" 
    action="update" 
  />

</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import { GetStandardById, GetLearnedComments } from '../../js/StandardsApiClasses';
import Popup from '../UI/Popup.vue';
import ButtonCommon from '../UI/ButtonCommon.vue';
import Accordion from '@/components/Accordion.vue';
import EditIcon from '../../img/edit.svg?component';
import SpinnerMain from "@/components/SpinnerMain.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import UserComment from '../UserComment.vue';
import IframeContent from '../IframeContent.vue';
import SetStandardLearned from './SetStandardLearned.vue';
import CancelComment from './CancelComment.vue';
import EditStandard from './EditStandard.vue';

import '../TextEditor/css/editor-content.css';

// Id стандарта, функция закрытия попапа, функция обновления стандартов
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  closeMainPopUp: {
    type: Function,
    required: true,
  },
  updateStandards: {
    type: Function,
    required: true,
  },
})

// Загружены ли данные
const isLoaded = ref(false);
// Возникла ли ошибка при запросе
const isError = ref(false);
// Сообщение об ошибке
const errorMessage = ref('');

// Обработка ошибки
const handleError = (err) => {
  isLoaded.value = true;
  isError.value = true;
  errorMessage.value = err;
}

// Данные стандарта
const standardData = ref({});

// Данные комментариев
const commentsData = ref([]);

// Режим редактирования
const editMode = ref(false);
// Обработка закрытия попапа редактирования
const closeEdit = () => {
  handleGetStandard(toggleMode);
}
const toggleMode = () => editMode.value = !editMode.value;

// Попап установки стандарта изученным
const isOpenSetLearnedPopUp = ref(false);
const toggleSetLearnedPopUp = () => isOpenSetLearnedPopUp.value = !isOpenSetLearnedPopUp.value;

// Попап отмены комментария
const isOpenCancelPopUp = ref(false);
const toggleCancelPopUp = () => isOpenCancelPopUp.value = !isOpenCancelPopUp.value;

// Id комментария для отмены
const commentIdForCancel = ref('');

const setCancelComment = (commentId) => {
  commentIdForCancel.value = commentId;
  toggleCancelPopUp();
}

// Форматирование даты
const formatDate = (date) => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Форматирование ссылки
const formattedLink = computed(() => {
  const regex = /^(.*\/d\/[a-zA-Z0-9_-]+)(?:\/.*)?/;
  const match = standardData.value.link.match(regex);

  if (match && match[1]) {
    return `${match[1]}/preview`;
  }

  // Если ссылка не соответствует формату презентации
  return '';
});

// Изучен после последнего обновления?
const isLearnedAfterUpdate = computed(() => {
  if (standardData.value.learnedAt === '') return false;
  return Date.parse(standardData.value.learnedAt) > Date.parse(standardData.value.updatedAt);
});

// Обработка получения стандарта
const handleGetStandard = (successCallback = () => { }) => {
  getStandardFromServer(
    (response) => {
      if (response.success === '1') {
        standardData.value = response.standard;

        if (standardData.value.canEdit === '1') {
          // Если можно редактировать, получаем комментарии
          handleGetComments(() => {
            isLoaded.value = true;
            successCallback();
          });
        } else {
          isLoaded.value = true;
          successCallback();
        }
      } else {
        handleError(response.message);
      }
    }, (err) => handleError('Ошибка получения стандарта: ' + err));
}

// Обработка получения комментариев
const handleGetComments = (successCallback = () => { }) => {
  getCommentsFromServer((response) => {
    if (response.success === '1') {
      commentsData.value = response.comments;
      successCallback();
    } else {
      handleError(response.message);
    }
  }, (err) => handleError('Ошибка получения комментариев: ' + err));
}

// Получение стандарта с сервера
const getStandardFromServer = (response, reject) => {
  const requestInstance = new GetStandardById();
  requestInstance.standardId = props.id;

  requestInstance.request(
    '/standards/get_standard.php',
    'manager',
    response,
    reject,
  );
}

// Получение списка комментариев с сервера
const getCommentsFromServer = (response, reject) => {
  const requestInstance = new GetLearnedComments();
  requestInstance.standardId = props.id;

  requestInstance.request(
    '/standards/get_learned_comments.php',
    'manager',
    response,
    reject
  );
}

// Обновление стандарта
const updateStandardInfo = () => {
  isLoaded.value = false;
  props.updateStandards();
  handleGetStandard();
}

const commentsListActive = ref(false);

// Обновление стандарта после отмены комментария (для открытия аккордеона сразу после отмены)
const updateStandardAfterCancel = () => {
  updateStandardInfo();
  commentsListActive.value = true;
}

onMounted(() => handleGetStandard())
</script>
  
<style scoped>
.popup-standard__title {
  font-size: 18px;
  text-align: center;
  margin-top: -30px;
  word-break: break-word;
}

.popup-standard__subtitle {
  color: var(--tundora);
  text-align: center;
}

.loader {
  text-align: center;
}

.popup-standard__content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 16px;
  margin-top: 15px;
}

.popup-standard__id {
  color: var(--tundora);
  font-size: 11px;
}

.card {
  border: 1px solid var(--link-water);
  padding: 16px;
  border-radius: 16px;
}

.popup-standard__link {
  word-break: break-word;
}

.popup-standard__link:hover {
  text-decoration: underline;
}

.popup-standard__meta {
  margin-top: 30px;

}

.popup-standard__meta--learned-before {
  color: var(--cinnabar);
}

.popup-standard__meta--learned-after {
  color: var(--apple);
}

.popup-standard__controls {
  display: flex;
  gap: 5px;
  justify-content: end;
}

.popup-standard__btn {
  cursor: pointer;
  transition: 0.15s all;
}

.popup-standard__btn--edit:hover {
  color: var(--transparent-blue);
}

.popup-standard__btn--remove:hover {
  color: var(--cinnabar);
}

.popup-standard__learn-btn {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}

.popup-standard__learned-comment {
  display: flex;
  flex-direction: column;
  gap: 5px;

  margin-top: 30px;
}

.popup-standard__comment-text {
  white-space: pre-wrap;
}

.popup-standard__learned-comments-list {
  margin: 20px 0;
}

.popup-standard__comments {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.divider {
  border: none;
  border-top: 1px solid var(--light-gray);
}

.popup-standard__presentation {
  width: 100%;
  height: 464px;
  align-self: center;
}

@media screen and (max-width: 820px) {
  .popup-standard__presentation {
    width: calc(100% + 40px);
    aspect-ratio: 14.7 / 9;
    display: flex;
    flex: 1;
  }
}

@media screen and (max-width: 620px) {
  .popup-standard__presentation {
    aspect-ratio: 14.4 / 9;
  }
}

@media screen and (max-width: 440px) {
  .popup-standard__presentation {
    aspect-ratio: 13.7 / 9;
  }
}

@media screen and (max-width: 340px) {
  .popup-standard__presentation {
    aspect-ratio: 13.3 / 9;
  }
}
</style>