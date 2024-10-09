import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeComponent from '@/components/RecipeComponent.vue'
import LoginComponent from '@/components/LoginComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginComponent
    },
    {
      path: '/',
      name: 'home',
      component: HomeView //AllRecipe
    },
    {
      path: '/newrecipe',
      name: 'newrecipe',
      component: RecipeComponent,
      requiresAuth: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('router')
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    console.log('router.beforeEach token: ' + token);
    if (token) {
      console.log('User is authenticated, proceed to the route')
      next();
    } else {
      console.log('User is not authenticated, redirect to login')
      next('/login');
    }
  } else {
    console.log('Non-protected route, allow access')
    next();
  }
});

export default router
