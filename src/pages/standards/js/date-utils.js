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
