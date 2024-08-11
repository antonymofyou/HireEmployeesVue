import { computed, ref, watchEffect } from 'vue';

/**
 * @typedef {Object} Ref - Vue ref
 * @property {any} value - Значение рефа
 */

/**
 * @typedef {Object} IOptions - Настройки
 * @property {Number} initMinWidth - Изначальная минимальная ширина
 * @property {Number} initMinHeight - Изначальная минимальная высота
 * @property {Array<any>} items - Список сущностей, за которыми следим. Они рендерятся в domNode
 */

/**
 * Composable для удержания размеров ноды от постоянных дёрганий
 * @param {Ref<HTMLElement>} domNode - Ref на дом-ноду
 * @param {Ref<IOptions>} options - Настройки
 * @returns {Object} - minWidth и minHeight для биндинга в css
 */
export default function useResizer(domNode, options) {
  const minWidth = ref(options.value.initMinWidth);
  const minHeight = ref(options.value.initMinHeight);

  // Для биндинга ширины в css
  const bindMinWidth = computed(() => {
    return minWidth.value + 'px';
  });

  // Для биндинга высоты в css
  const bindMinHeight = computed(() => {
    return minHeight.value + 'px';
  });

  // Инстанс ResizeObserver будет тут
  const observer = ref(null);

  // Следим за предыдущими сущностями. Смотря что с ними произошло - будем по разному действовать
  let prevItems = options.value.items;

  watchEffect((onCleanup) => {
    // Пропала domNode - не выполняем
    if (!domNode.value) return;

    // Если количество уменьшается - даём браузеру самому пересчитать размер
    if (prevItems.length > options.value.items.length) {
      // Сбрасываем на изначальное значение
      minWidth.value = options.value.initMinWidth;
      minHeight.value = options.value.initMinHeight;
    }
  
    observer.value = new ResizeObserver((entries) => {
      const listNodeRect = entries[0].contentRect;

      // Устанавливаем нужные размеры
      minWidth.value = listNodeRect.width;
      minHeight.value = listNodeRect.height;
  
      // Ставим текущие сущности как предыдущие
      prevItems = options.value.items;
    });
  
    // Начинаем следить за дом-нодой
    observer.value.observe(domNode.value);

    // Для избежания утечек памяти
    onCleanup(() => {
      // Убираем слежку за всеми дом-нодами
      observer.value.disconnect();
    });
  });

  return {
    bindMinWidth,
    bindMinHeight,
  };
}
