<template>
    <h1>CRM для найма сотрудников</h1>
    <div class="auth">
        <h2 class="auth__header">Войдите как менеджер</h2>
        <button id="VKIDSDKAuthButton" class="auth__vk-login VkIdWebSdk__button VkIdWebSdk__button_reset">
            <div class="VkIdWebSdk__button_container">
                <div class="VkIdWebSdk__button_icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M4.54648 4.54648C3 6.09295 3 8.58197 3 13.56V14.44C3 19.418 3 21.907 4.54648 23.4535C6.09295 25 8.58197 25 13.56 25H14.44C19.418 25 21.907 25 23.4535 23.4535C25 21.907 25
               19.418 25 14.44V13.56C25 8.58197 25 6.09295 23.4535 4.54648C21.907 3 19.418 3 14.44 3H13.56C8.58197 3 6.09295 3 4.54648 4.54648ZM6.79999 10.15C6.91798 15.8728 9.92951 19.31 14.8932 19.31H15.1812V16.05C16.989 16.2332 18.3371 
               17.5682 18.8875 19.31H21.4939C20.7869 16.7044 18.9535 15.2604 17.8141 14.71C18.9526 14.0293 20.5641 12.3893 20.9436 10.15H18.5722C18.0747 11.971 16.5945 13.6233 15.1803 13.78V10.15H12.7711V16.5C11.305 16.1337 9.39237 14.3538 9.314 10.15H6.79999Z"
                            fill="white" />
                    </svg>
                </div>
                <div class="VkIdWebSdk__button_text">
                    Войти через VK ID
                </div>
            </div>
        </button>
    </div>
</template>

<script setup>
import { onMounted } from "vue"
import { ApiRootClass } from "@/js/RootClasses.js"
import { configData } from "@/js/configData.js";

let button = null

//Получаем значение параметра code из адресной строки
function getCodeParam() {
    let params = new URLSearchParams(window.location.search)
    return params.get('code')
}
//Проверяем, что параметр есть в адресной строке
function checkCodeParam() {
    return !!getCodeParam()
}
//Устанавливаем авторизацию в localstorage
function setAuth(nasotkuToken, device) {
    localStorage.setItem(configData.MANAGER_TOK_NAME, nasotkuToken)
    localStorage.setItem(configData.MANAGER_DEVICE_NAME, device)
}
//Получаем токен nasotku //:(токенВК, идентификатор пользователя)
function getNasotkuTokenFromServer(vkToken, vkUserId) {
    //Расширяем ApiRootClass новыми полями
    class AttachVkAccountReq extends ApiRootClass {
        vkToken = "";
        vkUserId = "";
    }
    //Создаем экземпляр класса
    let requestClass = new AttachVkAccountReq()
    requestClass.vkToken = vkToken
    requestClass.vkUserId = vkUserId
    requestClass.request(
        '/auth/get_nasotku_token.php',
        'first',
        function (response) {
            console.log(response)
            setAuth(response.nasotkuToken, response.device)
        },
        function (err) {
            console.error(err)
        }
    )
}

function getVkTokenFromServer() {
    class AuthGetVkAccessTokenFromCode extends ApiRootClass {
        code = ''; // code, пришедший от VK для получения access_token
    }
    let requestClass = new AuthGetVkAccessTokenFromCode()
    requestClass.code = getCodeParam()

    requestClass.request(
        '/auth/get_vk_access_token_from_code.php',
        "first",
        function (response) {
            console.log(response)
            getNasotkuTokenFromServer(response.vkToken, response.vkUserId)
        },
        function (err) {
            console.error(err)
        }
    )

}

if (checkCodeParam()) {
    getVkTokenFromServer()
}


onMounted(() => {

    const sources = [
        'https://unpkg.com/@vkid/sdk@latest/dist-sdk/umd/index.js'
    ]
    sources.forEach(source => {
        const script = document.createElement('script');
        script.src = source;
        document.head.appendChild(script);
    });
    //После монтирования компонента находим кнопку и вешаем событие
    const button = document.getElementById('VKIDSDKAuthButton')
    console.log(button)
    if (button) {
        // Добавление обработчика клика по кнопке.
        button.onclick = () => {
            //Пока что не знаю какой должен быть redirect, подробнее https://dev.vk.com/ru/api/access-token/authcode-flow-user#%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B4%D0%B8%D0%B0%D0%BB%D0%BE%D0%B3%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8
            location.assign("https://oauth.vk.com/authorize?client_id=51873425&display=page&redirect_uri=http://localhost/auth&response_type=code")
        }
    }
});

</script>

<style>
* {
    margin: 0;
}

body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.auth {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    margin-top: 20px;
    border-radius: 20px;
    box-shadow: 0px 0px 100px 32px rgba(0, 0, 0, 0.1);
}

.auth__header {
    text-align: center;
}


.VkIdWebSdk__button_reset {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
}

.VkIdWebSdk__button {
    background: #0077ff;
    cursor: pointer;
    transition: all .1s ease-out;
}

.VkIdWebSdk__button:hover {
    opacity: 0.8;
}

.VkIdWebSdk__button:active {
    opacity: .7;
    transform: scale(.97);
}

.VkIdWebSdk__button {
    border-radius: 8px;
    width: 100%;
    min-height: 44px;
}

.VkIdWebSdk__button_container {
    display: flex;
    align-items: center;
    padding: 8px 10px;
}

.VkIdWebSdk__button_icon+.VkIdWebSdk__button_text {
    margin-left: -28px;
}

.VkIdWebSdk__button_text {
    display: flex;
    font-family: -apple-system, system-ui, "Helvetica Neue", Roboto, sans-serif;
    flex: 1;
    justify-content: center;
    color: #ffffff;
}

.auth__vk-login {
    margin-top: 20px;
}
</style>