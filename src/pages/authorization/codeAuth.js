import { configData } from "../../js/configData.js";
import { AuthGetVkAccessTokenFromCode, 
  AuthGetVkAccessTokenFromCodeResp, 
  AuthGetNasotkuToken, 
  AuthGetNasotkuTokenResponse } from "./apiClassesAuth.js";

//Получение кода из вк из гет параметров
function getCodeFromGet() {
    return getClassParams().get('code');
}

//Общая функция для поиска query-параметров
function getClassParams() {
    return new URLSearchParams(window.location.search);
}

 
//Вызов необходимых функций в случае, если в гет параметрах есть code
if (getCodeFromGet()) {
    let code = getCodeFromGet()
    getVkTokenFromServer(code)
    window.location.replace('/vacancies')
}

//Получение токена вк от сервера с помощью code 
async function getVkTokenFromServer(code)  {
    const requestClass = new AuthGetVkAccessTokenFromCode()
    const responseClass = new AuthGetVkAccessTokenFromCodeResp()

    requestClass.code = code
    console.log(requestClass)
    await requestClass.request(
        '/auth/get_vk_access_token_from_code.php',
        'first', 
        function (response){//успешный результат
          console.log(response)
          getManagerTokenFromServer(response.vkToken, response.vkUserId);
        },
        function (err){//неуспешный результат
          alert(err);
        }
      );
}

//Получение nasotkuToken от сервера при помощи вк токена из функции getVkTokenFromServer
async function getManagerTokenFromServer(vkToken, vkUserId) {
  const requestClass = new AuthGetNasotkuToken()
  const responseClass = new AuthGetNasotkuTokenResponse()

  requestClass.vkToken = vkToken
  requestClass.vkUserId = vkUserId

  await requestClass.request(
    '/auth/get_nasotku_token.php',
    'first',
    function(response) {
      console.log(response)
      localStorage.setItem(configData.MANAGER_DEVICE_NAME, response.device)
      localStorage.setItem(configData.MANAGER_TOK_NAME, response.nasotkuToken)
    },
    function(err) {
      console.log(err)
    }
  )
}

