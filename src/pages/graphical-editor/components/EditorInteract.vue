<template>
  <h1 class="title">Редактор</h1>

  <Editor
    :shapes="data.shapes"
    :imageDictionary="data.imageDictionary"
    :onlyView="false"
    :width="configKonva.width"
    :height="configKonva.height"
    :draggable="configKonva.draggable"
    :shapesDraggable="configKonva.shapesDraggable"
    :fillX="configKonva.fillX"
    :fillY="configKonva.fillY"
    :currentDrawingShape="currentDrawingShape"
    :currentShapeConfig="currentShapeConfig"
    :stagePointerUp="callbacks.stagePointerUp"
    :stagePointerDown="callbacks.stagePointerDown"
    :canvasPointerDown="drawingHandlers.canvasPointerDown"
    :canvasPointerMove="drawingHandlers.canvasPointerMove"
    :canvasPointerUp="drawingHandlers.canvasPointerUp"
    :groupPointerEnter="callbacks.groupPointerEnter"
    :groupDragStart="callbacks.groupDragStart"
    :groupDragEnd="callbacks.groupDragEnd"
    :groupPointerLeave="callbacks.groupPointerLeave"
    :startTransform="callbacks.startTransform"
    ref="konva"
  />

  <div class="bottom-area">
    <EditorActions
      :toggleSelectingNewShape="callbacks.toggleSelectingNewShape"
      :isNewShapeSelecting="isNewShapeSelecting"
      :selectedShape="selectedShape"
      :isAllowedToAddText="isAllowedToAddText"
      :addTextToSelectedShape="callbacks.addTextToSelectedShape"
      :deleteActiveShape="helpers.deleteActiveShape"
      :currentDrawingShape="currentDrawingShape"
      :addNewShape="callbacks.addNewShape"
      :resetScaleCanvas="callbacks.resetScaleCanvas"
      :resetTransformCanvas="callbacks.resetTransformCanvas"
      :isActionsVisible="isActionsVisible"
      :isColorsActionsVisible="isColorsActionsVisible"
      :isBoundariesActionsVisible="isBoundariesActionsVisible"
      :isCornerActionsVisible="isCornerActionsVisible"
      :incrementScale="() => callbacks.changeScale(1)"
      :decrementScale="() => callbacks.changeScale(-1)"
      :currentScale="formatNumToPercent(scale.x)"
      @fileUpload="helpers.loadNewImageIntoCanvas"
    />
  </div>
</template>

<script setup>
import { data } from '../js/mock';

import { ref, watchEffect, computed, toValue, watch, reactive, onMounted } from 'vue';
import { dangerouslyForceToAnotherIterationEventLoop, formatNumToPercent, makeShapeConfig } from '../js/utils';
import { Text } from 'konva/lib/shapes/Text';

import Editor from './Editor.vue';
import EditorActions from './EditorActions.vue';

const props = defineProps({
  // Перетаскивание канвы
  isStageDraggable: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Масштабирование по колёсику (или тачпаду, и т.д.)
  isScaleByWheel: {
    type: Boolean,
    required: false,
    default: false,
  }
});

// Выбранная фигура
const selectedShape = ref(null);
// Выбирается ли сейчас новая фигура
const isNewShapeSelecting = ref(false);
// Канвас, управляемый konva
const konva = ref(null);
// Текущая рисуемая фигура
const currentDrawingShape = ref(null);
// Нажат ли указатель (обозначает, что пользователь ведёт зажатой кнопкой по канве)
const isPointerDownNow = ref(null);
// Смещение канвы, с учётом перемещения
const canvasTransform = ref({ x: 0, y: 0 });
// Максимальный zIndex на канве (для вытаскивания элемента на самый верх)
const maxZIndex = ref(data.shapes.reduce((maxZIndex, shape) => {
  // Вычисляем максимальный zIndex при инициализации
  return shape.zIndex > maxZIndex ? shape.zIndex : maxZIndex;
}, data.shapes[0].zIndex));
// Зум канвы
const scale = ref({ x: 1, y: 1 });
// Позиционирование канвы относительно предка
const canvasPosition = ref({ x: 0, y: 0 });

