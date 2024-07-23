<template>
  <h1 class="title">Редактор</h1>

  <div @pointerdown.stop>
    <v-stage
      :config="configKonva"
      @click="callbacks.stagePointerDown"
      @pointerdown="drawingHandlers.canvasPointerDown"
      @pointermove="drawingHandlers.canvasPointerMove"
      @pointerup="drawingHandlers.canvasPointerUp"
      ref="konva"
    >
      <v-layer
      >
        <v-group
          v-for="shape in data.shapes"
          :config="{
            draggable: true
          }"
          @pointerenter="callbacks.groupPointerEnter"
          @dragstart="callbacks.groupDragStart"
          @dragend="callbacks.groupDragEnd"
          @pointerleave="callbacks.groupPointerLeave"
          @dblclick="callbacks.startTransform"
        >
          <component    
            :key="shape.id"
            :config="{
              ...TransformerEditor.transformConfigToKonvaCorrect(shape),
              image: TransformerEditor.shapeReducer(shape) === 'v-image' ? helpers.buildImage(shape) : null,
            }"
            :is="TransformerEditor.shapeReducer(shape)"
          />

          <template
            v-for="textInfo in shape.text"
          >
            <v-text
              v-for="textRecord in textInfo.text"
              :config="{
                x: shape.x,
                y: shape.y,
                rotation: shape.rotation,
                width: shape.width,
                align: textInfo.alignment,
                ...TransformerEditor.transformTextConfigToConvaCorrect(textRecord),
              }">
            </v-text>
          </template>
        </v-group>

        <v-group v-if="currentDrawingShape">
          <component
            :is="TransformerEditor.shapeReducer(currentDrawingShape)"
            :config="currentShapeConfig"
          />
        </v-group>

      <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>

  <div class="bottom-area">
    <div class="actions">
      <div class="actions__item">
        <span class="actions__item-title">Добавление / Удаление</span>
  
        <div>
          <button
            @click="callbacks.toggleSelectingNewShape"
          >
            {{ isNewShapeSelecting ? 'Прекратить выбор' : 'Добавить фигуру' }}
          </button>
          <button
            @click="helpers.deleteActiveShape"
            :disabled="!Boolean(selectedShape)"
          >
            Удалить
          </button>
        </div>

        <div class="select-shape" v-show="isNewShapeSelecting">
          <button :disabled="currentDrawingShape === 'rect'" @click="callbacks.addNewShape('rect')">Rect</button>
          <button :disabled="currentDrawingShape === 'circle'" @click="callbacks.addNewShape('circle')">Circle</button>
          <button :disabled="currentDrawingShape === 'arrow'" @click="callbacks.addNewShape('arrow')">Arrow</button>
          <button :disabled="currentDrawingShape === 'image'" @click="callbacks.addNewShape('image')">Image</button>
          <button @click="callbacks.addNewShape('text')">Text</button>
        </div>
      </div>

      <div class="actions__item">
        <span class="actions__item-title">Масштабирование</span>

        <label>
          По оси X:
          <input type="range" :min="0.1" :max="1" :step="0.1" v-model="scaleX">
          {{  scaleX  }}
        </label>

        <label>
          По оси Y:
          <input type="range" :min="0.1" :max="1" :step="0.1" v-model="scaleY">
          {{  scaleY  }}
        </label>

        <label>
          Сразу по двум:
          <input
            type="range"
            :min="0.1"
            :max="1"
            :step="0.1"
            :value="scaleX"
            @input="callbacks.scaleAllInput">
          {{  scaleX  }}
        </label>
      </div>
  
      <div class="actions__item" v-show="isActionsVisible">
        <span class="actions__item-title">Цвета</span>
  
        <div>
          <div class="action">
            <label>
              Основной цвет: <b>(fill)</b>
              <input
                type="color"
                :value="selectedShape?.fill()"
                @input="selectedShape?.fill($event.target.value)"
              />
            </label>
          </div>
  
          <div class="action">
            <label>
              Цвет границ: <b>(stroke)</b>
              <input
                type="color"
                :value="selectedShape?.stroke()"
                @input="selectedShape?.stroke($event.target.value)"
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
            :value="selectedShape?.cornerRadius?.()"
            @input="selectedShape?.cornerRadius?.(Number($event.target.value))"
          />
          <b>{{ selectedShape?.cornerRadius?.() }}</b>
        </label>
      </div>

      <div class="actions__item" v-show="isActionsVisible">
        <span class="actions__item-title">Границы</span>

        <label>
          Ширина:
          <input
            type="range"
            :min="0"
            :max="20"
            :step="1"
            :value="selectedShape?.strokeWidth()"
            @input="selectedShape?.strokeWidth(Number($event.target.value))"
          />
          <b>{{ selectedShape?.strokeWidth() }}</b>
        </label>
      </div>

      <div class="actions__item" v-show="isActionsVisible">
        <span class="actions__item-title">Размеры</span>

        <label>
          Ширина:
          <input
            type="number"
            :value="selectedShape?.width?.()"
            @input="selectedShape?.width(Number($event.target.value))"
          />&nbsp;
          <b>{{ selectedShape?.width?.() }}px</b>
        </label>

        <label>
          Высота:
          <input
            type="number"
            :value="selectedShape?.height?.()"
            @input="selectedShape?.height(Number($event.target.value))"
          />&nbsp;
          <b>{{ selectedShape?.height?.() }}px</b>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { data } from './mock';

