import { MainRequestClass, MainResponseClass } from '@/js/RootClasses';

// метод /app/api/vacancies/get_vacancy_by_id.php - для соискателя

export class VacanciesGetVacancyById extends MainRequestClass {
    vacancyId = ''; // ID вакансии, которую нужно получить
}

export class VacanciesGetVacancyByIdResponse extends MainResponseClass {
    /*
    * Словарь, который имеет следующие поля:
    *     - id - идентификатор вакансии
    *     - name - название вакансии
    *     - description - описание вакансии
    *     - createdAt - дата создания вакансии
    */
    vacancy = {}; // данные вакансии (поиск происходит по опубликованным вакансиям)
    
    /*
     * Массив словарей, где каждый словарь имеет следующие поля:
     *     - id - идентификатор вопроса
     *     - type - тип вопроса
     *     - question - текст вопроса
     *     - answer - ответ кандидата (если кандидат не отвечал на этот вопрос - этого поля не будет для текущего элемента)
     */
    questions = []; // вопросы вакансии (поиск по опубликованным вопросам; может быть пустой массив, если вопросов нет)
}

export class CandidatesSendCandidateAnswers extends MainRequestClass {
    
    /*
     * Словарь, где ключ это ID вопроса, а значение текст ответа кандидата, например:
     *     - 5: "ответ на вопрос"
     *     - 7: "ответ на вопрос"
     */
    answers = {}; // ответы на вопросы (все вопросы должны принадлежать к одной вакансии)

    forceSave = ''; // флаг принудительного сохранения (0/1) (по умолчанию 0). Если при попытке перезаписи старого ответа с другого устройства этот флаг будет равен 0, то будет ошибка. Если пользователь уверен, что нужно перезаписать ответ, то этот флаг нужно установить в 1

    finish = ''; // флаг окончания заполнения ответов и отправки отклика на вакансию (0/1) (по умолчанию 0). Если этот флаг равен 0, то вопросы просто сохранятся, но отклик отправлен не будет. Чтобы отклик был отправлен нужно установить этот флаг в 1. Отклик может быть отправлен только если кандидат ответил на все вопросы
}

export class CandidatesGetCandidateUserInfo extends MainRequestClass {
    
    /*
     * Словарь, который может содержать следующие поля:
     *     - fio - новое ФИО, на которое нужное изменить текущее значение
     */
    userInfo = []; // данные пользователя, которые нужно изменить (передавать не обязательно, если изменять данные не требуется)
}

export class CandidatesGetCandidateUserInfoResponse extends MainResponseClass {
    /*
     * Словарь, который содержит следующие поля:
     *     - fio - ФИО кандидата (может быть пустой строкой)
     *     - tgNickname - никнейм телеграмма кандидата
     */
    userInfo = []; // данные пользователя (если требовалось их изменить - вернутся уже обновленные данные)
}

