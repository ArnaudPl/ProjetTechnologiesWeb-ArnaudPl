<template>
    <v-app dark>

    <v-navigation-drawer :temporary="mobile" fixed :mini-variant="miniVariant" v-model="drawer" app style="display: flex; flex-direction: column; padding-bottom: 0;">
            <v-list>
                <v-list-tile v-for="(menuItem, i) in menuItems" :key="i" :to="menuItem.to" ripple>
                    <v-list-tile-action>
                        <v-icon v-html="menuItem.icon"></v-icon>
                    </v-list-tile-action>   

                    <v-list-tile-content>
                        <v-list-tile-title v-text="menuItem.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>

            <v-spacer></v-spacer>

            <!-- Collé en bas de page -->
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>Paramètres</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar app extended>
            <v-btn icon @click.stop="miniVariant = !miniVariant" v-show="!this.mobile">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
            
            <v-btn icon @click.stop="drawer = !drawer" v-show="this.mobile">
                <v-icon>menu</v-icon>
            </v-btn>

            <v-toolbar-title v-text="this.$root.projectTitle"></v-toolbar-title>

            <v-toolbar-title class="pl-2 primary--text" slot="extension">{{ this.$root.pageTitle }}</v-toolbar-title>
        </v-toolbar>

        <v-content>
            <v-container fluid>

                <v-slide-y-transition mode="out-in">

                    <v-layout column>

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
function isMobile () {
    return window.innerWidth < 993;
}
export default {
    data () {
        return {
            drawer: true,
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
                },
                {
                    icon: 'event',
                    title: 'Gestion des modules',
                    to: '/modules'
                }
            ],
            miniVariant: true,
            mobile: false
        };
    },
    created () {
        this.mobile = isMobile();
        this.onResize();
        if (this.mobile) {
            this.drawer = false;
        }
    },
    mounted () {
        window.addEventListener('resize', this.onResize);
        this.mobile = isMobile();
        this.onResize();
        if (this.mobile) {
            this.drawer = false;
        }
    },
    destroyed () {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {
        onResize () {
            this.mobile = isMobile();

            if (this.mobile) {
                this.miniVariant = false;
                this.drawer = false;
            } else {
                this.drawer = true;
                this.miniVariant = true;
            }
        }
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