import { ref, watchEffect, computed, toValue, reactive, nextTick, watch } from 'vue';
import { Arrow, Circle, Rectangle } from './js/ShapesClasses';
import { TransformerEditor } from './js/TransformClasses';
import { dangerouslyForceToAnotherIterationEventLoop } from './js/utils';

// Объект, с помощью которого будет происходить трансформация примитивов
const transformer = ref(null);
// Выбранная фигура
const selectedShape = ref(null);
// Выбирается ли сейчас новая фигура
const isNewShapeSelecting = ref(false);
// Канвас, управляемый konva
const konva = ref(null);
// Масштабирование по оси X
const scaleX = ref(1);
// Масштабирование по оси y
const scaleY = ref(1);
// Текущая рисуемая фигура
const currentDrawingShape = ref(null);
// Нажат ли указатель (обозначает, что пользователь ведёт зажатой кнопкой по канве)
const isPointerDownNow = ref(null);

watchEffect(() => {
  console.log(toValue(currentDrawingShape));
});

// Видны ли действия над активной фигурой
const isActionsVisible = computed(() => Boolean(selectedShape.value));
// Видны ли действия над углами фигуры
const isCornerActionsVisible = computed(() => {
  // Если фигура не является стрелкой или кругом - то разрешаем менять углы
  return isActionsVisible.value && !(['arrow', 'circle'].includes(selectedShape.value.type))
});
// Рисует ли сейчас пользователь на канве
const isDrawingNow = computed(() => {
  return isPointerDownNow.value && currentDrawingShape.value;
});

const currentShapeConfig = ref({
  type: 'rect',
  id: crypto.randomUUID(),
  x: 0,
  y: 0,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 5,
  width: 0,
  height: 0,
});

watch(currentDrawingShape, () => {
  currentShapeConfig.value.type = currentDrawingShape.value;
});

// Конфигурация холста
const configKonva = {
  width: window.innerWidth,
  height: window.innerHeight / 1.5,
  draggable: false
};

