import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import ManagerAuth from "@/pages/authorization/ManagerAuth.vue";
import VacanciesListPage from "@/pages/vacancy/VacanciesList/VacanciesListPage.vue";
import VacancyIdPage from "@/pages/vacancy/VacancyIdPage/VacancyIdPage.vue";
import VacancyEditPage from "@/pages/vacancy/VacancyEdit/VacancyEditPage.vue";
import CandidateCommentsPage from "@/pages/candidates/CandidateComments/CandidateCommentsPage.vue";
import CandidatesListPage from "@/pages/candidates/CandidatesList/CandidatesListPage.vue";
import DragNDrop from "@/pages/DragNDrop.vue";

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
      component: CandidatesListPage,
    },
    {
      path: "/candidate",
      name: "candidate",
      component: CandidateCommentsPage,
    },
    {
      path: "/dragndrop",
      name: "dragndrop",
      component: DragNDrop,
    }
  ],
});

export default router;
