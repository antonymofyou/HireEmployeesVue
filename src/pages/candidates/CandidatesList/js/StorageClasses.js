// Константы, необходимые для взаимодействия с localStorage
export const storageConstants = {
  VACANCIES_STATUSES: 'VACANCIES_STATUSES',
};

// Класс для взаимодействия с localStorage
export class StorageActions {
  /**
   * Получение всех статусов
   * @returns {Object}
   */
  static getExistVacanciesStatuses() {
    const rawJson = localStorage.getItem(storageConstants.VACANCIES_STATUSES) ?? '{}';
    const existVacanciesStatuses = JSON.parse(rawJson);
    return existVacanciesStatuses;
  }

  /**
   * Сохранение статусов
   * @param {Object} statuses Объект статусов
   */
  static saveVacanciesStatuses(statuses) {
    localStorage.setItem(storageConstants.VACANCIES_STATUSES, JSON.stringify(statuses));
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
