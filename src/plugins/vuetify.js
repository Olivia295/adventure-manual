import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify);

import zhHans from 'vuetify/lib/locale/zh-Hans'
import en from 'vuetify/lib/locale/en'

Vue.component('my-component', {
    methods: {
        changeLocale() {
            this.$vuetify.lang.current = 'en'
        },
    },
})

export default new Vuetify({
    breakpoint: {
        scrollBarWidth: 16,
        thresholds: {
            xs: 600,
            sm: 960,
            md: 1280,
            lg: 1920,
        },
    },
    lang: {
        locales: {
            zhHans,en
        },
        current: 'zhHans',
    },
    icons: {
        iconfont: 'mdi', // 默认值 - 仅用于展示目的
        values: {},
    },
    rtl: false,
    theme: {
        dark: false,
        default: 'light',
        disable: false,
        options: {
            cspNonce: undefined,
            customProperties: undefined,
            minifyTheme: undefined,
            themeCache: undefined,
        },
        themes: {
            light: {
                primary: '#1976D2',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FB8C00',

                indigo50:"#EEF2FF",
                indigo100:"#E0E7FF",
                indigo400:"#818CF8",
                indigo800:"#3730A3",
                indigo900:"#312E81",
            },
            dark: {
                primary: '#2196F3',
                secondary: '#424242',
                accent: '#FF4081',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FB8C00',
            },
        },
    },
});