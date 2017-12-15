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
                            <v-text-field box textarea label="Description du module" v-model.trim="module.description":counter="255" :rules="moduleDescriptionRules"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md8 offset-md2>
                            <v-checkbox label="Est-ce que ce module est composé d'unités d'enseignement ?" v-model="module.hasUE"></v-checkbox>
                            <v-divider v-show="module.hasUE"></v-divider>
                        </v-flex>
                    </v-form>
                </v-flex>
                    <v-flex xs12 v-show="module.hasUE">
                        <v-layout row wrap>
                            <v-flex xs12 md6>
                                <v-form v-model="UEValid" ref="UEForm">
                                    <v-flex xs12>
                                        <v-subheader>{{ editMode ? 'Modifier l\'' : 'Ajouter une ' }}unité d'enseignement</v-subheader>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field box label="Nom de l'unité d'enseignement" v-model.trim="tmpUE.name" :counter="100" :required="module.hasUE" :rules="UENameRules"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field box textarea label="Description" v-model.trim="tmpUE.description" :counter="255" :rules="UEDescriptionRules"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field box label="Coefficient" hint="Valeur entre 0.1 et 10" persistent-hint v-model.trim="tmpUE.coefficient" :rules="UECoefficientRules"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 text-xs-center>
                                        <v-btn @click="editMode ? editUE() : submitUE()" color="accent">{{ editMode ? 'Modifier' : 'Ajouter' }}</v-btn>
                                        <v-btn flat v-show="editMode" @click="cancelEditUE" color="primary">Annuler</v-btn>
                                    </v-flex>
                                </v-form>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-flex xs12>
                                    <v-subheader>Liste des unités d'enseignement</v-subheader>
                                </v-flex>
                                <v-flex xs12>
                                    <v-data-table hide-actions :items="UE" item-key="name" class="elevation-1" :headers="headers">
                                        <template slot="items" slot-scope="props">
                                            <td>{{ props.item.name }}</td>
                                            <td>{{ props.item.description ? props.item.description : '-' }}</td>
                                            <td class="text-xs-right">{{ props.item.coefficient }}</td>
                                            <td class="text-xs-right">
                                                <v-tooltip v-show="tmpUE.id !== props.item.id" top>
                                                    <v-btn flat icon slot="activator" @click.native="$emit('edit-UE', props.item)">
                                                        <v-icon>edit</v-icon>
                                                    </v-btn>
                                                    <span>Modifier l'unité</span>
                                                </v-tooltip>
                                                <v-tooltip v-show="!editMode" top>
                                                    <v-btn flat icon slot="activator" @click.native="$emit('delete-UE', props.item)">
                                                        <v-icon>delete_forever</v-icon>
                                                    </v-btn>
                                                    <span>Supprimer l'unité</span>
                                                </v-tooltip>
                                            </td>
                                        </template>
                                        <template slot="no-data">
                                            Aucune unité d'enseignement pour l'instant
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 text-xs-center>
                        <v-btn @click="submitModule" color="accent">Sauvegarder</v-btn>
                    </v-flex>
                </v-layout>
        </v-container>
        <v-dialog v-model="confirm" persistent max-width="600" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card>
                <v-card-title class="headline">Annuler l'ajout de l'unité d'enseignement ?</v-card-title>
                <v-card-text>Vous n'avez pas ajouté l'unité d'enseignement que vous êtiez en train de saisir.<br>Souhaitez-vous continuer la saisie ?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="confirm = false; addModuleToLocalStorage()">Annuler la saisie</v-btn>
                    <v-btn color="accent" flat @click.native="confirm = false">Oui</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import moduleFormValidationMixin from '@/assets/js/mixins/moduleFormValidationMixin';

