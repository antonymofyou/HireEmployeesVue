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

/**
 * Перевод минут в формат \d\d:\d\d
 * @param {Number|String} minutes - Минуты
 * @returns {String} - Отформатированное значение
 */
export function convertMinsToHrsMins(minutes) {
  const correctMinutes = Number(minutes);

  let h = Math.floor(correctMinutes / 60);
  let m = correctMinutes % 60;

  h = h < 10 ? '0' + h : h; 
  m = m < 10 ? '0' + m : m; 

  return h + ':' + m;
}

/**
 * Перевод формата \d\d:\d\d в формат минут в виде числа
 * @param {String} - Время вида \d\d:\d\d
 * @returns {Number} - Минуты
 */
export function convertHrsMinsToMins(hoursMinutes) {
  const [hours, minutes] = hoursMinutes.split(':');
  return Number(hours) * 60 + Number(minutes);
}
