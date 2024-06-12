import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import ManagerAuth from "@/pages/authorization/ManagerAuth.vue";
import VacanciesListPage from "@/pages/vacancy/VacanciesList/VacanciesListPage.vue";
import VacancyIdPage from "@/pages/vacancy/VacancyIdPage/VacancyIdPage.vue";
import VacancyEditPage from "@/pages/vacancy/EditPage/VacancyEditPage.vue";
import CandidateComments from "@/pages/candidates/CandidateComments/CandidateComments.vue";
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
      path: "/candidate",
      name: "candidate",
      component: CandidateComments,
    }
  ],
});

export default router;
