import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import PrimeVue from 'primevue/config';
// import Aura from '@primevue/themes/aura';
import './style.css';
import App from './App.vue';

import { registerPermissionDirectives } from './directives/permission';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
registerPermissionDirectives(app);

app.use(PrimeVue, {
    unstyled: true
});
app.mount('#app');
