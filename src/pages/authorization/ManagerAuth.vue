<template>
    <main>
        <div class="wrapAuth">
        <h1>CRM для найма сотрудников</h1>
        <div class="auth">
            <h2 class="auth__header">Войдите как менеджер</h2>
            <AuthButton @click="authorizeVK()"/>
            <div v-if="errorMessage!=undefined" class="errorMessage">
                {{errorMessage}}
            </div>
        </div>
    </div>
    </main>
</template>

<script setup>
import AuthButton from './components/AuthButton.vue'
import { ref } from "vue"
import { ApiRootClass } from "@/js/RootClasses.js"
import { configData } from "@/js/configData.js";
import { useRouter } from "vue-router"
import { isManager } from "@/js/AuthFunctions";

const router = useRouter();
const errorMessage = ref();

function authorizeVK(){
    location.assign(`https://oauth.vk.com/authorize?client_id=${configData.VK_APP_ID}&display=page&redirect_uri=${location.protocol}//${location.hostname}/auth&response_type=code`);
}
//Получаем значение параметра code из адресной строки
function getCodeParam() {
    let params = new URLSearchParams(window.location.search);
    return params.get('code');
}
//Проверяем, что параметр есть в адресной строке
function checkCodeParam() {
    return !!getCodeParam();
}
//Устанавливаем авторизацию в localstorage
function setAuth(nasotkuToken, device, managerType) {
    localStorage.setItem(configData.MANAGER_TOK_NAME, nasotkuToken);
    localStorage.setItem(configData.MANAGER_DEVICE_NAME, device);
    localStorage.setItem(configData.MANAGER_TYPE_NAME, managerType);
}
//Получаем токен nasotku //:(токенВК, идентификатор пользователя)
function getNasotkuTokenFromServer(vkToken, vkUserId) {
    //Расширяем ApiRootClass новыми полями
    class AttachVkAccountReq extends ApiRootClass {
        vkToken = "";
        vkUserId = "";
    }
    //Создаем экземпляр класса
    let requestClass = new AttachVkAccountReq();
    requestClass.vkToken = vkToken;
    requestClass.vkUserId = vkUserId;
    requestClass.request(
        '/auth/get_nasotku_token.php',
        'first',
        function (response) {
            if(response.success==='0'){
                errorMessage.value += ' '+response.message+'.'
            }
            else {
                console.log(response)             
                setAuth(response.nasotkuToken, response.device, response.managerType || '')
                router.push({name:'vacanciesList'})
            }
            
        },
        function (err) {
            errorMessage.value = err
        }
    );
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
            if(response.success==='0'){
                errorMessage.value = response.message+'.'
                setAuth(undefined, undefined)
            }
            else getNasotkuTokenFromServer(response.vkToken, response.vkUserId)
            
        },
        function (err) {
            errorMessage.value = err
        }
    )

}

if (isManager())
        router.push({name:'vacanciesList'})

if (checkCodeParam()) {
    getVkTokenFromServer()
}

</script>

<style scoped>
.wrapAuth{
    min-height: 100vh;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

* {
    margin: 0;
}

.errorMessage{
    text-align: center;
    margin-top:20px;
    color: var(--error-color);
}

.auth {
    max-width: 400px;
    padding: 30px;
    margin-top: 20px;
    border-radius: 20px;
    box-shadow: 0px 0px 100px 32px rgba(0, 0, 0, 0.1);
}

@media(max-width:480px){
    h1{
        font-size:1.5em;
    }
    h2{
        font-size:1em;
    }
    .auth{
        width:80%;
    }    
};

@media(min-width:480px){
    h1{
        font-size:1.8em;
    }
    h2{
        font-size:1.3em;
    }
    .auth {
        width: 100%
    }
};

.auth__header {
    text-align: center;
}
</style>
