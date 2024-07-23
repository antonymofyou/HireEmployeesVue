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
 * @returns {Object} Конфиг фигуры
 */
export function makeShapeConfig() {
  return {
    // Общие
    type: null,
    id: crypto.randomUUID(),
    x: 0,
    y: 0,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 5,
    width: 0,
    height: 0,
  
    // Для Circle
    radius: 0,
  
    // Для Arrow
    points: [],
  };
}