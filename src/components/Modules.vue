<template>
    <div>
        <v-container grid-list-lg v-if="this.$route.name==='Modules'">
            <v-card-title>
            Liste des modules
            <v-spacer></v-spacer>
            <v-text-field
                append-icon="search"
                label="Rechercher"
                single-line
                hide-details
                v-model="search"
            ></v-text-field>
            </v-card-title> 
            <v-flex xs12>
                <v-data-table hide-actions :items="modules" item-key="name" class="elevation-1" :headers="headers" :search="search">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.description.length ? props.item.description : '-' }}</td>
                        <td>{{ props.item.UE }}</td>
                         <td class="text-xs-right">
                            <v-tooltip top>
                                <v-btn flat icon slot="activator" @click="$router.push({ name: 'Modification de module', params: {id: props.item.id} })">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                                <span>Modifier le module</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <v-btn flat icon slot="activator" @click.native="$emit('delete-mod', props.item)">
                                    <v-icon>delete_forever</v-icon>
                                </v-btn>
                                <span>Supprimer le module</span>
                            </v-tooltip>
                        </td>
                    </template>
                </v-data-table>  
            </v-flex>
        </v-container>
        <v-container grid-list-lg v-if="this.$route.name==='Modules'">
            <v-layout row wrap>
                <v-flex xs12>
                    <v-flex xs-12 text-xs-left>
                        <v-btn color="accent" @click="$router.push({ name: 'Ajout de module' })">Ajouter un module</v-btn>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-container>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data () {
        return {
            headers: [
                { text: 'Nom du module', value: 'name', align: 'left' },
                { text: 'Description', value: 'description', align: 'left', sortable: false },
                { text: 'Unité enseignement', value: 'name', align: 'left', sortable: false },
                {text: 'Actions', value: 'actions', align: 'center', sortable: false}
            ],
            modules: null,
            noModule: false,
            infoAlertSelectUE: true,
            editUE: false,
            search: ''
        };
    },
    created: function () {
        this.modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // Force l'ajout de module lorsqu'il n'y en a pas encore
            if (vm.modules === null) {
                vm.$router.push({name: 'Ajout de module'});
            }
        });
    },
    beforeRouteUpdate (to, from, next) {
        // Force l'ajout de module lorsqu'il n'y en a pas encore
        if (to.name !== 'Ajout de module') {
            this.modules = localStorage.getItem('modules');
            if (this.modules === null) {
                next({name: 'Ajout de module'});
            }
        } else {
            next();
        }
    },
    deleteSelectedModule (selectedUE) {
        if (!confirm('Êtes-vous sûr(e) de vous vouloir supprimer le module : ' + selectedUE.name + ' ?')) {
            this.setAlert('info', 'Le module n\'a pas été supprimée !');
            return;
        }
        let modules = this.returnModulesFromStorage();

        modules.forEach((module, index) => {
            if (module.id === this.module.id) {
                module.forEach((module, i, o) => {
                    module.splice(i, 1);
                }
                );
            }
        });
        localStorage.setItem('modules', JSON.stringify(modules));
        this.setAlert('success', 'Module correctement supprimé !');
        // Met à jour le module affiché
        this.getModuleInStorage();
    },
    getModuleInStorage () {
        // Rechercher le module correspondant à la route dans le localStorage
        let modules = this.returnModulesFromStorage();

        modules.forEach(module => {
            if (module.id === parseInt(this.$route.params.id)) {
                this.module = module;
            }
        });

        // Si aucune correspondance n'a été trouvé
        if (this.module.id === -1) {
            // On déclenche la modal de redirection
            this.noModule = true;
        }
    },
    returnModulesFromStorage () {
        let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
        // S'il n'y a pas d'UE, on veut quand meme un tableau vide -> Sinon problème d'affichage
        modules.forEach(m => {
            if (!m.UE) m.UE = [];
        });
        return modules;
    },
    mounted () {
        this.getModuleInStorage();
        // Gestion de la suppression des modules
        this.$on('delete-mod', (module) => {
            this.deleteSelectedModule(module);
        });
        // Gestion du clic sur le bouton de modification d'une UE
        this.$on('edit-UE', (ue) => {
            this.tmpUE = {
                name: ue.name,
                description: ue.description,
                coefficient: ue.coefficient,
                id: ue.id
            };
            this.openUEForm('edit');
        });
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
