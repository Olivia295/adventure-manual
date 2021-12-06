import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Missions from '../views/Missions.vue'
import Team from '../views/Team.vue'

import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Calendar from '@/views/Calendar.vue'

import firebase from "firebase/compat/app";
import "firebase/auth"

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requiresUnauth: true
        }
    },
    {
        path: '/missions',
        name: 'Missions',
        component: Missions,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/team',
        name: 'Team',
        component: Team,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            requiresUnauth: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            requiresUnauth: true
        }
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar,
        meta: {
            requiresUnauth: true
        }
    },
    // {
    //     path: '/secret',
    //     name: 'Secret',
    //     component: Secret,
    //     meta: {
    //         requiresAuth: true
    //     }
    // },
    //   {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    //   }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = firebase.auth().currentUser;
    if (requiresAuth && !isAuthenticated) {
        next("/login");
    } else {
        next();
    }
})

export default router