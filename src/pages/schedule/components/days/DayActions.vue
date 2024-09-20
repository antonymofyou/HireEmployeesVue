<template>
  <div class="day-actions">
    <ButtonIcon
      v-if="props.isEditing"
      :form="props.formId"
      class="button-icon"
    >
      <template #icon>
        <SaveIcon
          class="button-icon__icon button-icon__icon--save"
        />
      </template>
    </ButtonIcon>

    <ButtonIcon
      v-else
      class="button-icon"
      @click="$emit('editClick')"
    >
      <template #icon>
        <EditIcon
          class="button-icon__icon"
        />
      </template>
    </ButtonIcon>

    <ButtonIcon
      class="button-icon"
      @click="$emit('deleteClick')"
    >
      <template #icon>
        <DeleteIcon
          class="button-icon__icon button-icon__icon--delete"
        />
      </template>
    </ButtonIcon>
  </div>
</template>

<script setup>
import ButtonIcon from '@/components/ButtonIcon.vue';

import EditIcon from '@/assets/icons/edit.svg?component';
import DeleteIcon from '@/assets/icons/delete.svg?component';
import SaveIcon from '@/assets/icons/save.svg?component';

const props = defineProps({
  // В процессе ли редактирования
  isEditing: {
    type: Boolean,
    required: false,
    default: false
  },
  // ID формы для связи кнопки сохранения изменений
  formId: {
    type: [String, null],
    required: false,
    default: null
  }
});

const emit = defineEmits(['editClick', 'deleteClick']);
</script>

<style scoped>
.day-actions {
  display: flex;
  gap: 10px;
}

.button-icon {
  padding: 0;
}

.button-icon:disabled {
  pointer-events: none;
}

.button-icon:not(:disabled) {
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
  
  &:active {
    opacity: 0.3;
  }
}

.button-icon__icon {
  width: 18px;
  height: 18px;
}

.button-icon__icon--save {
  transform: scale(1.3);
}

.button-icon__icon--delete {
  transform: scale(1.3);
}
</style>
