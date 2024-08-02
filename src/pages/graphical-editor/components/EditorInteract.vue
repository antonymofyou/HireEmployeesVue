<template>
  <h1 class="title">Редактор</h1>

  <div class="header">
    <Panel>
      <Button @click="callbacks.saveCanvasToServer">Сохранить</Button>
    </Panel>
  </div>

  <Editor
    :shapes="data.shapes"
    :imageDictionary="data.imageDictionary"
    :onlyView="false"
    :width="configKonva.width"
    :height="configKonva.height"
    :draggable="configKonva.draggable"
    :shapesDraggable="configKonva.shapesDraggable"
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
    :selectText="callbacks.selectAndEditText"
    @scale="callbacks.setScale"
    ref="konva"
    id="graphical-editor"
  />

  <div class="bottom-area">
    <EditorActions
      :toggleSelectingNewShape="callbacks.toggleSelectingNewShape"
      :isNewShapeSelecting="isNewShapeSelecting"
      :selectedShape="selectedShape"
      :selectedShapeFromState="selectedShapeFromState"
      :isAllowedToAddText="isAllowedToAddText"
      :addTextToSelectedShape="callbacks.startProcessAddTextToActiveShape"
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
      :isStageDraggable="props.isStageDraggable"
      :isResetScaleCanvasAllowed="isResetScaleCanvasAllowed"
      :isConfigOfTextVisible="isConfigOfTextVisible"
      :setVerticalAlignActiveShape="callbacks.setVerticalAlignActiveShape"
      :isInputForEnterShapeTextVisible="isInputForEnterShapeTextVisible"
      :onEnterText="callbacks.addTextToSelectedShape"
      :setConfigOfTextVisibility="callbacks.setConfigOfTextVisibility"
      @fileUpload="helpers.loadNewImageIntoCanvas"
    />
  </div>
</template>

<script setup>
import { ref, watchEffect, computed, toValue, watch, reactive } from 'vue';
import { dangerouslyForceToAnotherIterationEventLoop, formatNumToPercent, makeShapeConfig } from '../js/utils';

import Editor from './Editor.vue';
import EditorActions from './EditorActions.vue';
import Button from './ui/Button.vue';
import Panel from './ui/Panel.vue';

import { data } from '../js/mock';
import { sharedKonvaConfig } from '../js/config';

const props = defineProps({
  // Разрешено ли перетаскивание канвы
  isStageDraggable: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Разрешено ли масштабирование по колёсику (или тачпаду, и т.д.)
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
// Разрешено ли менять конфиг фигуры для текста
const isConfigOfTextVisible = ref(false);
// Разрешён ли ввод текста для фигуры
const isInputForEnterShapeTextVisible = ref(false);

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
// Разрешён ли сброс масштабирования канвы
const isResetScaleCanvasAllowed = computed(() => {
  return scale.value.x !== 1;
});
// Текущая выбранная фигура из стейта (который потом полетит на сервер)
const selectedShapeFromState = computed(() => {
  if (!selectedShape.value) return null;

  const shapeId = selectedShape.value.id();
  const findShape = data.shapes.find((existShape) => {
    return existShape.id == shapeId;
  });

  return findShape;
});

// Конфиг рисуемой фигуры (чтобы обновлять лишь часть канвы, не ререндерить полностью)
const currentShapeConfig = ref(makeShapeConfig({
  type: currentDrawingShape.value,
  zIndex: maxZIndex.value,
}));

// Добавляем тип к конфигу выбранной фигуры от текущей выбранной для рисования
watch(currentDrawingShape, () => {
  currentShapeConfig.value = makeShapeConfig({
    type: currentDrawingShape.value,
    zIndex: maxZIndex.value,
  });
});

// Действия при появлении / исчезновении / изменении  выбранной фигуры
watch(selectedShape, () => {
  // Выбранной фигуры нет / она поменялась - поэтому отменяем все действия с ней связанные
  isConfigOfTextVisible.value = false;
  isInputForEnterShapeTextVisible.value = false;
});

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
  if (!konvaStage.value) return;

  // Применяем зум
  konvaStage.value.scale({ x: scale.value.x, y: scale.value.y });
  // Применяем позиционирование
  konvaStage.value.position({ x: canvasPosition.value.x, y: canvasPosition.value.y });
}, { immediate: true });

