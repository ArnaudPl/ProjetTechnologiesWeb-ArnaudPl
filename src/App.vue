<template>
    <v-app dark>

        <v-navigation-drawer fixed :mini-variant="miniVariant" app>
            <v-list>
                <v-list-tile v-for="(menuItem, i) in menuItems" :key="i" :to="menuItem.to" ripple="true">
                    <v-list-tile-action>
                        <v-icon v-html="menuItem.icon"></v-icon>
                    </v-list-tile-action>   

                    <v-list-tile-content>
                        <v-list-tile-title v-text="menuItem.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar app>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>

            <v-toolbar-title v-text="title"></v-toolbar-title>

        </v-toolbar>

        <v-content>
            <v-container fluid>

                <v-slide-y-transition mode="out-in">

                    <v-layout column align-center>

                        <router-view></router-view>

                    </v-layout>

                </v-slide-y-transition>

            </v-container>
        </v-content>

        <v-footer app>
            <span>&copy; 2017</span>
            <v-spacer></v-spacer>

            <span>Tiago Rodrigues & Arnaud Plumez</span>
            <v-spacer></v-spacer>

            <span>HE-Arc Gestion</span>
        </v-footer>

    </v-app>
</template>

<script>
export default {
    data () {
        return {
            menuItems: [
                {
                    icon: 'home',
                    title: 'Tableau de bord',
                    to: '/home'
                },
                {
                    icon: 'school',
                    title: 'Gestion des notes',
                    to: '/notes'
                }
            ],
            miniVariant: true,
            title: 'Le projet incroyable'
        };
    }
};
</script>

<style>
    .list__tile--active {
        background-color: #D50000;
    }

    .list__tile--active:hover {
        background-color: #D50000;
    }
</style>
