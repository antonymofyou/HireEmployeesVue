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

export class VacanciesGetVacancyStatuses extends MainRequestClass {
    vacancyId = ''; // ID вакансии, для которой нужно получить доступные статусы
}

export class VacanciesModifyVacancyStatus extends MainRequestClass {
    vacancyId = ''; // ID вакансии, для которой нужно создать/обновить/удалить статус
  
    action = ''; // действие, которое нужно выполнить (доступные значения: 'create': создать статус; 'update': обновить статус; 'delete': удалить статус)
  
    statusName = ''; // название статуса, который нужно создать/обновить/удалить
  
    statusComment = ''; // комментарий к статусу, который нужно задать при создании статуса/обновить при обновлении статуса
  
    statusColor = ''; // цвет статуса (hex), который нужно задать при создании статуса/обновить при обновлении статуса
  
    // при каждом запросе на обновление статуса учитывается и $statusComment, и $statusColor. Если они будут равны пустой строке - для статуса они будут заданы как пустые строки
  }

  export class VacanciesSetVacancyStatusTransfer extends MainRequestClass {
    vacancyId = ''; // ID вакансии, для которой нужно создать/удалить возможный перевод для статуса отклика
  
    action = ''; // действие, которое нужно выполнить (доступные значения: 'create': создать перевод статуса; 'delete': удалить перевод статуса)
  
    statusName = ''; // название статуса, для которого нужно создать/удалить возможный перевод
  
    toStatusName = ''; // название статуса, перевод в который нужно создать/удалить
  }
  export class VacanciesSortVacancyStatus extends MainRequestClass {
    vacancyId = ''; // ID вакансии, к которой относятся оба статуса

    statusName = ''; // название статуса, который нужно переместить

    direction = ''; // направление сортировки, на сколько нужно позиций нужно переместить вверх или вниз (положительное число - увеличивает значение сортировки, опуская статус вниз, отрицательное - уменьшает значение сортировки, поднимая статус вверх; в случае нуля будет ошибка) (сортировка статусов при выдаче происходит от меньшего значения к большему)
}

export class VacanciesAccessGetManagerAccessVacancy  extends MainRequestClass {
    vacancyId = ''; // ID вакансии, для которой нужно получить менеджеров
    statusName = ''; //// название статуса
    permissionType = ''; // Тип прав, информацию о которых необходимо получить 
}
export class VacanciesAccessSetManagerAccessVacancy   extends MainRequestClass {
    vacancyId = ''; // ID вакансии, для которой нужно получить менеджеров
    permissionType = ''; // Тип прав, информацию о которых необходимо получить 
    action = ""; //Действие которое нужно сделать с менеджером (добавить/удалить)
    statusName = ''; //название статуса, на который нужно добавить менеджера
    managerId = '' // id менеджера
}

export class VacanciesSortVacancyQuestion extends MainRequestClass {
    vacancyId = ''; // ID вакансии, к которой относятся вопросы

    questionId = ''; // ID вопроса, который нужно переместить

    direction = ''; // направление сортировки, на сколько нужно позиций нужно переместить вверх или вниз (положительное число - увеличивает значение сортировки, опуская вопрос вниз, отрицательное - уменьшает значение сортировки, поднимая вопрос вверх; в случае нуля будет ошибка) (сортировка вопросов при выдаче происходит от меньшего значения к большему)

}
