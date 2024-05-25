import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import ManagerAuth from "@/pages/authorization/ManagerAuth.vue";
import VacanciesList from "@/pages/vacancy/VacanciesPage/VacanciesList.vue";
import VacancyIdPage from "@/pages/vacancy/VacanciesPage/components/VacancyIdPage.vue";
import VacancyEditPage from "@/pages/vacancy/EditPage/VacancyEditPage.vue";
import CandidatesList from "@/pages/candidates/CandidatesList.vue";
import CandidatComments from "@/pages/candidates/CandidatComments.vue";

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
      path: "/vacancy",
      name: "vacancy",
      component: VacanciesList,
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
      path: "/candidates",
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

export default router;
