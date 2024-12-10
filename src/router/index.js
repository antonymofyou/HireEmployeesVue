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
import SchedulePage from "@/pages/schedule/SchedulePage.vue";
import EmployeesListPage from "@/pages/employees/EmployeesList/EmployeesListPage.vue";
import EmployeeEditPage from "@/pages/employees/EmployeeEditPage/EmployeeEditPage.vue";

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
      component: EmployeesPage,
      redirect: {
        name: 'employeesList',
      },
      children: [
        {
          path: 'employees_list',
          name: 'employeesList',
          component: EmployeesListPage,
        },
        {
          path: 'employee_edit/:id',
          name: 'employeeEdit',
          component: EmployeeEditPage,
        },
      ]
    },
    {
      path: "/standards",
      name: "standards",
      component: StandardsPage
    },
    {
      path: "/schedule",
      name: "schedule",
      component: SchedulePage,
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
          path: 'vacancies_list',
          name: 'vacanciesList',
          component: VacanciesListPage,
        },
        {
          path: 'vacancy_edit/:id',
          name: 'vacancy_edit',
          component: VacancyEditPage,
        },
        {
          path: 'candidates_list',
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
      //name: "IdvacancyTG", сделали пока без авторизации
      name: "IdvacancyTemp",
      component: VacancyIdPage,
    },
    // {
    //   path: "/vacancy/:id",
    //   name: "IdvacancyTemp",
    //   component: VacancyIdPage,
    // },
  ],
});

export default router;
