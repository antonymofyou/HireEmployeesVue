// Константы, необходимые для взаимодействия с localStorage
export const storageConstants = {
  VACANCY_PAGE_VACANCIES_STATUSES: 'VACANCY_PAGE_VACANCIES_STATUSES',
};

/**
 * Базовый класс взаимодействия с localStorage
 * Интерфейс взаимодействия совпадает с localStorage
 */
class StorageActionsBase {
  /**
   * Получить объект из localStorage
   * @param {String} key Ключ, по которому получим объект
   * @returns {Object} Результирующий объект
   */
  static getItem(key) {
    // сырая JSON-строка из localStorage
    const rawJson = localStorage.getItem(key) ?? '{}';
    const existVacanciesStatuses = JSON.parse(rawJson);
    return existVacanciesStatuses;
  }

  /**
   * Положить данные в localStorage
   * @param {String} key Ключ, по которому положим объект
   * @param {any} value Значение для сохранения
   */
  static setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

/**
 * Класс для вакансий на странице кандидата
 */
export class StorageVacanciesPageActions extends StorageActionsBase {
  /**
   * Получение всех статусов
   * @returns {Object} Объект статусов
   */
  static getExistVacanciesStatuses() {
    return this.getItem(storageConstants.VACANCY_PAGE_VACANCIES_STATUSES)
  }

  /**
   * Сохранение статусов
   * @param {Object} statuses Объект статусов
   */
  static saveVacanciesStatuses(statuses) {
    this.setItem(storageConstants.VACANCY_PAGE_VACANCIES_STATUSES, statuses);
  }

  /**
   * Получение статуса вакансии
   * @param {String} vacancyId ID вакансии
   * @returns {String | undefined}
   */
  static getVacancyStatus(vacancyId) {
    const existVacanciesStatuses = this.getExistVacanciesStatuses();
    const currentVacancyStatus = existVacanciesStatuses[vacancyId];
    return currentVacancyStatus;
  }

  /**
   * Обновление статуса вакансии
   * @param {String} vacancyId ID вакансии
   * @param {String} newStatusValue Значение статуса
   */
  static updateVacancyStatus(vacancyId, newStatusValue) {
    const existVacanciesStatuses = this.getExistVacanciesStatuses();
    existVacanciesStatuses[vacancyId] = newStatusValue;
    this.saveVacanciesStatuses(existVacanciesStatuses);
  }
}
