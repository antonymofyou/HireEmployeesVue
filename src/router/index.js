import { createRouter, createWebHistory } from "vue-router";

import Authorization from "@/pages/authorization/Authorization.vue";
import ManagerAuth from "@/pages/authorization/ManagerAuth.vue";
import HomePage from "@/pages/HomePage.vue";
import VacanciesPage from "@/pages/vacancy/VacanciesPage.vue";
import VacancyIdPage from "@/pages/vacancy/VacancyIdPage.vue";
import VacancyCreate from "@/pages/vacancy/VacancyCreate.vue";
import CandidatesList from "@/pages/candidates/CandidatesList.vue";
import CandidatComments from "@/pages/candidates/CandidatComments.vue";
import VacancyEditPage from "@/pages/vacancy/VacancyEditPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/authorization",
      name: "auth",
      component: Authorization,
    },
    {
      path: "/auth",
      name: "managerAuth",
      component: ManagerAuth,
    },
    {
      path: "/vacancy",
      name: "vacancy",
      component: VacanciesPage,
    },
    {
      path: "/vacancy/:id",
      name: "Idvacancy",
      component: VacancyIdPage,
    },
    {
      path: "/vacancy/create",
      name: "create",
      component: VacancyCreate,
    },
    {
      path: "/candidates",
      name: "candidates",
      component: CandidatesList,
    },
    {
      path: "/canditate",
      name: "candidate",
      component: CandidatComments,
    },
    {
      path: "/vacancy_edit/:id",
      name: "vacancy_edit",
      component: VacancyEditPage,
    },
  ],
});

export default router;
