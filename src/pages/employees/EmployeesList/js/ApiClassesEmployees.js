import { MainRequestClass } from "@/js/RootClasses";

export class EmployeesSetEmployees extends MainRequestClass {
    managerId  = ''; // ID вакансии, которую нужно получить
    action = ''; // Кодовое слово для одного из действий: create, update, delete.
    set = []; // словарь с данными сотрудника для создания или обновления  userVkId, type, name.
}
