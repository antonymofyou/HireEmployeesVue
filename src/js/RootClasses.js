import { sha256 } from "js-sha256";
import { configData } from "./configData.js";

export class ApiRootClass {
  signature = "";
  constructor() {}

  calcSignature(nasotku_token) {
    let class_vars = {};
    let class_vars_sort;
    let class_vars_final = {};
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        if (typeof this[key] === "object" || Array.isArray(this[key])) {
          // delete this[key], delete class_vars[key]
          continue;
        }
      }

      class_vars[key] = this[key];
    }
    delete this.signature;
    delete class_vars.signature;
    class_vars_sort = Object.keys(class_vars);
    class_vars_sort.sort();
    class_vars_sort.forEach((key) => {
      class_vars_final[key] = class_vars[key];
    });
    class_vars = class_vars_final;
    class_vars = Object.values(class_vars);
    let concat = class_vars.join("");
    concat = `${concat}${configData.APP_SECRET_KEY_INT}${configData.APP_SECRET_KEY_STRING}${nasotku_token}`;
    let sign_calc = sha256(concat);
    return sign_calc;
  }

  checkSignature(whoIs = "") {
    let nasotku_token = this.getTokenFromStorage(whoIs);
    return this.signature == this.calcSignature(nasotku_token);
  }

  makeSignature(whoIs) {
    let nasotku_token = this.getTokenFromStorage(whoIs);
    this.signature = this.calcSignature(nasotku_token);
  }

  // Получение токена из storage
  getTokenFromStorage(whoIs) {
    switch (whoIs) {
      case "manager":
        return localStorage.getItem(configData.MANAGER_TOK_NAME) ?? "";
      case "seeker":
        return localStorage.getItem(configData.SEEKER_TOK_NAME) ?? "";
      case "first":
        return configData.FIRST_TOKEN;
      default:
        return "";
    }
  }

  // Получение девайса из storage
  getDeviceFromStorage(whoIs) {
    switch (whoIs) {
      case "manager":
        return localStorage.getItem(configData.MANAGER_DEVICE_NAME) ?? "";
      case "seeker":
        return localStorage.getItem(configData.SEEKER_DEVICE_NAME) ?? "";
      case "first":
        return "";
      default:
        return "";
    }
  }

  // Метод отправки запроса
  async request(endPoint, whoIs, callback, errCallback) { // (адрес метода // кто запрашивает(seeker,manager) // коллбэк функция // коллбэк функция ошибки запроса)
    if(!errCallback) {
      errCallback = (err)=> { 
        alert(err); 
      }
    }
    
    let url = `${configData.BASE_URL}${configData.API_PATH}${endPoint}`
    this.makeSignature(whoIs);

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'whereFrom': 'js' // Данный заголовок запроса сообщает серверу о том, что запросы приходят с VUE платформы
            },
            body: JSON.stringify(this)
        });

        if (!response.ok) {
            errCallback(`Ошибка HTTP: ${response.status}`);
        }

        let responseData = await response.json();

        if (responseData.success === '-1') { // При success="-1" делаем разлогин пользователя
            this.logout(whoIs);
        } else { // В любом другом случае вызываем коллбэк функцию, в которую передаём ответ сервера, и далее обрабатыввем его внутри этой функции
            callback(responseData);
        }
    } catch (err) {
        errCallback(err);
    }
  }

  // Метод разлогина пользователя
  logout(whoIs) {
    switch (whoIs) {
      case "manager":
        localStorage.removeItem(configData.MANAGER_TOK_NAME);
        localStorage.removeItem(configData.MANAGER_DEVICE_NAME);
        break;
      case "seeker":
        localStorage.removeItem(configData.SEEKER_TOK_NAME);
        localStorage.removeItem(configData.SEEKER_DEVICE_NAME);
        break;
    }
    //window.location.reload();
  }
}

export class MainRequestClass extends ApiRootClass {
  device = "";

  //Переопределяем - добавляем доставание девайса из памяти
  makeSignature(whoIs = "") {
    this.device = this.getDeviceFromStorage(whoIs);
    super.makeSignature(whoIs);
  }
}

export class MainResponseClass extends ApiRootClass {
  success = "";
  message = "";
}
