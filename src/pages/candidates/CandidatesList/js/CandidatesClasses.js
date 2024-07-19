import { MainRequestClass } from '@/js/RootClasses';

export class CandidatesGetCandidatesByVacancyId extends MainRequestClass {
  // ID вакансии, для которой нужно получить отклики
  vacancyId = '';
  // статус отклика, по которому нужно получить отклики (если значение равно пустой строке или строке 'Все', то этот фильтр не учитывается)
  status = '';
}

export class VacanciesGetVacancyStatuses extends MainRequestClass {
  // ID вакансии, для которой нужно получить доступные статусы
  vacancyId = '';
  // возвращать ли возможные переводы статусов (заполнять ли $transfers в ответе) (по умолчанию 1, переводы возвращаются) (доступные значения: 0 - не возвращать, $transfers будет пустым; 1 - возвращать, $transfers будет НЕ пустым если есть доступные переводы)
  withTransfers = '';
}