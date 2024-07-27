<template>
  <div class="actions">
    <!-- Добавление / Удаление элементов -->
    <div class="actions__item">
      <span class="actions__item-title">Добавление / Удаление</span>

      <Panel>
        <PanelItem>
          <Button
            @click="props.toggleSelectingNewShape"
          >
            {{ props.isNewShapeSelecting ? 'Прекратить выбор' : 'Добавить фигуру' }}
          </Button>
        </PanelItem>

        <PanelItem>
          <Button
            :disabled="!props.selectedShape || !props.isAllowedToAddText"
            @click="props.addTextToSelectedShape"
          >
            Добавить текст
          </Button>
        </PanelItem>

        <PanelItem>
          <Button
            @click="props.deleteActiveShape"
            :disabled="!Boolean(selectedShape)"
          >
            Удалить
          </Button>
        </PanelItem>
      </Panel>

      <Panel class="select-shape" v-show="isNewShapeSelecting">
        <PanelItem>
          <Button
            :disabled="props.currentDrawingShape === 'rect'"
            @click="props.addNewShape('rect')"
          >
            Прямоугольник
          </Button>
        </PanelItem>

        <PanelItem>
          <Button
            :disabled="props.currentDrawingShape === 'circle'"
            @click="props.addNewShape('circle')"
          >
            Круг
          </Button>
        </PanelItem>

        <PanelItem>
          <Button
            :disabled="props.currentDrawingShape === 'arrow'"
            @click="props.addNewShape('arrow')"
          >
            Стрелка
          </Button>
        </PanelItem>

        <PanelItem>
          <Button
            @click="props.addNewShape('image')"
            :disabled="props.currentDrawingShape === 'image'"
            class="input-file__wrapper"
          >
            <input
              @change="handlers.handleFileUpload"
              accept=".png, .jpg, .jpeg"
              type="file"
              class="input-file"
            />
            Картинка
          </Button>
        </PanelItem>
      </Panel>
    </div>

    <!-- Манипуляции с холстом -->
    <div class="actions__item">
      <span class="actions__item-title">Операции над холстом</span>

      <Panel>
        <PanelItem>
          <Button
            class="button"
            @click="props.resetScaleCanvas"
          >
            Сбросить масштабирование
          </Button>
        </PanelItem>

        <PanelItem>
          <Button
            class="button"
            @click="props.resetTransformCanvas"
          >
            Вернуться к 0;0
          </Button>
        </PanelItem>
      </Panel>
    </div>

    <!-- Масштабирование -->
    <div class="actions__item">
      <span class="actions__item-title">Масштабирование</span>

      <Panel>
        <PanelItem>
          <Button @click="props.incrementScale">
            <PlusIcon size="13" />
          </Button>
        </PanelItem>

        <PanelItem>
          <Button @click="props.decrementScale">
            <MinusIcon size="13" />
          </Button>
        </PanelItem>

        <PanelItem>
          {{ currentScale }}
        </PanelItem>
      </Panel>
    </div>

    <!-- Манипуляции с цветом выбранной фигуры -->
    <div class="actions__item" v-show="props.isColorsActionsVisible">
      <span class="actions__item-title">Цвета</span>

      <div>
        <div class="action">
          <label>
            Основной цвет:
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
            Цвет границ:
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

      Скругление:
      <CounterStep
        :value="props.selectedShape?.cornerRadius?.()"
        @input="handlers.onCornerRadiusInput"
        @change="handlers.onCornerRadiusChange"
      />
    </div>

    <!-- Манипуляции с фигурами выбранной фигуры -->
    <div class="actions__item" v-show="isBoundariesActionsVisible">
      <span class="actions__item-title">Границы</span>

      Ширина:
      <CounterStep
        :value="props.selectedShape?.strokeWidth()"
        @input="handlers.onStrokeWidthInput"
        @change="handlers.onStrokeWidthChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import Button from './ui/Button.vue';
import Panel from './ui/Panel.vue';
import PanelItem from './ui/PanelItem.vue';
import CounterStep from './CounterStep.vue';

import PlusIcon from 'vue-material-design-icons/Plus.vue';
import MinusIcon from 'vue-material-design-icons/Minus.vue';

import { data } from '../js/mock';

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
  incrementScale: {
    type: Function,
    required: false,
    default: () => {},
  },
  decrementScale: {
    type: Function,
    required: false,
    default: () => {},
  },
  currentScale: {
    type: String,
    required: false,
    default: '100%',
  }
});

const emit = defineEmits(['fileUpload']);

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
   * @param {Number} radius - Радиус
   */
  onCornerRadiusInput: (radius) => {
    props.selectedShape?.cornerRadius?.(radius);
  },
  /**
   * Обработчик изменения скругления углов (на change)
   * Тут меняем состояние, для оптимизации - только в конце ввода
   * @param {Number} radius - Радиус
   */
  onCornerRadiusChange: (radius) => {
    if (!currentShapeNode.value) return;
    currentShapeNode.value.cornerRadius = radius;
  },
  /**
   * Обработчик изменения ширины границы (на input)
   * @param {Number} strokeWidth - Ширина границы
   */
  onStrokeWidthInput: (strokeWidth) => {
    props.selectedShape?.strokeWidth?.(strokeWidth)
  },
  /**
   * 
   * Обработчик изменения ширины границы (на input)
   * Тут меняем состояние, для оптимизации - только в конце ввода
   * @param {Number} strokeWidth - Ширина границы
   */
  onStrokeWidthChange: (strokeWidth) => {
    if (!currentShapeNode.value) return;
    currentShapeNode.value.borderWidth = (strokeWidth);
  },
  /**
   * Обработчик загрузки файла
   */
  handleFileUpload: (e) => {
    const file = e.target.files[0];
    emit('fileUpload', file);
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

.input-file__wrapper {
  position: relative;
}

.input-file {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>