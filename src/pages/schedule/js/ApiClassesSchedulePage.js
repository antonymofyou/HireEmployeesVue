import { MainRequestClass, MainResponseClass } from '@/js/RootClasses';

// метод: /app/api/job/get_schedule.php

export class JobGetShedule extends MainRequestClass {
  staffId = ''; // ID менеджера, по которому нужно вывести расписание, при пустом значении выводится расписание текущего пользователя

	filterStartDate = ''; // Дата начала за какой период нужно вывести расписание в формате yyyy-mm-dd

	filterEndDate = ''; // Дата конца за какой период нужно вывести расписание в формате yyyy-mm-dd
}

// метод: /app/api/job/set_day.php

export class JobSetDay extends MainRequestClass {
	/** @type {'create' | 'delete' | 'update'} */
	action = ''; // Тип действия: create - создать рабочий день, delete - удалить рабочий день, update - обновить рабочий день

	dayId = ''; // ID дня, для которого нужно выполнить действие

	/*
		* Словарь, который может содержать следующие поля:
		*  - date - дата дня в формате yyyy-mm-dd (доступно при $action == 'create' обязательно, при 'update' не обязательно)
		*  - spentTime - сколько времени сотрудник потратил за день в минутах (доступно при $action == 'update', не обязательно)
		*  - report - текст отчета (доступно при $action == 'update', не обязательно)
		*  - isWeekend - является ли этот день выходным (0/1) (доступно при $action == 'create' or 'update', обязательно)
		*  - comment - комментарий для дня (доступно при $action == 'create' or 'update', обязательно)
	*/
	setDay = ''; // Данные для создания/обновления дня (при $action == 'delete' пустой словарь)
}

// метод: /app/api/job/set_period.php

export class JobSetPeriod extends MainRequestClass {
	action = ''; // Действие, которое нужно сделать (доступные значения: 'create' - создать период; 'delete' - удалить период)

	dayId = ''; // ID дня, для которого нужно создать/удалить период работы

	periodId = ''; // ID периода, который нужно удалить (период должен относится к указанному $dayId. Если период с указанным ID относится к другому дню с другим dayId, то будет ошибка) (при $action == 'delete')

	periodStart = ''; // Время начало периода работы, которое нужно задать периоду работы при создании  (при $action == 'create')

	periodEnd = ''; // Время конца периода работы, которое нужно задать периоду работы при создании (при $action == 'create')
}
