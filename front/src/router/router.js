import { createWebHistory, createRouter } from 'vue-router';

import News     from '../components/News/News.vue';
import FullNews from '../components/News/FullNews.vue';
import SignIn   from '../components/SignIn.vue';
import LogIn    from '../components/LogIn.vue';
import Profile  from '../components/Profile.vue';
import AddNews  from '../components/Admin/AddNews.vue';
import NewsList from '../components/Admin/NewsList.vue';
import ChatList from '../components/Chats/ChatList.vue';
import Chat     from '../components/Chats/Chat.vue';
import Users from '../components/Users.vue';
import ViewProfile from '../components/ViewProfile.vue';

const routes = [
    { path: '/',              component: News,     name: 'news'},
    { path: '/FullNews/:_id', component: FullNews, name: 'fullnews' },
    { path: '/SignIn',        component: SignIn,   name: 'signin' },
    { path: '/LogIn',         component: LogIn,    name: 'login' },
    { path: '/Profile',       component: Profile,  name: 'profile',    meta: { reuiresAuth: true } },
    { path: '/AddNews',       component: AddNews,  name:'addnews' },
    { path: '/NewsList',      component: NewsList, name: 'newslist' },
    { path: '/ChatList',      component: ChatList, name: 'chatlist' },
    { path: '/Chat/:chatId',  component: Chat,     name: 'chat',       props: true },
    { path: '/Users',          component: Users, name: 'users' }, 
    { path: '/User/:userId',   component: ViewProfile, name: 'viewprofile' },     
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.name === 'profile' && !token) {
    next({ name: 'login' });
    return;
  }
  
  next();
});

export default router;