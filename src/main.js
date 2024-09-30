import './assets/main.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
//import Aura from '@primevue/themes/aura'
//import Nora from '@primevue/themes/nora'
import Lara from '@primevue/themes/lara'

import App from './App.vue'
import router from './router'

import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
//import AppState from './plugins/appState.js';

const app = createApp(App)

const myAppPreset = definePreset(
    Lara, {
    // semantic: {
    //     primary: {
    //         50: '{indigo.50}',
    //         100: '{indigo.100}',
    //         200: '{indigo.200}',
    //         300: '{indigo.300}',
    //         400: '{indigo.400}',
    //         500: '{indigo.500}',
    //         600: '{indigo.600}',
    //         700: '{indigo.700}',
    //         800: '{indigo.800}',
    //         900: '{indigo.900}',
    //         950: '{indigo.950}'
    //     }
    // }
})

app.use(router)
//app.use(AppState);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.use(PrimeVue, {
    theme: {
        preset: myAppPreset,
        options: {
            darkModeSelector: 'none',
        },
    }
})

app.mount('#app')
