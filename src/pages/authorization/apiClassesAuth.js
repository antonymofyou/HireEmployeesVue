import { ApiRootClass, MainRequestClass, MainResponseClass } from "../../js/RootClasses.js";

export class AuthGetVkAccessTokenFromCode extends ApiRootClass {
    code = ''; // code, пришедший от VK для получения access_token
}

export class AuthGetVkAccessTokenFromCodeResp extends MainResponseClass {
    vkToken = ''; // VK access_token
    vkUserId = ''; // VK ID пользователя, для которого получен токен
}

export class AuthGetNasotkuToken extends ApiRootClass {

    vkToken = '';
    vkUserId = '';
}

export class AuthGetNasotkuTokenResponse extends MainResponseClass {

    nasotkuToken = '';
    device = '';
}