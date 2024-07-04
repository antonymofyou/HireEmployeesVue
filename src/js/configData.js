export let configData = {
  BASE_URL: window.location.hostname == "bt21hire.ru" ? "https://bt21hire.ru" : "https://razrab.nasotku.ru",
  API_PATH: window.location.hostname == "bt21hire.ru" ? "/app/api" : "/api_razrab/hr/app/api",

  APP_SECRET_KEY_INT: "35610765967829788190",
  APP_SECRET_KEY_STRING: "Kb6CyKdu9EoXilm3sgQx",
  FIRST_TOKEN: "aTTtrQwvxPxGO6FOP5dd",

  VK_APP_ID: "51816166", //ID приложения ВК ID для авторизации
  TELEGRAM_AUTH_BOT: window.location.hostname == "bt21hire.ru" ? "bt21hirebot" : "razrab_nasotku_bot", //ID бота для авторизации через телеграм

  MANAGER_DEVICE_NAME:
    "263a4dbe41488fb87214b0032339dbb9f0c8da14c16dfcf13084bf3c2552eca0",
  MANAGER_TOK_NAME:
    "3c469e9d6c5875d37a43f353d4f88e61fcf812c66eee3457465a40b0da4153e0",
  SEEKER_DEVICE_NAME:
    "263a4dbe41488fb87214b0032339dbb9f0c8da14c16dfcf13084bf3c2552eca1",
  SEEKER_TOK_NAME:
    "3c469e9d6c5875d37a43f353d4f88e61fcf812c66eee3457465a40b0da4153e1",
};
