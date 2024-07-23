<template>
  <h1 class="title">Редактор</h1>

  <div @pointerdown.stop @pointerup="callbacks.stagePointerUp">
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
            class="button"
            @click="callbacks.toggleSelectingNewShape"
          >
            {{ isNewShapeSelecting ? 'Прекратить выбор' : 'Добавить фигуру' }}
          </button>
          <button
            class="button"
            @click="helpers.deleteActiveShape"
            :disabled="!Boolean(selectedShape)"
          >
            Удалить
          </button>
        </div>

        <div class="select-shape" v-show="isNewShapeSelecting">
          <button class="button" :disabled="currentDrawingShape === 'rect'" @click="callbacks.addNewShape('rect')">Rect</button>
          <button class="button" :disabled="currentDrawingShape === 'circle'" @click="callbacks.addNewShape('circle')">Circle</button>
          <button class="button" :disabled="currentDrawingShape === 'arrow'" @click="callbacks.addNewShape('arrow')">Arrow</button>
          <button class="button" :disabled="currentDrawingShape === 'image'" @click="callbacks.addNewShape('image')">Image</button>
          <button class="button" @click="callbacks.addNewShape('text')">Text</button>
        </div>
      </div>

      <div class="actions__item">
        <span class="actions__item-title">Операции над холстом</span>
  
        <div>
          <button
            class="button"
            @click="callbacks.resetScaleCanvas"
          >
            Сбросить масштабирование
          </button>
          <button
            class="button"
            @click="callbacks.resetTransformCanvas"
          >
            Вернуться к 0;0
          </button>
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
import { dangerouslyForceToAnotherIterationEventLoop, makeShapeConfig } from './js/utils';

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
// Смещение канвы
const canvasTransform = ref({ x: 0, y: 0 });

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
// Объект канвы, предоставляемый konva
const konvaStage = computed(() => {
  if (!konva.value) return;
  return konva.value.getStage();
});

const currentShapeConfig = ref(makeShapeConfig());

watch(currentDrawingShape, () => {
  currentShapeConfig.value.type = currentDrawingShape.value;
});

// Конфигурация холста
const configKonva = {
  width: window.innerWidth,
  height: window.innerHeight / 1.5,
  draggable: true,
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

  /**
   * Получить координаты указателя с учётом смещения
   * @param {PointerEvent} e Pointer-событие
   * @returns {Object} Объект с координатами
   */
  getPointerCoordinates(e) {
    const { offsetX, offsetY } = e;
    // const x = offsetX - canvasTransform.value.x * scaleX.value;
    // const y = offsetY - canvasTransform.value.y * scaleY.value;
    const x = offsetX / scaleX.value - canvasTransform.value.x / scaleX.value;
    const y = offsetY / scaleY.value - canvasTransform.value.y / scaleY.value;

    return { x, y };
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
   * Обработчик поднятия указателя с канвы. Тут забираем смещение
   */
  stagePointerUp: () => {
    console.log('stage pointer up');
    // Получаем смещение в виде матрицы. Нам нужны лишь два последних элемента (x, y)
    const [_a, _b, _c, _d, x, y] = konvaStage.value.getAbsoluteTransform().m;
    // Пишем смещение в состояние приложения
    canvasTransform.value.x = x;
    canvasTransform.value.y = y;
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
        // currentDrawingShape.value = 'arrow';
        data.shapes.push(new Arrow());
        return;
      }
      case 'image': {
        await helpers.loadNewImageIntoCanvas();
        currentDrawingShape.value = null;
        return;
      };
    }
  },

  /**
   * 
   */
  resetScaleCanvas: () => {
    scaleX.value = 1;
    scaleY.value = 1;
  },

  /**
   * Сбросить трансформации канвы
   */
  resetTransformCanvas: () => {
    konvaStage.value.position({ x: 0, y: 0 });
  },
};

// Обработчики для рисования
const drawingHandlers = {
  /**
   * Обработка первого нажатия на канву. Начинаем рисовать здесь
   * @params {Object} event Событие
   */
  canvasPointerDown: (event) => {
    // Фигура не выбрана - пользователь не начинает рисовать
    if (!currentDrawingShape.value) return;
    const { x, y } = helpers.getPointerCoordinates(event.evt);
    isPointerDownNow.value = true;

    // Делаем это для того, чтобы мы могли начать рисовать, а не передвигать холст
    konvaStage.value.draggable(false);
    dangerouslyForceToAnotherIterationEventLoop(() => {
      konvaStage.value.draggable(true);
    });

    currentShapeConfig.value.x = x;
    currentShapeConfig.value.y = y;
  },

  /**
   * Обработка движения указателя по канве. Рисуем фигуры на лету
   * @params {Object} event Событие
   */
  canvasPointerMove: (event) => {
    // Если пользователь не рисует, то значит от просто провёл над канвой и игнорируем
    if (!isDrawingNow.value) return;

    const { x, y } = helpers.getPointerCoordinates(event.evt);

    // Рисуем фигуры. Т.к. рисуем по разному - делаем ветки
    switch (currentDrawingShape.value) {
      case 'rect': {
        const calculatedWidth = -(currentShapeConfig.value.x - x);
        const calculatedHeight = -(currentShapeConfig.value.y - y);

        currentShapeConfig.value.width = calculatedWidth;
        currentShapeConfig.value.height = calculatedHeight;
        break;
      }
      case 'circle': {
        const calculatedWidth = Math.abs(currentShapeConfig.value.x - x);
        const calculatedHeight = Math.abs(currentShapeConfig.value.y - y);
        const radius = Math.ceil(Math.max(calculatedWidth, calculatedHeight) / 2);

        currentShapeConfig.value.radius = radius;
        break;
      }
    }
  },

  /**
   * Обработка поднятия указателя с канвы. "Коммитим" изменения здесь
   * @params {Object} event Событие
   */
  canvasPointerUp: async () => {
    if (!isDrawingNow.value) return;
    const correctConfig = toValue(currentShapeConfig.value);
    const drawnShape = { ...correctConfig };
    data.shapes.push(drawnShape);

    // Зануляем все координаты и размеры
    currentShapeConfig.value = makeShapeConfig();

    // Пользователь перестал рисовать на канве
    isPointerDownNow.value = false;
    currentDrawingShape.value = null;
  },
};

watch(canvasTransform, () => {
  console.log('Canvas Transform:', toValue(canvasTransform));
}, { deep: true });

watch([scaleX, scaleY], () => {
  const offset = konvaStage.value.offset();

  console.log('scaleX: ', scaleX.value);
  console.log('scaleY: ', scaleY.value);
  console.log('Offset: ', offset);
});

// Ставим масштабирование для канваса
watchEffect(() => {
  if (!konvaStage.value) return;
  konvaStage.value.scale({ x: Number(scaleX.value), y: Number(scaleY.value) });
});

// Корректные размеры при изменении окна браузера
watchEffect((onCleanup) => {
  if (!konva.value) return;

  const resizeHandler = () => {
    // Растягиваем канву на нужные размеры
    konvaStage.value.width(window.innerWidth);
    konvaStage.value.height(window.innerHeight / 1.5);
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

.button {
  padding: 5px 15px;
  cursor: pointer;
}
</style>
