/**
 * Привести время в привычный формат: hh:mm:ss -> hh:mm
 * @param {String} time - Время
 * @returns {String} - Время в привычном формате
 */
export function prettifyTime(time) {
  return time.split(':').slice(0, 2).join(':');
}

/**
 * Перевод минут в формат \d\d:\d\d
 * @param {Number | String} minutes - Минуты
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

/**
 * Маска для инпутов времени
 * @param {String} newVal - Новое значение
 * @param {String} prevVal - Предыдущее значение
 * @returns {String} - Маска
 */
export function maskifyValueToTime(newVal, prevVal) {
  // Часы и минуты как строки
  const [hours, mins] = newVal.split(':');
  // Часы и минуты как числа
  const [hoursNum, minsNum] = [hours, mins].map(Number);

  // Новый вводимый символ
  const newChar = [hours, mins].find((el) => el?.length > 2)?.at(-1);

  // Чтобы всегда оставалось двоеточие
  if (!newVal.includes(':') && prevVal.includes(':')) {
    return `${hours.slice(0, 2)}`;
  }

  // Чтобы не было возможности ввести три цифры в часе
  if (hours.length > 2) {
    return `${hours[0]}${hours[1]}:${newChar}`;
  }

  // Чтобы нельзя было вводить строку вида 25:34 и т.д.
  if (hoursNum > 23) {
    if (!mins) {
      return '23:';
    } else if (newChar) {
      return `${hours[0]}${hours[1]}:${newChar}`;
    }
  }

  // Автоматическое добавление двоеточия
  if (newVal.length === 2 && prevVal.length < newVal.length) {
    return newVal += ":";
  }

  // Для ограничения по длине строки
  if (newVal.length > 5) {
    return prevVal;
  }

  // Ввод неверной первой части строки часа
  if (hours?.[0] > 2) {
    return `0${hours?.[0]}:`;
  }

  // Ввод неверной первой части строки минут
  if (mins?.[0] > 5) {
    return `${hours}:5`;
  }

  return newVal;
}