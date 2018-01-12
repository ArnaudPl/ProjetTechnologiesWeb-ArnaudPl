<template>
    <div>
        <v-container grid-list-lg>
            <v-flex id="alertBox" v-if="alert.show" xs12 md8 offset-md2>
                <v-alert dismissible :type="alert.type" v-model="alert.show" transition="scale-transition">{{ alert.text }}</v-alert>
            </v-flex>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-form v-model="moduleValid" ref="moduleForm">
                        <v-flex xs12 md8 offset-md2>
                            <v-text-field box autofocus label="Nom du module" v-model.trim="module.name" :counter="100" required :rules="moduleNameRules"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md8 offset-md2>
                            <v-text-field box textarea label="Description du module" v-model.trim="module.description" :counter="255" :rules="moduleDescriptionRules"></v-text-field>
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
                                        <td>{{ props.item.description.length ? props.item.description : '-' }}</td>
                                        <td class="text-xs-right">{{ props.item.coefficient }}</td>
                                        <td class="text-xs-right">
                                            <v-tooltip top>
                                                <v-btn flat icon slot="activator" @click.native="$emit('edit-UE', props.item)">
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                                <span>Modifier l'unité</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                                <v-btn flat icon slot="activator" @click.native="$emit('delete-UE', props.item)">
                                                    <v-icon>delete_forever</v-icon>
                                                </v-btn>
                                                <span>Supprimer l'unité</span>
                                            </v-tooltip>
                                        </td>
                                    </template>
                                    <template slot="no-data">
                                        Aucune unité d'enseignement pour ce module
                                    </template>
                                </v-data-table>
                            </v-flex>
                            <v-flex xs12 text-xs-center>
                                <v-btn @click="openUEForm('add')" color="accent">Ajouter une unité</v-btn>
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
        <v-dialog v-model="editUE" persistent max-width="600" :fullscreen="$vuetify.breakpoint.smAndDown">
            <v-card>
                <v-card-title class="headline">Edition d'une unité d'enseignement</v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-form v-model="UEValid" ref="UEForm">
                                    <v-flex xs12>
                                        <v-flex xs12>
                                            <v-text-field box label="Nom de l'unité d'enseignement" v-model.trim="tmpUE.name" :counter="100" :required="module.hasUE" :rules="UENameRules"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field box textarea label="Description" v-model.trim="tmpUE.description" :counter="255" :rules="UEDescriptionRules"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field box label="Coefficient" hint="Valeur entre 0.1 et 10" persistent-hint v-model.trim="tmpUE.coefficient" :rules="UECoefficientRules"></v-text-field>
                                        </v-flex>
                                    </v-flex>
                                </v-form>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" block @click="submitUE(); editUE = false" :disabled="!UEValid">{{ UEValid ? (tmpUE.id === -1 ? 'Ajouter' : 'Sauvegarder') : 'Corrigez le formulaire' }}</v-btn>
                    <v-btn color="primary" block flat @click="editUE = false; tmpUE.id === -1 ? setAlert('info', 'L\'unité n\'a pas été ajoutée') : setAlert('info', 'L\'unité n\'a pas été modifiée');">Annuler</v-btn>
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
            noModule: false,
            infoAlertSelectUE: true,
            editUE: false
        };
    },
    methods: {
        editModule () {
            if (this.$refs.moduleForm.validate()) {
                // C'est valide
                this.editModuleInLocalStorage();
            } else {
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire.');
            }
        },
        cancelEditModule () {
            this.editUE = false;
            this.getModuleInStorage();
            this.setAlert('info', 'Les valeurs de base ont été remises.');
        },
        editModuleInLocalStorage () {
            let modules = this.returnModulesFromStorage();

            modules.forEach((module, index, obj) => {
                if (module.id === this.module.id) {
                    obj[index].name = this.module.name;
                    obj[index].description = this.module.description;
                }
            });

            localStorage.setItem('modules', JSON.stringify(modules));
            this.setAlert('success', 'Module correctement modifié !');
        },
        openUEForm (action) {
            if (action !== 'edit') {
                this.tmpUE = {
                    name: '',
                    description: '',
                    coefficient: '',
                    id: -1
                };
            }
            this.editUE = true;
        },
        submitUE () {
            // Gestion du formulaire des UE
                // Si c'est un ajout
            if (this.tmpUE.id === -1) {
                this.addUE();
            } else { // Si c'est une modification
                this.editSelectedUE();
            }

            // Met à jour le module affiché
            this.getModuleInStorage();
        },
        addUE () {
            let modules = this.returnModulesFromStorage();
            let newUE = {
                name: this.tmpUE.name,
                description: this.tmpUE.description,
                coefficient: this.tmpUE.coefficient
            };

            modules.forEach(module => {
                if (module.id === this.module.id) {
                    if (module.UE.length === 0) newUE.id = 1;
                    else newUE.id = module.UE[module.UE.length - 1].id ? parseInt(module.UE[module.UE.length - 1].id + 1) : 1;
                    module.UE.push(newUE);
                }
            });

            localStorage.setItem('modules', JSON.stringify(modules));
            this.setAlert('success', 'Unité d\'enseignement correctement ajoutée !');
        },
        editSelectedUE () {
            let modules = this.returnModulesFromStorage();
            let editedUE = {
                name: this.tmpUE.name,
                description: this.tmpUE.description,
                coefficient: this.tmpUE.coefficient,
                id: this.tmpUE.id
            };

            modules.forEach(module => {
                if (module.id === this.module.id) {
                    module.UE.forEach((ue, i, o) => {
                        if (ue.id === this.tmpUE.id) {
                            if (ue.notes) {
                                editedUE.notes = ue.notes;
                            }
                            o[i] = editedUE;
                        }
                    });
                }
            });

            localStorage.setItem('modules', JSON.stringify(modules));
            this.setAlert('success', 'Unité d\'enseignement correctement modifiée !');
        },
        deleteSelectedUE (selectedUE) {
            if (!confirm('Êtes-vous sûr(e) de vous vouloir supprimer l\'unité : ' + selectedUE.name + ' ?')) {
                this.setAlert('info', 'L\'unité n\'a pas été supprimée !');
                return;
            }
            let modules = this.returnModulesFromStorage();

            modules.forEach((module, index) => {
                if (module.id === this.module.id) {
                    module.UE.forEach((ue, i, o) => {
                        if (ue.id === selectedUE.id) {
                            module.UE.splice(i, 1);
                        }
                    });
                }
            });

            localStorage.setItem('modules', JSON.stringify(modules));
            this.setAlert('success', 'Unité d\'enseignement correctement supprimée !');

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
        }
    },
    mounted () {
        this.getModuleInStorage();
        // Gestion de la suppression des UE
        this.$on('delete-UE', (ue) => {
            this.deleteSelectedUE(ue);
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
</style>
