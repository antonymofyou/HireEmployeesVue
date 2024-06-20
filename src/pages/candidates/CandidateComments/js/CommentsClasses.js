import { MainRequestClass } from '@/js/RootClasses';

export class CandidatesSetCandidateComment extends MainRequestClass {
  // ID кандидата, которому нужно создать/обновить/удалить комментарий
  candidateId = '';
  // действие, которое нужно выполнить (доступные значения: 'create': создать комментарий; 'update': обновить комментарий; 'delete': удалить комментарий)
  action = '';
  // "для" (для какой сущности) чего создается комментарий (доступные значения для type: 'for_candidate': общий комментарий для кандидата; 'for_otklik:id_вакансии': комментарий для кандидата по отношению к отклику)
  commentFor = '';
  // ID комментария, который нужно обновить/удалить
  commentId = '';
  // текст комментария, который нужно обновить/создать
  commentText = '';
}

export class CandidateGetCandidateComments extends MainRequestClass {
  // ID кандидата, к которому необходимо добавить комментарий
  commentFor = '';
  // текст комментария
  candidateId = '';
}

export class VacanciesGetAllVacancyById extends MainRequestClass {
  vacancyId = ''; // ID вакансии, которую нужно получить
}

export class CandidatesGetOtklikAnswers extends MainRequestClass {
  otklikId = ''; // ID отклика, для которого нужно получить ответы
}

export class CandidatesSetOtklikStatus extends MainRequestClass {
  otklikId = ''; // ID отклика, статус которого нужно перевести в другой
  toStatusName = ''; // название статуса, В который нужно перевести отклик
}
