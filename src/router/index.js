import { createRouter, createWebHistory } from "vue-router";
import { isManager, isSeeker } from "@/js/AuthFunctions";

import HomePage from "@/pages/HomePage.vue";
import ManagerAuth from "@/pages/authorization/ManagerAuth.vue";
import VacanciesListPage from "@/pages/vacancy/VacanciesList/VacanciesListPage.vue";
import VacancyIdPage from "@/pages/vacancy/VacancyIdPage/VacancyIdPage.vue";
import VacancyEditPage from "@/pages/vacancy/EditPage/VacancyEditPage.vue";
import CandidatComments from "@/pages/candidates/CandidatComments.vue";
import CandidatesList from "@/pages/candidates/CandidatesList/CandidatesListPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/auth",
      name: "managerAuth",
      component: ManagerAuth,
    },
    {
      path: "/vacancies_list",
      name: "vacanciesList",
      component: VacanciesListPage,
    },
    {
      path: "/vacancy/:id",
      name: "Idvacancy",
      component: VacancyIdPage,
    },
    {
      path: "/vacancy_edit/:id",
      name: "vacancy_edit",
      component: VacancyEditPage,
    },
    {
      path: "/candidates_list",
      name: "candidates",
      component: CandidatesList,
    },
    {
      path: "/canditate",
      name: "candidate",
      component: CandidatComments,
    }
  ],
});

// Проверка условий при роутинге
router.beforeEach((to, from, next) => {
  // Базовый путь для всех неавторизованных пользователей
  const baseRoute =
  to.name !== "managerAuth" && to.name !== "home" && to.name !== "Idvacancy";

  const goHome = { name: "home" };
  
  //Проверка на наличие авторизации пользователя
  if (baseRoute && !isManager() && !isSeeker()) {
    next(goHome);
  } else if (to.name === "managerAuth" && isManager()) { // Редирект менеджера со страницы авторизации для менеджера
    next(goHome);
  } else if (to.name === "Idvacancy" && isManager()) { // Редирект менеджера со страницы вакансии для кандидата
    next(goHome);
  } else if (baseRoute && !isManager()) { // Редирект кандидата со страниц предназначенных для менеджера
    next(goHome);
  } else {
    next();
  }
});

export default router;
