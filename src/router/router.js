import VueRouter from 'vue-router';
import store from '../store/store';
let router = new VueRouter({
    // mode: 'history',
    routes: [
        { path: "/", redirect: "login" },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/Home'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/login'),
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/register'),
        },
    ]
});
router.beforeEach((to, from, next) => {
    console.log('to:'+to.path,store.state.userInfo);
    switch (to.path) {
        case '/login':
            return next();
        case '/register':
            return next();
        default:
            if (store.state.userInfo.token !== null) next();
            else next('/login');
            break;
    }
});
export default router