// Видны ли действия над активной фигурой
const isActionsVisible = computed(() => Boolean(selectedShape.value));
// Видны ли действия над углами фигуры
const isCornerActionsVisible = computed(() => {
  // Если фигура не является стрелкой или кругом - то разрешаем менять углы
  return isActionsVisible.value && !(['arrow', 'circle'].includes(selectedShape.value?.attrs.type))
});
// Видны ли действия над цветом (fill, stroke)
const isColorsActionsVisible = computed(() => {
  // Действия над цветами не разрешены над картинками
  return isActionsVisible.value && selectedShape.value?.attrs.type !== 'image';
});
// Видны ли действия над границами
const isBoundariesActionsVisible = computed(() => {
  // Действия над границами не разрешены над картинками
  return isActionsVisible.value && selectedShape.value?.attrs.type !== 'image';
});
// Рисует ли сейчас пользователь на канве
const isDrawingNow = computed(() => {
  return isPointerDownNow.value && currentDrawingShape.value;
});
// Объект канвы, предоставляемый konva
const konvaStage = computed(() => {
  if (!konva.value?.inner) return;
  return konva.value.inner.getStage();
});
// Можно ли добавлять текст к выбранной фигуре
const isAllowedToAddText = computed(() => {
  const allowedTypes = ['rect', 'rectangle'];
  return allowedTypes.includes(selectedShape.value?.attrs.type);
});

// Конфиг рисуемой фигуры (чтобы обновлять лишь часть канвы, не ререндерить полностью)
const currentShapeConfig = ref(makeShapeConfig(maxZIndex.value));

// Добавляем тип к конфигу выбранной фигуры от текущей выбранной для рисования
watch(currentDrawingShape, () => {
  if (!currentDrawingShape.value) {
    currentShapeConfig.value = makeShapeConfig(maxZIndex.value);
  }
  currentShapeConfig.value.type = currentDrawingShape.value;
});

// @TODO данную возможность можно использовать при отправке на сервер
// onMounted(() => {
//   if (!konvaStage.value) return;
//   const rawJson = konvaStage.value.toJSON();
//   console.log(JSON.parse(rawJson));
// });

// Конфигурация холста
const configKonva = {
  width: window.innerWidth,
  height: window.innerHeight / 1.5,
  fillX: true,
  fillY: false,
  draggable: false,
  shapesDraggable: true,
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
    // const shape = target.children[0];
    // const shapeId = shape.id();

    // const findShapeIndex = data.shapes.findIndex((existShape) => {
    //   return existShape.id === shapeId;
    // });

    // data.shapes.push(data.shapes[findShapeIndex]);
    // data.shapes.splice(findShapeIndex, 1);

    if (options.withTransformer) {
      const transformerNode = konva.value.transformer.getNode();
      if (transformerNode) transformerNode.moveToTop();
    }
  },

  /**
   * Удаление выделения трансформаций
   */
  unTransformAll: () => {
    const transformerNode = konva.value.transformer.getNode();
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
    // Будем удалять группу, т.к. в ней содержится текст
    const group = selectedShape.value.parent;
    group.destroy();
    helpers.unTransformAll();
  },

  /**
   * Загрузка нового изображения на канву
   * @param {File} file - Файл
   */
   loadNewImageIntoCanvas: async (file) => {
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const shapeId = crypto.randomUUID();
      const imageId = crypto.randomUUID();

      data.shapes.push({
        id: shapeId,
        type: 'image',
        width: 250,
        height: 250,
        x: 300,
        y: 150,
        imageId,
      });
      data.imageDictionary[imageId] = fileReader.result;
    };

    fileReader.readAsDataURL(file);
   },

  /**
   * Применить текущие трансформации канвы к координатам и преобразовать их
   * @param {Object} coords Объект с координатами x, y
   */
  getCoordsByTransformationsKonva: (coords) => {
    const transform = konva.value.inner.getStage().getAbsoluteTransform().copy();
    // Для определения относительной позиции необходимо инвертировать трансформации
    transform.invert();
    
    // Применяем обратные трансформации и находим реальные координаты
    return transform.point(coords);
  },

  /**
   * Получить координаты указателя с учётом смещения
   * @returns {Object} Объект с координатами
   */
  getPointerCoordinates: () => {
    // Получаем координаты указателя
    const pos = konva.value.inner.getStage().getPointerPosition();
    const transformCoords = helpers.getCoordsByTransformationsKonva(pos);

    return transformCoords;
  },

  /**
   * Вынести элемент на самый верхний слой
   * @param {Number | String} id ID фигуры для перемещения
   */
  setShapeMaxZIndex: (id) => {
    let findIndex = null;

    const findShape = data.shapes.find((existShape, index) => {
      const result = existShape.id == id;

      if (result) findIndex = index;

      return result;
    });

    if (!findShape) return;

    maxZIndex.value += 0.1;

    data.shapes.push(data.shapes[findIndex]);
    findShape.zIndex = maxZIndex.value;
    data.shapes.splice(findIndex, 1);
  },
};

