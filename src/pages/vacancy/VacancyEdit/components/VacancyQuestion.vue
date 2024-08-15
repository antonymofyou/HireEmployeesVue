<template>
  <div class="question">
    <TextEditor
      :modelValue="text"
      @update:modelValue="updateText"
      size="medium"
      :label="labelName"
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
      <button type="button" class="question__remove-btn" title="Удалить вопрос" @click="emit('updateShowModal', props.id)">
        <DeleteIcon class="icon"/>
      </button>
    </div>
    <div class="item__arrows">
      <button @click.stop="moveStatus('up')" :disabled="isFirst" class="arrow top" :class="{ 'disabled-class': isFirst }">
      </button>
      <button @click.stop="moveStatus('down')" :disabled="isLast" class="arrow bottom" :class="{ 'disabled-class': isLast }">
      </button>
    </div>
  </div>
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
  z-index: 10;
}

.question:hover .arrow {
  opacity: 1; 
}

.question__select {
  display: flex;
  align-items: baseline;
}

.question__label {
  font-weight: 600;
}

.question__footer {
  display: flex;
  justify-content: space-between;
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

.item__arrows {
  display: flex;
  position: absolute;
  left: -50px; 
}

.arrow {
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid black;
  border-width: 0 3px 3px 0;
  padding: 10px;
  cursor: pointer;
  opacity: 0; 
  transition: opacity 0.3s;
  
}

.arrow:hover {
  opacity: 1;
}

.disabled-class {
  display: none;
}

.top {
  position: absolute;
  bottom: 156px;
  transform: rotate(-135deg);
}

.bottom {
  position: absolute;
  top: -62px;
  transform: rotate(45deg);
}

@media (max-width: 1120px) {
  .item__arrows {
    display: flex;
    justify-content: end;
    width: 100%;
    z-index: 1;
    bottom: -5.5px;
  }

  .arrow {
    margin-right: 10px;
    opacity: 1; 
  }
  .bottom{
    position: relative;
    top: -13px;
  }
  .top{
    position: relative;
    top: 0;
  }
}
</style>