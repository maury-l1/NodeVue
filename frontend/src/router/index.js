import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Tasks from '@/views/Tasks.vue'
import EditTask from '@/views/EditTask.vue'
import Users from '@/views/Users.vue'
import { adminGuard } from '@/middleware/adminGuard'
import { authGuard } from '@/middleware/authGuard' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/login" },
    {
      path: '/register',
      name: 'Register',
      component: Register

    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks,
      beforeEnter: authGuard
    },
    { path: '/tasks/edit/:id', component: EditTask, props: true },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      beforeEnter: adminGuard
    }
  ],
})

export default router
