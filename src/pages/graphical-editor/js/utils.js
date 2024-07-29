/**
 * Использовать только для компонента редактора и осторожно, не пихать всюду.
 * Использовать только в том случае, когда по другому придётся
 * уходить в большие затраты по памяти (сохранять в ref, reactive и т.д)
 * 
 * Это хак, но он позволил, и возможно, позволит,
 * не плодить ещё больше сущностей в рамках компонента редактора
 * 
 * Выносит операцию на другую итерацию event loop через setTimeout
 * @param {Function} fn Функция, которую необходимо выполнить на следующей итерации
 */
export function dangerouslyForceToAnotherIterationEventLoop(fn) {
  setTimeout(() => fn(), 0);
}

/**
 * Фабрика для конфига фигуры
 * @param {Number} zIndex zIndex для инициализации фигуры
 * @returns {Object} Конфиг фигуры
 */
export function makeShapeConfig(zIndex) {
  return {
    // Общие
    type: null,
    id: crypto.randomUUID(),
    x: 0,
    y: 0,
    fill: '#ff0000',
    stroke: '#000000',
    strokeWidth: 5,
    width: 0,
    height: 0,
    zIndex,
  
    // Для Circle
    radius: 0,
  
    // Для Arrow
    points: [],
  };
}

/**
 * Преобразовать число от 0 до 1 в проценты
 * @param {Number} num Число от 0 до 1
 * @returns {String} Строка с числом в виде процентов
 */
export function formatNumToPercent(num) {
  return new Intl.NumberFormat('RU-ru', {
    style: 'percent'
  }).format(num);
}

/**
 * Функция debounce для отложенного вызова
 * @param {Function} fn - Функция для отложенного вызова
 * @param {Number} ms - Количество миллисекунд
 * @returns {Object} - Отложенная функция и функция отписки
 */
export function makeDebouncedFn(fn, ms = 1000) {
  let timer = null;

  const debouncedFn = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };

  const unSubscribe = () => clearTimeout(timer);

  return { debouncedFn, unSubscribe };
}