/**
 * Использовать только для компонента редактора и осторожно.
 * Использовать только в том случае, когда по другому придётся
 * уходить в большие затраты по памяти (сохранять в ref, reactive и т.д)
 * 
 * Выносит операцию на другую итерацию event loop через setTimeout
 * @param {Function} fn Функция, которую необходимо выполнить на следующей итерации
 */
export function dangerouslyForceToAnotherIterationEventLoop(fn) {
  setTimeout(() => fn(), 0);
}