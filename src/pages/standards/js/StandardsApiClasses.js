import { MainRequestClass } from '@/js/RootClasses';

// Класс получения стандартов
export class GetStandards extends MainRequestClass {
    // тип запроса, по которому нужно вернуть список стандартов ('all', 'didnt_learn')
	type = '';
}

// Получение пользователей, которые не ознакомились со стандартом
export class GetUsersDidntLearnStandard extends MainRequestClass {
    // id стандарта, для которого нужно получить пользователей (для всех стандартов - 'all')
	standardId = '';
}

// Получение стандарта по ID
export class GetStandardById extends MainRequestClass {
    // идентификатор стандарта
    standardId = '';
}

// Получение стандарта по ID
export class SetStandardLearned extends MainRequestClass {
    // идентификатор стандарта
    standardId = '';
    // комментарий пользователя
    comment = '';
}

// Получение стандарта по ID
export class SetStandard extends MainRequestClass {
    // идентификатор стандарта
    standardId = '';
    // действие, которое нужно выполнить ('create' - создать стандарт; 'update' - обновление стандарта; 'delete' - удаление стандарта)
    action = '';
    // объект с данными (name, link, process, updatedAt)
    standard = '';
}

// Получение пользователей, которым выдан доступ к процессу
export class GetUsersForProcess extends MainRequestClass {
    // название процесса, по которому нужно получить пользователей
    process = '';
}

// Действие с доступом пользователей к процессу
export class SetUsersForProcess extends MainRequestClass {
    // название процесса, для которого нужно обновить доступ пользователей
    process = '';
    // Массив словарей, где каждый словарь имеет следующие поля: userId, accessType
    processAccess = '';
}

// Получение комментариев к стандарту
export class GetLearnedComments extends MainRequestClass {
    // идентификатор стандарта
    standardId = '';
    // идентификатор пользователя
    userId = '';
}

// Сброс изучения стандарта
export class ResetStandardLearn extends MainRequestClass {
    // идентификатор комментария об изучении
    learnedCommentId = '';
}