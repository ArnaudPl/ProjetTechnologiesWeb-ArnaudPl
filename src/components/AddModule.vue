<template>
    <div>
        <v-container grid-list-lg>
            <v-flex v-if="alert.show" xs12 md8 offset-md2>
                <v-alert dismissible :type="alert.type" v-model="alert.show" transition="scale-transition">{{ alert.text }}</v-alert>
            </v-flex>
            <form>
                <v-layout row wrap>
                    <v-flex xs12 md8 offset-md2>
                        <v-text-field box autofocus label="Nom du module" v-model.trim="module.name" :error-messages="nameErrors" :counter="100" @input="$v.module.name.$touch()" @blur="$v.module.name.$touch()" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 md8 offset-md2>
                        <v-text-field box textarea label="Description du module" v-model.trim="module.description" :error-messages="descriptionErrors" :counter="255" @input="$v.module.description.$touch()" @blur="$v.module.description.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md8 offset-md2>
                        <v-checkbox label="Est-ce que ce module est composé d'unités d'enseignement ?" v-model="module.hasUE"></v-checkbox>
                        <v-divider v-show="module.hasUE"></v-divider>
                    </v-flex>
                    <v-flex xs12 v-if="module.hasUE">
                        <v-layout row wrap>
                            <v-flex xs12 md6>
                                <v-flex xs12>
                                    <v-subheader>Ajouter une unité d'enseignement</v-subheader>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field box label="Nom de l'unité d'enseignement" v-model.trim="tmpUE.name" :error-messages="tmpUEnameErrors" :counter="100" @input="$v.tmpUE.$touch()" @blur="$v.tmpUE.$touch()" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field box textarea label="Description" v-model.trim="tmpUE.description" :error-messages="tmpUEdescriptionErrors" :counter="255" @input="$v.tmpUE.$touch()" @blur="$v.tmpUE.$touch()"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field box label="Coefficient" hint="Valeur entre 0.1 et 10, défaut: 1" persistent-hint v-model.trim="tmpUE.coefficient" :error-messages="tmpUEcoefficientErrors" @input="$v.tmpUE.$touch()" @blur="$v.tmpUE.$touch()"></v-text-field>
                                </v-flex>
                                <v-flex xs12 text-xs-center>
                                    <v-btn @click="submitUE" color="accent">Ajouter</v-btn>
                                </v-flex>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-flex xs12>
                                    <v-subheader>Liste des unités d'enseignement</v-subheader>
                                </v-flex>
                                <v-flex xs12>
                                    <v-data-table hide-actions :items="UE" item-key="name" class="elevation-1" :headers="headers">
                                        <template slot="items" slot-scope="props">
                                            <td>{{ props.item.name }}</td>
                                            <td>{{ props.item.description }}</td>
                                            <td class="text-xs-right">{{ props.item.coefficient }}</td>
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
            </form>
        </v-container>
        <v-dialog v-model="confirm" persistent max-width="600" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card>
                <v-card-title class="headline">Annuler l'ajout de l'unité d'enseignement ?</v-card-title>
                <v-card-text>Vous n'avez pas ajouté l'unité d'enseignement que vous êtiez en train de saisir.<br>Souhaitez-vous annuler ou continuer la saisie ?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="confirm = false; addModuleToLocalStorage()">Annuler</v-btn>
                    <v-btn color="accent" flat @click.native="confirm = false">Continuer</v-btn>
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
            if (this.$v.module.$invalid) {
                // Que faire quand c'est invalide
                this.$v.module.$touch();
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire.');
            } else {
                // Et quand c'est valide
                // On teste que l'utilisateur n'est pas en train de saisir une unité d'enseignement
                if (this.module.hasUE && this.$v.tmpUE.$dirty) {
                    this.confirm = true;
                } else {
                    this.addModuleToLocalStorage();
                }
            }
        },
        submitUE () {
            if (this.$v.tmpUE.$invalid) {
                // Que faire quand c'est invalide
                this.$v.tmpUE.$touch();
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire.');
            } else {
                // Et quand c'est valide
                this.UE.push({
                    name: this.tmpUE.name,
                    description: this.tmpUE.description,
                    coefficient: this.tmpUE.coefficient.length ? this.tmpUE.coefficient : '1'
                });
                this.$v.tmpUE.$reset();
                this.tmpUE.name = '';
                this.tmpUE.description = '';
                this.tmpUE.coefficient = 1;
                this.setAlert('success', 'Unité d\'enseignement ajoutée !');
            }
        },
        addModuleToLocalStorage () {
            let newModule = {
                name: this.module.name,
                description: this.module.description,
                UE: this.UE
            };

            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

            let lastId;
            if (modules.length === 0) lastId = 0;
            else lastId = modules[modules.length - 1].id ? parseInt(modules[modules.length - 1].id) : 0;
            newModule.id = lastId + 1;
            modules.push(newModule);
            localStorage.setItem('modules', JSON.stringify(modules));

            this.$v.module.$reset();
            this.$v.tmpUE.$reset();
            this.module.name = '';
            this.module.description = '';
            this.tmpUE.name = '';
            this.tmpUE.description = '';
            this.tmpUE.coefficient = 1;

            this.setAlert('success', 'Module correctement ajouté ! Vous pouvez en ajouter un nouveau maintenant.');
        }
    }
};
</script>

<style scoped>
</style>
