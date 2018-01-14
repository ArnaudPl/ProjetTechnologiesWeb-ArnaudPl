<template>
    <v-app :dark="dark" v-resize="onResize">

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
                <v-list-tile @click="settingsDialog = true">
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

        <v-dialog v-model="settingsDialog" max-width="600" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card>
                <v-card-title class="headline">Paramètres de l'application</v-card-title>
                <v-card-text>
                    <v-switch label="Utiliser le thème sombre ?" v-model="dark" @change="toggleTheme"></v-switch>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" block @click="settingsDialog = false;">Retourner à l'accueil</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-app>
</template>

<script>
export default {
    data () {
        return {
            dark: true,
            settingsDialog: false,
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
        this.onResize();
        if (this.mobile) {
            this.drawer = false;
        }

        let useDarkTheme = localStorage.getItem('dark');

        if (useDarkTheme === null) {
            localStorage.setItem('dark', 'true');
            this.dark = true;
        } else {
            if (useDarkTheme === 'true') this.dark = true;
            else this.dark = false;
        }
    },
    mounted () {
        if (this.mobile) {
            this.drawer = false;
        }
    },
    methods: {
        onResize () {
            this.mobile = this.isMobile();

            if (this.mobile) {
                this.miniVariant = false;
                this.drawer = false;
            } else {
                this.drawer = true;
                this.miniVariant = true;
            }
        },
        isMobile () {
            return this.$vuetify.breakpoint.mdAndDown;
        },
        toggleTheme () {
            let useDarkTheme = this.dark ? 'true' : 'false';
            localStorage.setItem('dark', useDarkTheme);
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