export default {
    mixins: [moduleFormValidationMixin],
    methods: {
        submitModule () {
            let isValid = false;
            if (this.$refs.moduleForm.validate()) {
                if (this.module.hasUE) {
                    if (this.$refs.UEForm.validate() || this.UE.length > 0) {
                        isValid = true;
                    }
                } else {
                    isValid = true;
                }
            }
            if (isValid) {
                // Le formulaire est dans un état valide
                    // On vérifie que l'utilisateur n'était pas en train d'ajouter une unité d'enseignement
                if (this.module.hasUE && (this.tmpUE.name || this.tmpUE.description) !== '') {
                    this.confirm = true;
                } else {
                    this.addModuleToLocalStorage();
                }
            } else {
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire.');
            }
        },
        submitUE () {
            if (this.$refs.UEForm.validate()) {
                let lastID = 0;
                lastID = this.UE.length ? (this.UE[this.UE.length - 1].id ? this.UE[this.UE.length - 1].id + 1 : 1) : 1;
                // C'est valide
                this.UE.push({
                    name: this.tmpUE.name,
                    description: this.tmpUE.description,
                    coefficient: this.tmpUE.coefficient.length ? this.tmpUE.coefficient : '1',
                    id: lastID
                });
                this.tmpUE.name = '';
                this.tmpUE.description = '';
                this.tmpUE.coefficient = 1;
                this.setAlert('success', 'Unité d\'enseignement ajoutée !');
            } else {
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire.');
            }
        },
        editUE () {
            if (this.$refs.UEForm.validate()) {
                this.UE.forEach(ue => {
                    if (ue.id === this.tmpUE.id) {
                        ue.name = this.tmpUE.name;
                        ue.description = this.tmpUE.description;
                        ue.coefficient = this.tmpUE.coefficient;
                    }
                });
                this.editMode = false;
                this.tmpUE = {
                    name: '',
                    description: '',
                    coefficient: 1,
                    id: -1
                };

                this.setAlert('success', 'Unité correctement modifiée !');
            } else {
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire.');
            }
        },
        cancelEditUE () {
            this.editMode = false;
            this.tmpUE = {
                name: '',
                description: '',
                coefficient: 1,
                id: -1
            };
            this.setAlert('info', 'L\'unité n\'a pas été modifiée');
        },
        addModuleToLocalStorage () {
            let newModule = {
                name: this.module.name,
                description: this.module.description
            };
            if (this.module.hasUE) {
                newModule.UE = this.UE;
            }

            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

            let lastId;
            if (modules.length === 0) lastId = 0;
            else lastId = modules[modules.length - 1].id ? parseInt(modules[modules.length - 1].id) : 0;
            newModule.id = lastId + 1;
            modules.push(newModule);
            localStorage.setItem('modules', JSON.stringify(modules));

            this.module.name = '';
            this.module.description = '';
            this.tmpUE.name = '';
            this.tmpUE.description = '';
            this.tmpUE.coefficient = 1;
            this.UE = [];

            this.setAlert('success', 'Module correctement ajouté ! Vous pouvez en ajouter un nouveau maintenant.');
        }
    },
    mounted () {
        // Gestion de la suppression des UE
        this.$on('delete-UE', (ue) => {
            this.UE.forEach((o, i) => {
                if (o.id === ue.id) this.UE.splice(i, 1);
                this.setAlert('info', 'Unité d\'enseignement supprimée');
            });
        });
        // Gestion du clic sur le bouton de modification d'une UE
        this.$on('edit-UE', (ue) => {
            this.editMode = true;
            this.tmpUE = {
                name: ue.name,
                description: ue.description,
                coefficient: ue.coefficient,
                id: ue.id
            };
        });
    },
    beforeRouteLeave (to, from, next) {
        let isDirty = false;
        // On vérifie que l'utilisateur a sauvegardé avant de quitter la page
        this.$refs.moduleForm.inputs.forEach(input => {
            isDirty = input.hasInput;
        });

        if (!isDirty) {
            this.$refs.UEForm.inputs.forEach(input => {
                isDirty = input.hasInput;
            });
        }

        if (isDirty) {
            const leave = window.confirm('Voulez-vous vraiment quitter sans sauvegarder les changements ?');
            leave ? next() : next(false);
        } else {
            next();
        }
    }
};
</script>

<style scoped>
</style>