// Вспомогательные функции
const helpers = {
  /**
   * Переместить фигуру на самый высокий слой
   * @param {Object} target Фигура для перемещения
   * @param {Object} options Объект настроек
   */
  moveToMaxZIndex: (target, options) => {
    target.moveToTop();
    if (options.withTransformer) {
      const transformerNode = transformer.value.getNode();
      if (transformerNode) transformerNode.moveToTop();
    }    
  },

  /**
   * Удаление выделения трансформаций
   */
  unTransformAll: () => {
    const transformerNode = transformer.value.getNode();
    if (transformerNode) transformerNode.nodes([]);
  },

  /**
   * Сброс активной фигуры и трансформаций
   */
  resetActive: () => {
    selectedShape.value = null;
    helpers.unTransformAll();
  },

  /**
   * Удаление активной фигуры
   */
  deleteActiveShape: () => {
    selectedShape.value = null;
    helpers.unTransformAll();
  },

  /**
   * Загрузка нового изображения на канву
   */
  loadNewImageIntoCanvas: async () => {
    // Разрешённые для загрузки типы файлов
    const allowedTypesFiles = [
      {
        description: "Images",
        accept: {
          "image/*": ['.png', '.gif', '.jpeg', '.jpg', '.svg'],
        },
      },
    ];
    // Массив файлов, которые выбрал пользователь
    const result = await window.showOpenFilePicker({
      types: allowedTypesFiles
    });
    const file = await result[0].getFile();

    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      data.shapes.push({
        type: 'image',
        width: 250,
        height: 250,
        src: fileReader.result,
        x: 300,
        y: 150,
      })
    };

    fileReader.readAsDataURL(file);
  },

  /**
   * Фабрика картинок
   * @param shape Объект фигуры изображения
   * @returns {Image} Изображение
   */
  buildImage: (shape) => {
    const image = new Image();
    image.src = shape.src;
    return image;
  },
};

// Переиспользуемые функции
const callbacks = {
  groupDragStart: (e) => {
    const { target } = e;
    // Т.к. сейчас рисуем - не будем ничего передвигать
    if (isDrawingNow.value) {
      target.draggable(false);
      dangerouslyForceToAnotherIterationEventLoop(() => {
        target.draggable(true);
      })
      return;
    }
    helpers.moveToMaxZIndex(target, { withTransformer: true });
    document.body.style.cursor = 'grabbing';
  },
  groupDragEnd: (e) => {
    const { target } = e;

    document.body.style.cursor = 'default';
    console.group('DragEnd');
    console.log('Coordinates after drag:');
    console.log(target.attrs);
    console.groupEnd('DragEnd');
  },
  groupPointerLeave: () => {
    document.body.style.cursor = 'default';
  },
  groupPointerEnter: () => {
    document.body.style.cursor = 'grab';
  },
  /**
   * Регулировка сразу двух осей для масштабирования
   * @param {InputEvent} e Событие
   */
  scaleAllInput: (e) => {
    scaleX.value = e.target.value;
    scaleY.value = e.target.value;
  },
  /**
   * Помещение target в слой трансформаций
   * @param {Object} e Событие
   */
  startTransform: (e) => {
    const { target } = e;
    const group = target.parent;
    console.log(group);
    const transformerNode = transformer.value.getNode();
    const stage = transformerNode.getStage();
    const selectedNode = stage.findOne(`#${target.id()}`);

    // helpers.moveToMaxZIndex(target, { withTransformer: true });
    
    if (target === selectedShape.value) {
      selectedShape.value = null;
      transformerNode.nodes([]);
      return;
    }
    if (transformerNode.node() === selectedNode) return;
    
    if (selectedNode) {
      selectedShape.value = selectedNode;
      transformerNode.nodes([...group.children]);
    }
    else {
      selectedShape.value = null;
      transformerNode.nodes([]);
    }
  },
  
  /**
   * Обработка клика по канвасу
   * @param {Object} e Событие
   */
  stagePointerDown: (e) => {
    const { target } = e;

    // Если кликнули по канвасу - то убираем выделение активной фигуры
    if (target === target.getStage()) {
      selectedShape.value = null;
      const transformerNode = transformer.value.getNode();
      transformerNode.nodes([]);
    }
  },

  /**
   * Переключение статуса выбора новой фигуры
   */
  toggleSelectingNewShape: () => {
    isNewShapeSelecting.value = !isNewShapeSelecting.value;
    // Т.к. закрываем меню для выбора фигуры - обнуляем и саму фигуру
    if (isNewShapeSelecting.value) currentDrawingShape.value = null;
  },

  /**
   * Добавление новой фигуры
   * @param {String} shape Новая фигура
   */
  addNewShape: async (shape) => {
    // switch (shape) {
    //   case 'rect': return data.shapes.push(new Rectangle());
    //   case 'circle': return data.shapes.push(new Circle());
    //   case 'arrow': return data.shapes.push(new Arrow());
    //   case 'image': return helpers.loadNewImageIntoCanvas();
    //   case 'text': return alert('Under construct');
    // }
    switch (shape) {
      case 'rect': {
        currentDrawingShape.value = 'rect';
        return;
      };
      case 'circle': {
        currentDrawingShape.value = 'circle';
        return;
      };
      case 'arrow': {
        await helpers.loadNewImageIntoCanvas();
        currentDrawingShape.value = null;
        return;
      };
    }
  },
};