// Переиспользуемые функции
const callbacks = {
  groupDragStart: (e) => {
    const { target } = e;
    // Т.к. сейчас рисуем - не будем ничего передвигать
    if (isDrawingNow.value) {
      // Выключаем возможность перемещения, чтобы начать рисовать
      target.draggable(false);
      dangerouslyForceToAnotherIterationEventLoop(() => {
        target.draggable(true);
      })
      return;
    }
    helpers.moveToMaxZIndex(target, { withTransformer: true });
    document.body.style.cursor = 'grabbing';
  },
  /**
   * Обработка конца перетаскивания. Здесь синхронизируем с состоянием
   * @param {Object} e Событие
   */
  groupDragEnd: (e) => {
    // Перетаскивать закончили - ставим обычный курсор
    document.body.style.cursor = 'default';

    // Получаем группу, которую перетаскивали
    const { target } = e;
    // Достаём фигуру, лежащую внутри группы. Одна группа - одна фигура (и несколько текстов внутри)
    const shape = target.children[0];
    // Достаём id фигуры, чтобы далее производить поиск
    const shapeId = shape.id();

    // Координаты фигуры
    const position = target.position();

    // Ищем фигуру
    const findShape = data.shapes.find((existShape, index) => {
      return existShape.id == shapeId;
    });

    
    // Фигура есть - меняем состояние
    if (findShape) {
      helpers.setShapeMaxZIndex(findShape.id);

      findShape.x = position.x;
      findShape.y = position.y;
    }
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
    // Получаем смещение в виде матрицы. Нам нужны лишь два последних элемента (x, y)
    const [_a, _b, _c, _d, x, y] = konvaStage.value.getAbsoluteTransform().m;
    // Пишем смещение в состояние приложения
    canvasTransform.value.x = x;
    canvasTransform.value.y = y;
  },
  /**
   * Помещение target в слой трансформаций
   * @param {Object} e Событие
   */
  startTransform: (e) => {
    // Фигура, или картинка - если взаимодействуем с изображением, кликнули по тексту - получим текст
    const { target } = e;
    // Достаём группу, в которой находится фигура
    const group = target.parent;
    // Достаём фигуру или картинку
    const shape = group.children[0];
    // Достаём id, чтобы не вызывать в .find
    const shapeId = shape.id();
    // Делаем объект-трансформатор. Сюда будем кидать группу для преобразования
    const transformerNode = konva.value.transformer.getNode();
    // Достём объект канвы
    const stage = transformerNode.getStage();
    // Текущая выбранная нода
    const selectedNode = stage.findOne(`#${target.id()}`);

    helpers.moveToMaxZIndex(group, { withTransformer: true });
    
    if (target === selectedShape.value) {
      selectedShape.value = null;
      transformerNode.nodes([]);
      return;
    }
    if (transformerNode.node() === selectedNode) return;
      
    if (selectedNode) {
      // Текст идёт размером с фигуру, поэтому по клику - будем получать текст, =>
      // Будем делать поиск относительно него
      if (target instanceof Text) {
        selectedShape.value = target.parent.children[0];
      } else {
        selectedShape.value = selectedNode;
      }
      transformerNode.nodes([group]);

      // Ставим обработчики на конец трансформации для синхронизации состояния и канвы
      // @TODO Если возникнут проблемы с производительностью - смотреть сюда (возможно лучше будет ставить на transformend)
      group.on('transformend', () => {
        // Достаём текущий поворот и координаты
        const rotation = group.rotation();
        const position = group.position();
        // Достаём размеры
        const scaleX = group.attrs.scaleX;
        const scaleY = group.attrs.scaleY;
        // Достаём ширину и высоту
        const width = group.width();
        const height = group.height();
        // Konva меняет scaleX и scaleY - мы узнаём точную ширину и высоту
        const correctWidthByScale = width * scaleX;
        const correctHeightByScale = height * scaleY;
        
        // Меняем scaleX, scaleY на изначальные значения
        group.scaleX(1);
        group.scaleY(1);

        transformerNode.nodes([]);

        // Для корректного обновления
        dangerouslyForceToAnotherIterationEventLoop(() => {
          transformerNode.update();
          transformerNode.nodes([group]);
        });

        // Ищем фигуру
        const findShape = data.shapes.find((existShape, index) => {
          return existShape.id == shapeId;
        });

        // Если фигура была найдена - применяем трансформации
        if (findShape) {
          // Выносим фигуру на максимальный zIndex, т.к. трансформируемая фигура не должна быть снизу
          helpers.setShapeMaxZIndex(findShape.id);

          findShape.startRotation = rotation;
          findShape.x = position.x;
          findShape.y = position.y;
          findShape.width = correctWidthByScale;
          findShape.height = correctHeightByScale;
        }
      });
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
      const transformerNode = konva.value.transformer.getNode();
      transformerNode.nodes([]);
    }
  },

  /**
   * Переключение статуса выбора новой фигуры
   */
  toggleSelectingNewShape: () => {
    isNewShapeSelecting.value = !isNewShapeSelecting.value;
    // Т.к. закрываем меню для выбора фигуры - обнуляем и саму фигуру
    if (!isNewShapeSelecting.value) currentDrawingShape.value = null;
  },

  /**
   * Добавление новой фигуры
   * @param {String} shape Новая фигура
   */
  addNewShape: async (shape) => {
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
        currentDrawingShape.value = 'arrow';
        return;
      }
      case 'image': {
        currentDrawingShape.value = null;
        return;
      }
      case 'text': {
        currentDrawingShape.value = 'text';
        return;
      }
    }
  },

  /**
   * Сбросить масштабирование по двум осям
   */
  resetScaleCanvas: () => {
    scale.value = { x: 1, y: 1 };
  },

  /**
   * Сбросить трансформации канвы
   */
  resetTransformCanvas: () => {
    canvasPosition.value = { x: 0, y: 0 };
  },

  /**
   * Процесс нанесения текста на выбранную фигуру
   */
  addTextToSelectedShape: async () => {
    const selectedId = selectedShape.value.id();

    // Ищем фигуру по айди в стейте
    const findShape = data.shapes.find((shape) => {
      return shape.id == selectedId;
    });

    if (!findShape) return;

    // Добавляет текст в фигуру
    const addNewText = () => {
      const newText = prompt('Введите текст: ');
  
      findShape.text.push(reactive({
        alignment: 'left',
        text: [
          {
            text: newText,
            fontSize: 24,
            type: 'medium',
          }
        ]
      }));
    };

    // Если определён массив текста - можем пушить новый текст
    if (Array.isArray(findShape.text)) {
      addNewText();
    } else {
      // Иначе - заводим массив и спрашиваем про вертикальное выравнивание
      findShape.text = [];
      let verticalAlignment = null;

      do {
        // Будем спрашивать про выравнивание, пока не будет дан корректный ответ
        verticalAlignment = prompt('Вертикальное выравнивание (top; middle; bottom)').trim().toLowerCase();
      } while (!['top', 'middle', 'bottom'].includes(verticalAlignment));

      findShape.textVerticalAlignment = verticalAlignment;
      addNewText();
    }
  },

  /**
   * Увеличение масштаба 
   * @param {Number} direction Направление зума
   */
  changeScale: (direction = 1) => {
    // Достаём координаты центра
    const centerX = konvaStage.value.width() / 2;
    const centerY = konvaStage.value.height() / 2;

    const oldScale = konvaStage.value.scaleX();

    const mousePointTo = {
      x: (centerX - konvaStage.value.x()) / oldScale,
      y: (centerY - konvaStage.value.y()) / oldScale,
    };

    const scaleBy = 1.1;
    // Определяем новое значение зума
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    // Пишем новый зум в состояние
    scale.value = { x: newScale, y: newScale };

    // Определяем новые координаты исходя из получившегося зума
    const newPos = {
      x: centerX - mousePointTo.x * newScale,
      y: centerY - mousePointTo.y * newScale,
    };
    // Пишем новые координаты в состояние
    canvasPosition.value = newPos;
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

    // Если рисуем стрелку - то оперируем не x, y, а points
    if (currentDrawingShape.value === 'arrow') {
      currentShapeConfig.value.points = [x, y];
    } else {
      currentShapeConfig.value.x = x;
      currentShapeConfig.value.y = y;
    }
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
      case 'arrow': {
        let slicedPoints = currentShapeConfig.value.points;
        // Для рисования стрелки - нужны только 4 координаты, поэтому отсеиваем ненужное
        if (slicedPoints.length > 2)
          slicedPoints = currentShapeConfig.value.points.slice(0, currentShapeConfig.value.points.length - 2);
        
        currentShapeConfig.value.points = [...slicedPoints, x, y];
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
    currentShapeConfig.value = makeShapeConfig(maxZIndex.value);

    // Пользователь перестал рисовать на канве
    isPointerDownNow.value = false;
    currentDrawingShape.value = null;
  },
};

// Ставим масштабирование на прокрутку у канвы
watchEffect((onCleanup) => {
  if (!props.isScaleByWheel || !konvaStage.value) return;
  
  const wheelHandler = (e) => {
    e.evt.preventDefault();
    // Определяем направление зума
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    callbacks.changeScale(direction);
  };

  konvaStage.value.on('wheel', wheelHandler);

  // Во избежание утечек памяти - убираем обработчики
  onCleanup(() => {
    if (!konvaStage.value) return;
    konvaStage.value.off('wheel');
  });
});

// Следим за состоянием для канвы и меняем её
watch([scale, canvasPosition], () => {
  // Применяем зум
  konvaStage.value.scale({ x: scale.value.x, y: scale.value.y });
  // Применяем позиционирование
  konvaStage.value.position({ x: canvasPosition.value.x, y: canvasPosition.value.y });
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
</style>
