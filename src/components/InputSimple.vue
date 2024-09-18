<template>
  <div class="input">
    <label v-if="labelName"
      class="input__label" 
      :class="labelClass"
      :for="id"
    >
      {{ labelName }}: 
    </label>
    <component
      v-bind="$attrs"
      :is="inputType"
      :class="inputClass"
      :id="id"
      :value="props.modelValue"
      :placeholder="placeholder"
      class="input__field"
      ref="inputRef"
      @input="updateModelValue($event.target.value)"
    />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';

/* Модель для обновления, тип инпута (input или textarea), id инпута для связи с label,
имя label, жирный ли текст инпута, жирный ли label, размер инпута */
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    default: 'input',
    validator: (value) => {
      return ['input', 'textarea'].indexOf(value) !== -1;
    },
  },
  id: {
    type: String,
  },
  labelName: {
    type: String,
  },
  isLabelBold: {
    type: Boolean,
    default: false,
  },
  isTextBold: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'small',
  },
  placeholder: {
    type: String,
  },
});

// Обновление селекта в родителе
const emit = defineEmits(['update:modelValue']);

/**
 * Обработчик ввода в инпут
 * @param {String} value - Вводимое значение
 */
const updateModelValue = (value) => {
  emit('update:modelValue', value);
};

// Опциональные классы для инпута
const inputClass = computed(() => ({
  'input__field--textarea': props.inputType === 'textarea',
  'input__field--bold': props.isTextBold,
  'input__field--medium': props.size === 'medium',
  'input__field--extra-medium': props.size === 'extra-medium',
  'input__field--big':  props.size === 'big',
}));

// Опциональные классы для лейбла
const labelClass = computed(() => ({
  'input__label--bold': props.isLabelBold,
}))
</script>

<style scoped>
.input__label {
  display: block;
  margin-bottom: 10px;
}

.input__label--bold {
  font-weight: 600;
}

.input__field {
  font-size: 16px;
  line-height: 22px;

  box-sizing: border-box;
  width: 100%;
  padding: 12px;

  border: 0;
  border-radius: 10px;
  outline: 1px solid #9a9999;
}

.input__field:focus {
  outline: 2px solid rgba(0, 0, 252, .6);
}

.input__field:disabled {
  background: rgb(243, 243, 243);
}

.input__field--bold {
  font-weight: 600;
}

.input__field--textarea {
  resize: none;
}

.input__field--medium {
  height: 85px;
}

.input__field--extra-medium {
  height: 150px;
}

.input__field--big {
  height: 250px;
}
</style>