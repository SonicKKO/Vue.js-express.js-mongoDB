import { createApp} from 'vue';
import './style.css';
import router from  './router/router.js'
import App from './App.vue';
import { createPinia } from 'pinia'
import { initAuth } from './auth';

initAuth(); 

createApp(App)
.use(createPinia())
.use(router)
.mount('#app')

