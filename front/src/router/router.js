import { createWebHistory, createRouter } from 'vue-router';

import News from '../components/News.vue';
import FullNews from '../components/FullNews.vue';
import SignIn from '../components/SignIn.vue';
import LogIn from '../components/LogIn.vue';
import Profile from '../components/Profile.vue'

const routes = [
    { path: '/', component: News, name: 'news'},
    { path: '/FullNews/:_id', component: FullNews, name: 'fullnews' },
    { path: '/SignIn', component: SignIn, name: 'signin' },
    { path: '/LogIn', component: LogIn, name: 'login' },
    { path: '/Profile', component: Profile, name: 'profile', meta: { reuiresAuth: true } }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});



router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.name === 'profile' && !token) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;