<template>
    <div>
        <v-container grid-list-lg>
            <v-flex v-if="alert.show" xs12 md8 offset-md2>
                <v-alert dismissible :type="alert.type" v-model="alert.show" transition="scale-transition">{{ alert.text }}</v-alert>
            </v-flex>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-form v-model="moduleValid" ref="moduleForm">
                        <v-flex xs12 md8 offset-md2>
                            <v-text-field box autofocus label="Nom du module" v-model.trim="module.name" :counter="100" required :rules="moduleNameRules"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md8 offset-md2>
                            <v-text-field box textarea label="Description du module" v-model.trim="module.description":counter="255" :rules="moduleDescriptionRules"></v-text-field>
                        </v-flex>
                        <v-flex xs12 text-xs-center>
                            <v-btn @click="editModule" color="accent">Sauvegarder</v-btn>
                            <v-btn flat @click="cancelEditModule" color="primary">Annuler</v-btn>
                        </v-flex>
                        <v-flex xs12 md8 offset-md2>
                            <v-divider></v-divider>
                        </v-flex>
                    </v-form>
                </v-flex>
                <v-flex xs12>
                    <v-layout>
                        <v-flex xs12>
                            <v-flex xs12>
                                <v-subheader>Liste des unités d'enseignement</v-subheader>
                            </v-flex>
                            <v-flex xs12>
                                <v-data-table hide-actions :items="module.UE" item-key="name" class="elevation-1" :headers="headers">
                                    <template slot="items" slot-scope="props">
                                        <td>{{ props.item.name }}</td>
                                        <td>{{ props.item.description }}</td>
                                        <td class="text-xs-right">{{ props.item.coefficient }}</td>
                                    </template>
                                    <template slot="no-data">
                                        Aucune unité d'enseignement pour ce module
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog v-model="noModule" persistent max-width="600" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card>
                <v-card-title class="headline">Aucun module ne correspond à cette adresse.</v-card-title>
                <v-card-text>Cliquez sur le bouton pour retourner à la page d'accueil.</v-card-text>
                <v-card-actions>
                    <v-btn color="error" block @click="$router.push({ name: 'Tableau de bord' })">Retourner à l'accueil</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import moduleFormValidationMixin from '@/assets/js/mixins/moduleFormValidationMixin';
export default {
    mixins: [moduleFormValidationMixin],
    data () {
        return {
            module: {
                id: -1,
                name: '',
                description: '',
                UE: []
            },
            noModule: false
        };
    },
    methods: {
        editModule () {
            console.log(this.isModuleNameUnique(this.module.id, this.module.name));
            /* if (this.$refs.moduleForm.validate()) {
                // C'est valide
                this.editModuleInLocalStorage();
            } else {
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire.');
            } */
        },
        cancelEditModule () {
            this.getModuleInStorage();
            this.setAlert('info', 'Les valeurs de base ont été remises.');
        },
        editModuleInLocalStorage () {
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

            modules.forEach((module, index, obj) => {
                if (module.id === this.module.id) {
                    obj[index].name = this.module.name;
                    obj[index].description = this.module.description;
                }
            });

            localStorage.setItem('modules', JSON.stringify(modules));
            this.setAlert('success', 'Module correctement modifié !');
        },
        getModuleInStorage () {
            // Rechercher le module correspondant à la route dans le localStorage
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

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
        }
    },
    mounted: function () {
        this.getModuleInStorage();
    }
};
</script>

<style scoped>
</style>
