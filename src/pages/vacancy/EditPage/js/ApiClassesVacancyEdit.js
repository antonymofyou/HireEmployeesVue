import { MainRequestClass, MainResponseClass } from '@/js/RootClasses';


//метод /app/api/vacancies/get_all_vacancy_by_id.php

export class VacanciesGetAllVacancyById extends MainRequestClass {
    vacancyId = ''; // ID вакансии, которую нужно получить
}

export class VacanciesGetAllVacancyByIdResponse extends MainResponseClass {
    /*
     * Словарь, который имеет следующие поля:
     *     - id - идентификатор вакансии
     *     - name - название вакансии
     *     - description - описание вакансии
     *     - published - опубликована ли вакансия (0/1)
     *     - createdAt - дата создания вакансии
     */
    vacancy = {}; // данные вакансии

    /*
     * Массив словарей, где каждый словарь имеет следующие поля:
     *     - id - идентификатор вопроса
     *     - question - текст вопроса
     *     - type - тип вопроса
     *     - published - опубликован ли вопрос (0/1)
     */
    questions = []; // массив словарей со списком вопросов (может быть пустой массив, если вопросов нет)
}



//метод /app/api/vacancies/questions/create_vacancy_question.php

export class VacanciesQuestionsCreateVacancyQuestion extends MainRequestClass {
    vacancyId = ''; // ID вакансии (обяз.)
    question = ''; // текст вопроса (не обяз.)
    type = ''; // тип вопроса (не обяз.)
    published = ''; // опубликовать ли вопрос у вакансии (0/1) (не обяз., по умолчанию 0)
}


export class VacanciesQuestionsCreateVacancyQuestionResponse extends MainResponseClass {
    /*
     * Словарь, который имеет следующие поля:
     *     - id - идентификатор вопроса
     *     - vacancyId - идентификатор вакансии, к которой принадлежит вопрос
     *     - question - текст вопроса
     *     - type - тип вопроса
     *     - published - опубликован ли вопрос (0/1)
     */
    question = []; // данные созданного вопроса
}


    /*
        адрес метода /app/api/vacancies/update_vacancy.php
        должен быть указан хотя бы один параметр для обновления: либо один не обяз. параметр в $vacancy,
        либо один элемент в массиве $question с одним не обяз. параметром, иначе будет ошибка (то есть в запросе должны быть хотя бы какие-то данные для обновления)
     */
export class VacanciesUpdateVacancy extends MainRequestClass {

    vacancyId = ''; // идентификатор вакансии, которую нужно обновить (обяз.)

    /*
     * Словарь, который имеет следующие поля:
     *     - name - новое название вакансии (не обяз.)
     *     - description - новое описание вакансии (не обяз.)
     *     - published - новый статус публикации вакансии (0/1) (не обяз.)
     */
    vacancy = {}; // данные вакансии, которые нужно обновить

    /*
     * Словарь, где ключ это ID вопроса, а значение - ещё один словарь, имеет следующие поля:
     *     - type - новый тип вопроса (не обяз.)
     *     - question - новый текст вопроса (не обяз.)
     *     - published - новый статус публикации у вопроса (0/1) (не обяз.)
     */
    questions = {}; // вопросы вакансии, которые нужно обновить. Вопросы должны относится к вакансии, указанной в $vacancyId, иначе будет ошибка, что вопросы не найдены

}

//адрес метода /app/api/vacancies/update_vacancy.php
export class VacanciesQuestionsDeleteVacancyQuestion extends MainRequestClass {
    questionId = ''; // ID вопроса, который необходимо удалить
}