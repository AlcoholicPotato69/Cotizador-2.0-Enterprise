import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import PrimeVue from 'primevue/config';
// import Aura from '@primevue/themes/aura';
import './style.css';
import App from './App.vue';

import { setupPermissionDirective } from './directives/v-permission';
import { registerPermissionDirectives } from './directives/permission';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
setupPermissionDirective(app);
registerPermissionDirectives(app);

app.use(PrimeVue, {
    unstyled: true
});
import ToastService from 'primevue/toastservice';
import { defineAsyncComponent } from 'vue';

app.use(ToastService);
app.component('FileUploader', defineAsyncComponent(() => import('./components/FileUploader.vue')));
app.mount('#app');
