import { MainRequestClass, MainResponseClass } from '@/js/RootClasses';

// метод: /app/api/job/get_shedule.php

export class JobGetShedule extends MainRequestClass {
  managerId = ''; // ID менеджера, по которому нужно вывести расписание, при пустом значении выводится расписание текущего пользователя

	filterStartDate = ''; // Дата начала за какой период нужно вывести расписание в формате yyyy-mm-dd

	filterEndDate = ''; // Дата конца за какой период нужно вывести расписание в формате yyyy-mm-dd
}
