import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeComponentView from '@/views/RecipeView.vue'
import LoginComponent from '@/components/LoginComponent.vue'
import SaleTicketsComponent from '@/components/SaleTicketComponent.vue'
import InvoiceComponent from '@/components/InvoiceComponent.vue'
import EstadisticaComponent from '@/components/EstadisticaComponent.vue'
import MedicalRecordComponent from '@/components/MedicalRecordComponent.vue'
import MembershipView from '@/views/MembershipView.vue'
import CalendarView from '@/views/CalendarView.vue'
import BinacleView from '@/views/BinacleView.vue'

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
      path: '/binacle',
      name: 'binacle',
      component: BinacleView
    },
    {
      path: '/newrecipe',
      name: 'newrecipe',
      component: RecipeComponentView,
      requiresAuth: true
    },
    {
      path: '/saletickets',
      name: 'sales',
      component: SaleTicketsComponent,
      requiresAuth: true
    },
    {
      path: '/facturacion',
      name: 'facturacion',
      component: InvoiceComponent,
      requiresAuth: true
    },
    {
      path: '/estadisticas',
      name: 'estadisticas',
      component: EstadisticaComponent,
      requiresAuth: true
    },
    {
      path: '/medicalrecord',
      name: 'medicalrecord',
      component: MedicalRecordComponent,
      requiresAuth: true
    },
    {
      path: '/membership',
      name: 'membership',
      component: MembershipView,
      requiresAuth: true
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
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
