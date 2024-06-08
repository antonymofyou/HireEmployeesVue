<template>
    <div class="wrapAuth">
        <h1>CRM для найма сотрудников</h1>
        <div class="auth">
            <h2 class="auth__header">Войдите как менеджер</h2>
            <CustomButton @click="authorizeVK()" :button-color="buttonColor" :text-color="textColor">
                <template v-slot:icon>
                    <img src="./assets/icons/VKIcon.svg">
                </template>
                <template v-slot:text>
                    Войти через VK ID
                </template>
            </CustomButton>
            <div v-if="errorMessage!=undefined" class="errorMessage">
                {{errorMessage}}
            </div>
        </div>
    </div>
</template>

<script setup>
import CustomButton from "@/components/CustomButton.vue"
import { ref } from "vue"
import { ApiRootClass } from "@/js/RootClasses.js"
import { configData } from "@/js/configData.js";
import { useRouter } from "vue-router"

//Переменные для кастомизации кнопки
const buttonColor = 'var(--VKColor)'
const textColor = 'var(--white)'

const router = useRouter();
let errorMessage = ref()

function authorizeVK(){
    location.assign("https://oauth.vk.com/authorize?client_id=51873425&display=page&redirect_uri=http://localhost/auth&response_type=code")
}
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
            if(response.success==='0'){
                errorMessage.value += ' '+response.message+'.'
            }
            else {
                setAuth(response.nasotkuToken, response.device)
                router.push({name:'home'})
            }
            
        },
        function (err) {
            console.log(err)
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
            if(response.success==='0'){
                errorMessage.value = response.message+'.'
                setAuth(undefined, undefined)
            }
            else getNasotkuTokenFromServer(response.vkToken, response.vkUserId)
            
        },
        function (err) {
            console.log(err)
        }
    )

}

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