// Конфигурация холста
// width, height - виртуальные размеры канвы, чтобы помещалось на любом устройстве
const configKonva = {
  ...sharedKonvaConfig,
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
    helpers.setShapeMaxZIndex(target.children[0].id());

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
    helpers.deleteShapeById(selectedShape.value.attrs.id);
    selectedShape.value = null;
  },

  /**
   * Удаление фигуры из состояния по айди
   * @param {Number | String} shapeId - ID фигуры
   */
  deleteShapeById(shapeId) {
    const findIndex = data.shapes.findIndex((existShape) => existShape.id == shapeId);
    if (findIndex === -1) return;
    data.shapes.splice(findIndex, 1);
  },

  /**
   * Загрузка нового изображения на канву
   * @param {File} file - Файл
   */
   loadNewImageIntoCanvas: async (file) => {
    const fileReader = new FileReader();

    const defaultImageWidth = 250;
    const defaultImageHeight = 250;

    fileReader.onloadend = () => {
      const shapeId = crypto.randomUUID();
      const imageId = crypto.randomUUID();

      data.shapes.push({
        id: shapeId,
        type: 'image',
        width: defaultImageWidth,
        height: defaultImageHeight,
        x: configKonva.width / 2 - defaultImageWidth / 2,
        y: configKonva.height / 2 - defaultImageHeight / 2,
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

  /**
   * Проверка, является ли фигура текстом
   */
  isShapeText: (shape) => {
    return shape.constructor.name === 'Text';
  },
};

// Переиспользуемые функции
const callbacks = {
  /**
   * Обработка начала перетаскивания
   * @param {Object} e Событие
   */
  groupDragStart: (e) => {
    const { target } = e;
    // Т.к. сейчас рисуем - не будем ничего передвигать
    if (isDrawingNow.value) {
      // Выключаем возможность перемещения, чтобы начать рисовать
      target.draggable(false);
      dangerouslyForceToAnotherIterationEventLoop(() => {
        target.draggable(props.isStageDraggable);
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
  /**
   * Обработка выхода за границы группы
   */
  groupPointerLeave: () => {
    document.body.style.cursor = 'default';
  },
  /**
   * Обработка наведения на группу
   */
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
    // Достаём тексты текущей выбранной группы
    const texts = group.children.filter((child) => child.constructor.name === 'Text');
    // Достаём фигуру или картинку
    const shape = group.children[0];
    // Достаём id, чтобы не вызывать в .find
    const shapeId = shape.id();
    // Делаем объект-трансформатор. Сюда будем кидать группу для преобразования
    const transformerNode = konva.value.transformer.getNode();
    // Достём объект канвы
    const stage = transformerNode.getStage();
    // Текущая выбранная нода
    const selectedNode = stage.findOne(`#${shape.id()}`);

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
        selectedShape.value = group.children[0];
      } else {
        selectedShape.value = selectedNode;
      }
      transformerNode.nodes([group]);

      // Функция получения сущностей канвы (координаты, поворот, и т.д.)
      const getEntities = () => {
        // Достаём текущий поворот и координаты
        const rotation = group.rotation();
        const position = {...group.position()};
        // Достаём размеры
        const scaleX = group.attrs.scaleX;
        const scaleY = group.attrs.scaleY;
        // Достаём ширину и высоту
        const width = group.width();
        const height = group.height();
        // Konva меняет scaleX и scaleY - мы узнаём точную ширину и высоту
        const correctWidthByScale = width * scaleX;
        const correctHeightByScale = height * scaleY;

        return { rotation, position, scaleX, scaleY, width, height, correctWidthByScale, correctHeightByScale };
      };

      // Ставим обработчики на конец трансформации для синхронизации состояния и канвы
      // @TODO Если возникнут проблемы с производительностью - смотреть сюда (возможно лучше будет ставить на transformend)
      group.on('transform', () => {
        // У стрелок отдельная ветка обработки в transformend
        if (shape.attrs.type === 'arrow') return;

        const { rotation, correctWidthByScale, correctHeightByScale } = getEntities();

        // Если слишком маленькие размеры у фигуры - дальше трансформировать не будем
        if (correctWidthByScale < 20 || correctHeightByScale < 20) {
          transformerNode.stopTransform();
          return;
        }

        // Меняем координаты и иные сущности внутри канвы (тут не меняем состояние, т.к.
        // нам не нужны ререндеры каждую миллисекунду)
        switch (shape.attrs.type) {
          case 'rectangle':
          case 'rect':
          case 'image': {
            group.rotation(rotation);
            group.width(correctWidthByScale);
            group.height(correctHeightByScale);
            shape.width(correctWidthByScale);
            shape.height(correctHeightByScale);
            texts.forEach((text) => {
              text.width(correctWidthByScale);
              // text.height(correctHeightByScale);
            });
            break;
          }
          case 'circle': {
            const scale = group.scaleY() * group.scaleX();
            const radius = shape.radius() * scale;
            shape.radius(radius);
            break;
          }
        }
        
        // Меняем scaleX, scaleY на изначальные значения
        group.scaleX(1);
        group.scaleY(1);
      });

      // Применение изменений в канве (тут пишем в состояние)
      group.on('transformend', () => {
        const { rotation, scaleX, scaleY, position, correctWidthByScale, correctHeightByScale } = getEntities();
        
        // Ищем фигуру
        const findShape = data.shapes.find((existShape) => {
          return existShape.id == shapeId;
        });
        
        // Если фигура была найдена - применяем трансформации
        if (findShape) {
          // Выносим фигуру на максимальный zIndex, т.к. трансформируемая фигура не должна быть снизу
          helpers.setShapeMaxZIndex(findShape.id);

          // Пишем в состояние (после этого последует ререндер)
          findShape.rotation = rotation;
          findShape.x = position.x;
          findShape.y = position.y;
          
          // Для стрелок - меняем scaleX, scaleY
          if (shape.attrs.type === 'arrow') {
            findShape.scaleX = scaleX;
            findShape.scaleY = scaleY;
          } else {
            findShape.width = correctWidthByScale;
            findShape.height = correctHeightByScale;
          }

          // Для круга - меняем радиус
          if (shape.attrs.type === 'circle') {
            const scale = group.scaleY() * group.scaleX();
            const radius = shape.radius() * scale;
            findShape.radius = radius;
          }

          // Меняем scaleX, scaleY на изначальные значения
          if (shape.attrs.type !== 'arrow') {
            group.scaleX(1);
            group.scaleY(1);
          }

          // Для корректного отображения
          requestAnimationFrame(() => {
            transformerNode.update();
            transformerNode.nodes([group]);
          });
        }
      });
    }
    else {
      // Для избежания утечек памяти отписываемся от событий
      group.off('transform transformend');
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

    // // Если пользователь выбрал текст - даём возможность редактировать его
    // if (helpers.isShapeText(target)) {
    //   const textarea = document.createElement('textarea');
    //   document.body.append(textarea);

      // const textPosition = target.getAbsolutePosition();

      // // then lets find position of stage container on the page:
      // const stageBox = konvaStage.value.container().getBoundingClientRect();

      // const areaPosition = {
      //   x: stageBox.left + textPosition.x,
      //   y: stageBox.top + textPosition.y,
      // };

    //   console.log('Клик по тексту: ', target.attrs.text);
    //   console.log('Координаты: ', areaPosition);

    //   textarea.value = target.text();
    //   textarea.style.position = 'absolute';
    //   textarea.style.top = areaPosition.y + 'px';
    //   textarea.style.left = areaPosition.x + 'px';
    //   textarea.style.width = target.width();

    //   textarea.focus();

    //   textarea.addEventListener('keydown', function (e) {
    //     // hide on enter
    //     if (e.keyCode === 13) {
    //       target.text(textarea.value);
    //       document.body.removeChild(textarea);
    //     }
    //   });
    // }

    // Если кликнули по канвасу - то убираем выделение активной фигуры
    if (target === target.getStage()) {
      selectedShape.value = null;
      const transformerNode = konva.value.transformer.getNode();
      transformerNode.nodes([]);
    }
  },

  /**
   * Выбор и редактирование текста
   * @param {Object} e - Событие
   */
  selectAndEditText: (e) => {
    const textNode = e.target;

    // Группа, в которой лежит фигура и все текста для неё
    const group = textNode.parent;
    // Фигура, в которой выбираем текст
    const shape = group.children[0];
    // Позиция фигуры относительно всей канвы
    const shapePosition = shape.getAbsolutePosition();

    // Координаты курсора относительно канвы
    const pointerPosition = konvaStage.value.getPointerPosition();
    // Координаты курсора относительно фигуры
    const pointerPositionInCanvas = {
      x: pointerPosition.x - shapePosition.x,
      y: pointerPosition.y - shapePosition.y,
    };

    /**
     * Проверка, кликнул ли пользователь в текущий текст
     * @param {Object} text - Объект текста
     * @param {Object} coords - Координаты клика
     */
    const isPointerInText = (text, coords) => {
      console.log({ text, coords });
      const diffX = (text.textWidth + text._partialTextX) - coords.x;
      const diffY = (text.textHeight + text._partialTextY) - coords.y;

      // Получаем положительную разность - значит клик был внутри
      if (diffX > 0 && diffY > 0) {
        console.log('Клик внутри');
        return true;
      }
    };

    // Вычисляем, какой из текстов выделить
    const onlyTextChildren = group.children.slice(1);
    const selectedText = onlyTextChildren.find((text) => isPointerInText(text, pointerPositionInCanvas));

    console.log(pointerPositionInCanvas)
    console.log('Кликнули по:', selectedText);

    const textPosition = textNode.getAbsolutePosition();

    // Позиция контейнера канвы на в документе:
    const stageBox = konvaStage.value.container().getBoundingClientRect();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    // console.log(textNode.width(), areaPosition);
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
    canvasPosition.value = { x: 0, y: 0 };
  },

  /**
   * Сбросить трансформации канвы
   */
  resetTransformCanvas: () => {
    canvasPosition.value = { x: 0, y: 0 };
  },

  /**
   * Начать процесс ввода нового текста к выделенной фигуре
   */
  startProcessAddTextToActiveShape: () => {
    // Зануляли ли мы значения в стейте. От этого зависят дальнейшие действия
    let isConfigAlreadyNullable = false;
    let isInputTextAlreadyNullable = false;

    // Пользователь нажал на уже активную кнопку - делаем тоггл
    if (isConfigOfTextVisible.value || isInputForEnterShapeTextVisible.value) {
      if (isConfigOfTextVisible.value) {
        isConfigAlreadyNullable = true;
        isConfigOfTextVisible.value = false;
      }
      if (isInputForEnterShapeTextVisible.value) {
        isInputTextAlreadyNullable = true;
        isInputForEnterShapeTextVisible.value = false;
      }
    }

    const shapeId = selectedShape.value.id();
    const findShape = data.shapes.find((existShape) => {
      return existShape.id == shapeId;
    });

    // Если ещё не задан конфиг для текста на фигуре - даём проставить
    if (!('textVerticalAlignment' in findShape)) {
      if (!isConfigAlreadyNullable) isConfigOfTextVisible.value = true;
    } else {
      // Иначе - пускай вводит текст для нанесения на фигуру
      if (!isInputTextAlreadyNullable) isInputForEnterShapeTextVisible.value = true;
    }
  },

  /**
   * Добавить текст к выделенной фигуре
   */
  addTextToSelectedShape: ({ text, align }) => {
    if (!Array.isArray(selectedShapeFromState.value.text))
      selectedShapeFromState.value.text = [];

    selectedShapeFromState.value.text.push(reactive({
      alignment: align,
      text: [
        {
          text,
          fontSize: 24,
          type: 'medium',
        }
      ],
    }));

    isInputForEnterShapeTextVisible.value = false;
    isConfigOfTextVisible.value = false;
  },

  /**
   * Добавить вертикальное выравнивание к фигуре
   * @param {'top' | 'middle' | 'bottom'} align - Выравнивание
   */
  setVerticalAlignActiveShape: (align) => {
    selectedShapeFromState.value.textVerticalAlignment = align;
    // isConfigOfTextVisible.value = false;

    // Если нет текста - то даём ввести текст
    if (!Array.isArray(selectedShapeFromState.value.text)) {
      selectedShapeFromState.value.text = [];
      isInputForEnterShapeTextVisible.value = true;
    }
  },

  /**
   * Установить видимость конфигурации для текста
   * @param {Boolean} status - Виден / не виден конфиг
   */
  setConfigOfTextVisibility: (status) => {
    isInputForEnterShapeTextVisible.value = false;
    isConfigOfTextVisible.value = status;
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

    const scaleBy = 0.1;
    // Определяем новое значение зума
    const newScale = direction > 0 ? oldScale + scaleBy : oldScale - scaleBy;

    // Не дадим полностью пропасть канве
    if (newScale <= 0) return;

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

  /**
   * Поставить нужный scale сразу
   */
  setScale: (scaleVal) => {
    scale.value = { x: scaleVal, y: scaleVal };
  },

  /**
   * Отправка конфига канвы на сервер
   */
  saveCanvasToServer: () => {
    const configToSend = data;

    console.group('Server save Canvas');
    console.log(configToSend);
    console.groupEnd('Server save Canvas');

    alert('Under construct');
  },
};

// Обработчики для рисования
const drawingHandlers = {
  /**
   * Обработка первого нажатия на канву. Начинаем рисовать здесь
   * @param {Object} event Событие
   */
  canvasPointerDown: (event) => {
    // Фигура не выбрана - пользователь не начинает рисовать
    if (!currentDrawingShape.value) return;
    const { x, y } = helpers.getPointerCoordinates(event.evt);
    isPointerDownNow.value = true;

    // Делаем это для того, чтобы мы могли начать рисовать, а не передвигать холст
    konvaStage.value.draggable(false);
    dangerouslyForceToAnotherIterationEventLoop(() => {
      konvaStage.value.draggable(props.isStageDraggable);
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
   * @param {Object} event Событие
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
        const radius = Math.ceil(Math.max(calculatedWidth, calculatedHeight));

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
   * @param {Object} event Событие
   */
  canvasPointerUp: async () => {
    if (!isDrawingNow.value) return;
    const correctConfig = toValue(currentShapeConfig.value);
    const drawnShape = { ...correctConfig };
    data.shapes.push(drawnShape);

    // Зануляем все координаты и размеры
    currentShapeConfig.value = makeShapeConfig({
      type: currentDrawingShape.value,
      zIndex: maxZIndex.value,
    });

    // Пользователь перестал рисовать на канве
    isPointerDownNow.value = false;
    currentDrawingShape.value = null;
  },
};
</script>

<style scoped>
.title {
  text-align: center;
}

.bottom-area {
  display: flex;
  justify-content: center;
  row-gap: 20px;
  padding-top: 20px;
  border-top: 2px solid var(--cornflower-blue);
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: center
}
</style>

<style>
body:has(#graphical-editor) {
  overflow-x: clip;
}
</style>
