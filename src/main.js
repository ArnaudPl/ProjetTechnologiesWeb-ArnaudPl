// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';

import App from './App';
import router from './router';

import VueScrollTo from 'vue-scrollto';

Vue.use(VueScrollTo);

Vue.use(Vuetify, { theme: {
    primary: '#666',
    secondary: '#9e9e9e',
    accent: '#E53935',
    error: '#D50000',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
}});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    data () {
        return {
            projectTitle: 'Le projet incroyable',
            pageTitle: ''
        };
    },
    created: function () {
        this.pageTitle = this.$route.meta.title;
        document.title = this.projectTitle;
    },
    watch: {
        '$route' (to, from) {
            this.pageTitle = to.meta.title;
            document.title = this.projectTitle + ' | ' + this.pageTitle;
        }
    }
});
