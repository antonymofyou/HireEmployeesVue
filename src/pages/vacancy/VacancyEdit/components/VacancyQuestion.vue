<template>
  <transition-group name="move" tag="div" class="question">
    <div :key="props.id">
      <div class="questions__block">
        <span class="questions">{{ props.labelName }}</span>
        <span class="id_questions">Id{{ props.id }}</span>
      </div>
      <TextEditor
      :modelValue="text"
      @update:modelValue="updateText"
      size="medium"
      :id="props.id"
    />
    <div class="question__footer">
      <div class="question__select">
        <span class="question__label">Опубликован:</span>
        <SelectMain
          :modelValue="isPublished"
          @update:modelValue="updateIsPublished"
          :options="options"
        />
      </div>
      <div class="item__arrows">
        <button type="button" class="question__up" @click.stop="moveStatus('up')" :disabled="isFirst" :class="{ 'disabled-class': isFirst }">
          <svg class="arrow-top" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z" />
          </svg>
        </button>
        <button type="button" class="question__bottom" @click.stop="moveStatus('down')" :disabled="isLast" :class="{ 'disabled-class': isLast }">
          <svg class="arrow-bottom" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z" />
          </svg>
        </button>
      </div>
      <button type="button" class="question__remove-btn" title="Удалить вопрос" @click="emit('updateShowModal', props.id)">
        <DeleteIcon class="icon"/>
      </button>
    </div>
    </div>
</transition-group>
</template>

<script setup>
import SelectMain from '@/components/SelectMain.vue';
import { ref, computed, watch, onMounted } from 'vue';
import TextEditor from "@/components/TextEditor.vue";
import DeleteIcon from '@/assets/icons/delete.svg?component';

/* id вопроса, текст вопроса, опции для измнения статуса публикации, статус публикации вопроса, 
имя лейбла */
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  isPublished: {
    type: String,
    required: false,
    default: 0,
  },
  labelName: {
    type: String,
    required: false,
    default: 'Вопрос',
  },
  formData: {
    type: Array,
    required: true
  },
  requestSortVacancyStatus: {
    type: Function,
    required: true
  },
  vacancyId: {
    type: String,
    required: true
  }
});

// Значения вопроса (текст и статус публикации)
const text = ref(props.text);
const isPublished = ref(props.isPublished);

const isFirst = computed(() =>{
  const index = props.formData.findIndex(item => item.id === props.id);
  return index === 0
})
const isLast = computed(() =>{
  const index = props.formData.findIndex(item => item.id === props.id)
  return index === props.formData.length - 1
})

const moveStatus = (direction) =>{
  const movement = direction === "up" ? -1 : 1

  props.requestSortVacancyStatus(props.vacancyId, props.id, movement)
}

// Обновление данных в родителе
const emit = defineEmits(['updateText', 'updateIsPublished', 'updateShowModal']);

// Обновление текста
const updateText = (newValue) => {
  text.value = newValue;
  emit('updateText', newValue);
};

// Обновление статуса публикации
const updateIsPublished = (newValue) => {
  isPublished.value = newValue;
  emit('updateIsPublished', newValue);
};


</script>

<style scoped>
.question {
  position: relative;
  display: flex;
  align-items: flex-start;
  z-index: 1;
}

.question__select {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}

.questions__block{
  margin-bottom: 10px;
}

.questions {
  margin-bottom: 10px;
  font-weight: 600;
}

.id_questions{
  margin-left: 5px;
  font-size: 8px;
  font-weight: 600; 
  color: gray;
}

.question__label {
  font-weight: 600;
  z-index: 99999;
}

.question__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}
.question__remove-btn {
  background-size: 100% 100%;
  background-color: transparent;
  width: 20px;
  height: 30px;
  border: 0;
  cursor: pointer;
  display: flex;
  justify-content: center; 
  align-items: center;
}

.question__footer .icon {
  transform: scale(2.1);
}

.question__up,
.question__bottom{
  background-color: transparent;
  border: none;
}

.item__arrows {
  display: flex;
  justify-content: end;
  margin-left: auto;
  margin-right: 30px;
  gap: 28px;
}

.arrow-top,
.arrow-bottom {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.disabled-class {
  display: none;
}

.arrow-top {
    transform: rotate(270deg);
}

.arrow-bottom {
    transform: rotate(90deg);
}

.move-enter-active, .move-leave-active, .move-move{
  transition: all 0.5s ease
}

.move-enter, .move-leave-to{
  opacity: 0;
  transform: (translateY(30px));
}

.move-enter-to, .move-leave{
  opacity: 1;
  transform: (translateY(0));
}

</style>