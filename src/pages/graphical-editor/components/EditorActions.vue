<template>
  <div class="actions">
    <div class="actions__item">
      <span class="actions__item-title">Добавление / Удаление</span>

      <div>
        <button
          class="button"
          @click="props.toggleSelectingNewShape"
        >
          {{ props.isNewShapeSelecting ? 'Прекратить выбор' : 'Добавить фигуру' }}
        </button>
        <button
          class="button"
          :disabled="!props.selectedShape || !props.isAllowedToAddText"
          @click="props.addTextToSelectedShape"
        >
          Добавить текст
        </button>
        <button
          class="button"
          @click="props.deleteActiveShape"
          :disabled="!Boolean(selectedShape)"
        >
          Удалить
        </button>
      </div>

      <div class="select-shape" v-show="isNewShapeSelecting">
        <button
          class="button"
          :disabled="props.currentDrawingShape === 'rect'"
          @click="props.addNewShape('rect')"
        >
          Rect
        </button>
        <button
          class="button"
          :disabled="props.currentDrawingShape === 'circle'"
          @click="props.addNewShape('circle')"
        >
          Circle
        </button>
        <button 
          class="button"
          :disabled="props.currentDrawingShape === 'arrow'"
          @click="props.addNewShape('arrow')"
        >
          Arrow
        </button>
        <button
          class="button"
          :disabled="props.currentDrawingShape === 'image'"
          @click="props.addNewShape('image')"
        >
          Image
        </button>
      </div>
    </div>

    <!-- Манипуляции с холстом -->
    <div class="actions__item">
      <span class="actions__item-title">Операции над холстом</span>

      <div>
        <button
          class="button"
          @click="props.resetScaleCanvas"
        >
          Сбросить масштабирование
        </button>
        <button
          class="button"
          @click="props.resetTransformCanvas"
        >
          Вернуться к 0;0
        </button>
      </div>
    </div>

    <!-- Манипуляции с цветом выбранной фигуры -->
    <div class="actions__item" v-show="props.isColorsActionsVisible">
      <span class="actions__item-title">Цвета</span>

      <div>
        <div class="action">
          <label>
            Основной цвет: <b>(fill)</b>
            <input
              type="color"
              :value="props.selectedShape?.fill()"
              @input="handlers.onFillInput"
              @change="handlers.onFillChange"
            />
          </label>
        </div>

        <div class="action">
          <label>
            Цвет границ: <b>(stroke)</b>
            <input
              type="color"
              :value="props.selectedShape?.stroke()"
              @input="handlers.onStrokeInput"
              @change="handlers.onStrokeChange"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Манипуляции с углами выбранной фигуры -->
    <div class="actions__item" v-show="isCornerActionsVisible">
      <span class="actions__item-title">Углы</span>

      <label>
        Скругление:
        <input
          v-only-numeric
          type="number"
          :min="0"
          :value="props.selectedShape?.cornerRadius?.()"
          @input="handlers.onCornerRadiusInput"
          @change="handlers.onCornerRadiusChange"
        />
      </label>
    </div>

    <!-- Манипуляции с фигурами выбранной фигуры -->
    <div class="actions__item" v-show="isBoundariesActionsVisible">
      <span class="actions__item-title">Границы</span>

      <label>
        Ширина:
        <input
          v-only-numeric
          type="number"
          :min="0"
          :value="props.selectedShape?.strokeWidth()"
          @input="handlers.onStrokeWidthInput"
          @change="handlers.onStrokeWidthChange"
        />
      </label>
    </div>
  </div>
</template>

<script setup>
import { data } from '../js/mock';
import { computed } from 'vue';

const props = defineProps({
  toggleSelectingNewShape: {
    type: Function,
    required: true,
  },
  isNewShapeSelecting: {
    type: Boolean,
    required: true,
  },
  selectedShape: {
    type: [Object, null],
    required: true,
  },
  isAllowedToAddText: {
    type: Boolean,
    required: true,
  },
  addTextToSelectedShape: {
    type: Function,
    required: true,
  },
  deleteActiveShape: {
    type: Function,
    required: true
  },
  currentDrawingShape: {
    type: [String, null],
    required: true,
  },
  addNewShape: {
    type: Function,
    required: true,
  },
  resetScaleCanvas: {
    type: Function,
    required: true,
  },
  resetTransformCanvas: {
    type: Function,
    required: true,
  },
  isActionsVisible: {
    type: Boolean,
    required: true,
  },
  isColorsActionsVisible: {
    type: Boolean,
    required: true,
  },
  isBoundariesActionsVisible: {
    type: Boolean,
    required: true,
  },
  isCornerActionsVisible: {
    type: Boolean,
    required: true,
  },
});