// Обработчики для рисования
const drawingHandlers = {
  canvasPointerDown: (event) => {
    // Фигура не выбрана - пользователь не начинает рисовать
    if (!currentDrawingShape.value) return;
    const { offsetX, offsetY } = event.evt;
    isPointerDownNow.value = true;

    currentShapeConfig.value.x = offsetX;
    currentShapeConfig.value.y = offsetY;
  },

  canvasPointerMove: (event) => {
    // Если пользователь не рисует, то значит от просто провёл над канвой и игнорируем
    if (!isDrawingNow.value) return;
    const { offsetX, offsetY } = event.evt;

    // Рисование фигуры
    let calculatedWidth = -(currentShapeConfig.value.x - offsetX);
    let calculatedHeight = -(currentShapeConfig.value.y - offsetY);
    // Если круг - то берём модуль, т.к. не может быть отрицательного радиуса
    if (currentDrawingShape.value === 'circle') { 
      calculatedWidth = Math.abs(calculatedWidth);
      calculatedHeight = Math.abs(calculatedHeight);
    }
    currentShapeConfig.value.width = calculatedWidth;
    currentShapeConfig.value.height = calculatedHeight;
  },

  canvasPointerUp: async () => {
    if (!isDrawingNow.value) return;
    console.log('Закончил рисовать');
   
    const correctConfig = toValue(currentShapeConfig.value);
    const drawnShape = { ...correctConfig };
    data.shapes.push(drawnShape);

    // Зануляем все координаты и размеры
    currentShapeConfig.value.x = currentShapeConfig.value.y = currentShapeConfig.value.width = currentShapeConfig.value.height = 0;
    currentShapeConfig.value.id = crypto.randomUUID();

    // Пользователь перестал рисовать на канве
    isPointerDownNow.value = false;
    currentDrawingShape.value = null;
  },
};

watchEffect(() => {
  console.log(toValue(data.shapes));
});

watchEffect((onCleanup) => {
  const pointerDownHandler = () => {
    // helpers.resetActive();
  };

  // По клику на body - сбрасываем активную фигуру и её трансформацию
  // На враппере редактора стоит stopPropagation, поэтому будет иметь действие только по клику вне него
  document.body.addEventListener('pointerdown', pointerDownHandler);

  onCleanup(() => {
    document.body.removeEventListener('pointerdown', pointerDownHandler);
  });
});

// Ставим масштабирование для канваса
watchEffect(() => {
  if (!konva.value) return;
  konva.value.getStage().scale({ x: Number(scaleX.value), y: Number(scaleY.value) });
});

// Корректные размеры при изменении окна браузера
watchEffect((onCleanup) => {
  if (!konva.value) return;

  const resizeHandler = () => {
    // Берём канву
    const stage = konva.value.getStage();
    stage.width(window.innerWidth);
    stage.height(window.innerHeight / 1.5);
  };

  window.addEventListener('resize', resizeHandler, { passive: true });

  onCleanup(() => {
    window.removeEventListener('resize', resizeHandler);
  });
});
</script>

<style scoped>
.title {
  text-align: center;
}

.bottom-area {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding-top: 20px;
  border-top: 2px solid var(--cornflower-blue);
}

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
</style>
