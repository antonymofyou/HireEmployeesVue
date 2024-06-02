import { ApiRootClass, MainResponseClass } from '@/js/RootClasses';

export class AuthGetCandidateToken extends ApiRootClass {

    telegramData = {}; // словарь данных, которые пришли от телеграмма (id first_name username auth_date hash)
}

export class AuthGetCandidateTokenResponse extends MainResponseClass {
    candidateToken = '' //Токен кандидата
    device = ''; //Устройство кандидата
}