const currentShapeNode = computed(() => {
  const findShape = data.shapes.find((existShape) => {
    return existShape.id === props.selectedShape.attrs.id;
  });
  return findShape;
});

// Обработчики различных инпутов
const handlers = {
  /**
   * Обработчик изменения заливки (на input)
   * @param {Event} e - Событие
   */
  onFillInput: (e) => {
    props.selectedShape?.fill(e.target.value);
  },
  /**
   * Обработчик изменения заливки (на change)
   * Тут меняем состояние, для оптимизации - только в конце ввода
   * @param {Event} e - Событие
   */
  onFillChange: (e) => {
    if (!currentShapeNode.value) return;
    currentShapeNode.value.color = e.target.value;
  },
  /**
   * Обработчик изменения заливки (на input)
   * @param {Event} e - Событие
   */
  onStrokeInput: (e) => {
    props.selectedShape?.stroke(e.target.value);
  },
  /**
   * Обработчик изменения обводки (на change)
   * Тут меняем состояние, для оптимизации - только в конце ввода
   * @param {Event} e - Событие
   */
  onStrokeChange: (e) => { 
    if (!currentShapeNode.value) return;
    currentShapeNode.value.borderColor = e.target.value;
  },
  /**
   * Обработчик изменения скругления углов (на input)
   * @param {Event} e - Событие
   */
  onCornerRadiusInput: (e) => {
    props.selectedShape?.cornerRadius?.(Number(e.target.value));
  },
  /**
   * Обработчик изменения скругления углов (на change)
   * Тут меняем состояние, для оптимизации - только в конце ввода
   * @param {Event} e - Событие
   */
  onCornerRadiusChange: (e) => {
    if (!currentShapeNode.value) return;
    currentShapeNode.value.cornerRadius = (Number(e.target.value));
  },
  /**
   * Обработчик изменения ширины границы (на input)
   * @param {Event} e - Событие
   */
  onStrokeWidthInput: (e) => {
    props.selectedShape?.strokeWidth?.(Number(e.target.value))
  },
  /**
   * 
   * Обработчик изменения ширины границы (на input)
   * Тут меняем состояние, для оптимизации - только в конце ввода
   * @param {Event} e - Событие
   */
  onStrokeWidthChange: (e) => {
    if (!currentShapeNode.value) return;
    currentShapeNode.value.borderWidth = (Number(e.target.value));
  },
};

// Директива, позволяющая вводить в <input type="number" /> только numeric-значения
const vOnlyNumeric = {
  mounted(el) {
    /**
     * Запрещаем пользователю вставлять неверные значения
     * @param {ClipboardEvent} e Событие
     */
    const pasteHandler = (e) => {
      // Берём вставляемое значение
      const pastedText = e.clipboardData.getData('text');
      // Если пользователь вставляет не число или число отрицательное - не разрешаем
      if (!isFinite(pastedText) || parseFloat(pastedText) < 0) e.preventDefault();
    };

    /**
     * Запрещаем вводить неверные значения
     * @param {KeyboardEvent} e Событие
     */
    const keyDownHandler = (e) => {
      const charCode = (e.which) ? e.which : e.keyCode;

      // Разрешаем ctrl + a
      if ((e.ctrlKey || e.metaKey) && charCode === 65) return;

      // Не разрешаем не числовые символы
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46)
        e.preventDefault();
    };

    el.onpaste = pasteHandler;
    el.onkeydown = keyDownHandler;
  },
  // Чистим обработчики для избежания утечек памяти
  unmounted(el) {
    el.onpaste = null;
    el.onkeydown = null;
  },
};
</script>

<style scoped>
.actions__colors {
  display: flex;
  column-gap: 30px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  column-gap: 50px;
  row-gap: 20px;
  accent-color: var(--cornflower-blue);
}

.actions__item {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.actions__item-title {
  font-size: 20px;
  font-weight: 800;
}

.button {
  padding: 5px 15px;
  cursor: pointer;
}
</style>