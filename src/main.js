// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';

import App from './App';
import router from './router';

import VueScrollTo from 'vue-scrollto';
import {VueMasonryPlugin} from 'vue-masonry';
import { setTimeout } from 'timers';

Vue.use(VueScrollTo);
Vue.use(VueMasonryPlugin);

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
    template: '<div><div :style="loading ? \'max-height: 100vh; max-width: 100vw; overflow: hidden;\' : \'\'"><div :style="loading ? \'display: flex;\' : \'display: none;\'" style="width: 100vw; height: 100vh; z-index: 101; background: rgba(0, 0, 0, .5); position: absolute; justify-content: center; align-items: center;"><v-progress-circular indeterminate :size="100" color="accent" style="z-index: 102;"></v-progress-circular></div></div><App/></div>',
    components: { App },
    data () {
        return {
            projectTitle: 'Gestion de Haute École',
            pageTitle: '',
            loading: false
        };
    },
    created: function () {
        this.pageTitle = this.$route.meta.title;
        document.title = this.projectTitle;

        this.$router.beforeEach((to, from, next) => {
            window.scrollTo(0, 0);
            this.loading = true;
            setTimeout(() => { next(); }, 10);
        });

        this.$router.afterEach((to, from) => {
            this.loading = false;
        });
    },
    watch: {
        '$route' (to, from) {
            this.pageTitle = to.meta.title;
            document.title = this.projectTitle + ' | ' + this.pageTitle;
        }
    }
});
