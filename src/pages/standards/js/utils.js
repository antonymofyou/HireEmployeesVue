/**
 * Отформатировать время
 * @param {String | Date} time - Время для форматирования
 * @returns {String} - Отформатированное время
 */
export function formatTime(time) {
  const formatter = new Intl.DateTimeFormat(
    'RU',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return formatter.format(new Date(time));
}

/**
 * @typedef {import('../StandardsPage.vue').Period} Period
 * 
 * Получить текст отчёта к определённому периоду
 * @param {Array<Object>} dataByDate - Данные для графика
 * @param {Period} period - Объект периода
 * @returns {String} - Текст отчёта по периоду
 */
export function getReportText(dataByDate, period) {
  return dataByDate.find((d) => d.forDate === period.forDate).report ?? '';
}