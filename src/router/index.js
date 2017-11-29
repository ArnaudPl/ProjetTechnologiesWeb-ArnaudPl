import Vue from 'vue';
import Router from 'vue-router';

// Inclure les components vers lesquels rediriger
import TableauBord from '@/components/TableauBord';
import Notes from '@/components/Notes';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: {
                name: 'Tableau de bord'
            }
        },
        {
            path: '/home',
            name: 'Tableau de bord',
            component: TableauBord
        },
        {
            path: '/notes',
            name: 'Notes',
            component: Notes
        }
    ]
});
