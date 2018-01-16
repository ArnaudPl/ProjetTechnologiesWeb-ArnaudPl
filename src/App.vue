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
                    <v-btn block error @click="setBasicsData">Ajouter les données de base</v-btn>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" block @click="settingsDialog = false;">Fermer cette fenêtre</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog persistent v-model="noModule" max-width="600" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card>
                <v-card-title class="headline">Aucun module n'a été trouvé</v-card-title>
                <v-card-text>
                    <p>Il semblerait que ça soit la première fois que vous soyez sur l'application.<br>Commencez tout d'abord par ajouter un module.</p>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" block @click="$route.name === 'Ajout de module' ? noModule = false : $router.push({ name: 'Ajout de module' })">Ajouter un module</v-btn>
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
                    to: '/modules/add'
                }
            ],
            miniVariant: true,
            mobile: false,
            noModule: false
        };
    },
    created () {
        this.noModule = localStorage.getItem('modules') === null;

        this.$router.beforeEach((to, from, next) => {
            if (this.noModule || from.name === 'Ajout de module') this.noModule = localStorage.getItem('modules') === null;
            if (to.name === 'Ajout de module') {
                this.noModule = false;
                next();
            } else {
                if (this.noModule) {
                    next({ name: 'Ajout de module' });
                } else {
                    next();
                }
            }
        });

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
        setBasicsData () {
            // eslint-disable-next-line
            let data = [{'name':'613-1 Analyse des organisations','description':'','UE':[{'name':'613-1.1 Progiciels de gestion intégrés','description':'','coefficient':'2','id':1,'notes':[{'value':4,'date':1515939904971}]},{'name':'613-1.3 Gestion des processus métier (BPM)','description':'','coefficient':'1','id':2,'notes':[]}],'id':1},{'name':'613-2 Indicateurs de performance','description':'','UE':[{'name':'613-2.1 Comptabilité analytique','description':'','coefficient':'1','id':1,'notes':[{'value':6,'date':1516023728398}]},{'name':'613-2.2 Statistiques','description':'','coefficient':'1','id':2,'notes':[]},{'name':'613-2.3 Cockpit d\'entreprise','description':'','coefficient':'1','id':3,'notes':[]}],'id':2},{'name':'623-1 Implémentation du SI','description':'','UE':[{'name':'623-1.1 Méthodologie','description':'','coefficient':'1','id':1,'notes':[{'value':2,'date':1516023734352}]},{'name':'623-1.2 Modélisation avancée des données','description':'','coefficient':'1','id':2}],'id':3},{'name':'633-1 Algorithmes et structures de données','description':'','UE':[{'name':'633-1.1 Structures de données avancées','description':'','coefficient':'1','id':1,'notes':[{'value':3.95,'date':1516023743218}]},{'name':'633-1.2 Programmation de bases de données','description':'','coefficient':'1','id':2}],'id':4},{'name':'633-2 Architectures distribuées','description':'','UE':[{'name':'633-2.1 Applications et services réseaux','description':'','coefficient':'2','id':1},{'name':'633-2.2 Dialogue avec la base de données','description':'','coefficient':'1','id':2}],'id':5},{'name':'643-1 Choix d\'école 1','description':'','UE':[{'name':'643-1.1 Projet de technologies web de présentation','description':'','coefficient':'1','id':1}],'id':6},{'name':'Module sans UE','description':'','id':7,'UE':[],'notes':[]}];
            localStorage.setItem('modules', JSON.stringify(data));
            alert('Données pour la présentation correctement chargées');
        },
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
