import Vue from 'vue';
import Router from 'vue-router';

// Inclure les components vers lesquels rediriger
import App from '../App';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'App',
            component: App
        }
    ]
});
