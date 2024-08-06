import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import ManagerAuth from "@/pages/authorization/ManagerAuth.vue";
import VacanciesListPage from "@/pages/vacancy/VacanciesList/VacanciesListPage.vue";
import VacancyIdPage from "@/pages/vacancy/VacancyIdPage/VacancyIdPage.vue";
import VacancyEditPage from "@/pages/vacancy/VacancyEdit/VacancyEditPage.vue";
import CandidateCommentsPage from "@/pages/candidates/CandidateComments/CandidateCommentsPage.vue";
import CandidatesListPage from "@/pages/candidates/CandidatesList/CandidatesListPage.vue";
import EmployeesPage from "@/pages/employees/EmployeesPage.vue";
import StandardsPage from "@/pages/standards/StandardsPage.vue";
import VacancyPage from "@/pages/vacancy/VacancyPage.vue";

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
      path: "/employees",
      name: "employees",
      component: EmployeesPage
    },
    {
      path: "/standards",
      name: "standards",
      component: StandardsPage
    },
    {
      path: "/vacancy",
      name: 'vacancy',
      component: VacancyPage,
      redirect: {
        name: 'vacanciesList',
      },
      children: [
        {
          path: 'list',
          name: 'vacanciesList',
          component: VacanciesListPage,
        },
        {
          path: 'edit/:id',
          name: 'vacancy_edit',
          component: VacancyEditPage,
        },
        {
          path: 'candidates',
          name: 'candidates',
          component: CandidatesListPage,
        },
        {
          path: "candidate",
          name: "candidate",
          component: CandidateCommentsPage,
        },
      ],
    },
    {
      path: "/vac/:id",
      name: "Idvacancy",
      component: VacancyIdPage,
    },
  ],
});

export default router;
