import Vue from 'vue'
import App from './App.vue'
import router from './router'

import {
    firestorePlugin
} from 'vuefire'
Vue.use(firestorePlugin)


import "@/assets/styles/main.css";

import vuetify from './plugins/vuetify'

import axios from 'axios'
import firebase from 'firebase/compat/app'

import moment from 'moment'
import 'moment/locale/zh-cn'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false

moment.locale('zh-cn')
Vue.prototype.$moment = moment


let app;

Vue.use(vuetify);

firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    if (!app) {
        app = new Vue({
            router,
            vuetify,
            render: h => h(App)
        }).$mount('#app')
    }
})

// new Vue({
//   router,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')