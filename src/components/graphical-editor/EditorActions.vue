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

    <div class="actions__item" v-show="props.isColorsActionsVisible">
      <span class="actions__item-title">Цвета</span>

      <div>
        <div class="action">
          <label>
            Основной цвет: <b>(fill)</b>
            <input
              type="color"
              :value="props.selectedShape?.fill()"
              @input="props.selectedShape?.fill($event.target.value)"
            />
          </label>
        </div>

        <div class="action">
          <label>
            Цвет границ: <b>(stroke)</b>
            <input
              type="color"
              :value="props.selectedShape?.stroke()"
              @input="props.selectedShape?.stroke($event.target.value)"
            />
          </label>
        </div>
      </div>
    </div>

    <div class="actions__item" v-show="isCornerActionsVisible">
      <span class="actions__item-title">Углы</span>

      <label>
        Скругление: <b>cornerRadius</b>
        <input
          type="range"
          :min="0"
          :max="50"
          :step="1"
          :value="props.selectedShape?.cornerRadius?.()"
          @input="props.selectedShape?.cornerRadius?.(Number($event.target.value))"
        />
        <b>{{ props.selectedShape?.cornerRadius?.() }}</b>
      </label>
    </div>

    <div class="actions__item" v-show="isBoundariesActionsVisible">
      <span class="actions__item-title">Границы</span>

      <label>
        Ширина:
        <input
          type="range"
          :min="0"
          :max="20"
          :step="1"
          :value="props.selectedShape?.strokeWidth()"
          @input="props.selectedShape?.strokeWidth(Number($event.target.value))"
        />
        <b>{{ props.selectedShape?.strokeWidth() }}</b>
      </label>
    </div>

    <div class="actions__item" v-show="isActionsVisible">
      <span class="actions__item-title">Размеры</span>

      <label>
        Ширина:
        <input
          type="number"
          :value="props.selectedShape?.width?.()"
          @input="props.selectedShape?.width(Number($event.target.value))"
        />&nbsp;
        <b>{{ props.selectedShape?.width?.() }}px</b>
      </label>

      <label>
        Высота:
        <input
          type="number"
          :value="props.selectedShape?.height?.()"
          @input="props.selectedShape?.height(Number($event.target.value))"
        />&nbsp;
        <b>{{ props.selectedShape?.height?.() }}px</b>
      </label>
    </div>
  </div>
</template>

<script setup>
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