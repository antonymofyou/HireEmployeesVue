/**
 * Привести время в привычный формат: hh:mm:ss -> hh:mm
 * @param {String} time - Время
 * @returns {String} - Время в привычном формате
 */
export function prettifyTime(time) {
  return time.split(':').slice(0, 2).join(':');
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
