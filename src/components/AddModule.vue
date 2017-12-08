<template>
    <div>
        <v-container grid-list-lg>
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
import { validationMixin } from 'vuelidate';
import { required, maxLength, requiredIf, between } from 'vuelidate/lib/validators';

export const isNameUnique = value => {
    let isUnique = true;
    let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

    modules.forEach(module => {
        if (module.name === value) {
            isUnique = false;
        }
    });

    return isUnique;
};

export default {
    mixins: [validationMixin],
    validations: {
        module: {
            name: {
                required,
                maxLength: maxLength(100),
                isNameUnique
            },
            description: {
                maxLength: maxLength(255)
            }
        },
        tmpUE: {
            name: {
                required: requiredIf(function () {
                    return this.module.hasUE;
                }),
                maxLength: maxLength(100)
            },
            description: {
                maxLength: maxLength(255)
            },
            coefficient: {
                between: between(0.1, 10)
            }
        }
    },
    data () {
        return {
            module: {
                name: '',
                description: '',
                hasUE: false
            },
            tmpUE: {
                name: '',
                description: '',
                coefficient: 1
            },
            headers: [
                { text: 'Nom de l\'unité', value: 'name', align: 'left' },
                { text: 'Description', value: 'description', align: 'left', sortable: false },
                { text: 'Coefficient', value: 'coefficient', align: 'right' }
            ],
            UE: [],
            confirm: false
        };
    },
    methods: {
        submitModule () {
            if (this.$v.module.$invalid) {
                // Que faire quand c'est invalide
                this.$v.module.$touch();
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
            }
        },
        addModuleToLocalStorage () {
            let newModule = {
                name: this.module.name,
                description: this.module.description,
                UE: this.UE
            };

            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
            modules.push(newModule);
            localStorage.setItem('modules', JSON.stringify(modules));
        }
    },
    computed: {
        nameErrors () {
            const errors = [];
            if (!this.$v.module.name.$dirty) return errors;

            if (!this.$v.module.name.maxLength) errors.push('Le nom ne peut pas contenir plus de 100 caractères');
            if (!this.$v.module.name.required) errors.push('Le nom est obligatoire');
            if (!this.$v.module.name.isNameUnique) errors.push('Le nom du module ne peut pas être déjà utilisé par un autre module');
            return errors;
        },
        tmpUEnameErrors () {
            const errors = [];
            if (!this.$v.tmpUE.name.$dirty) return errors;

            if (!this.$v.tmpUE.name.maxLength) errors.push('Le nom ne peut pas contenir plus de 100 caractères');
            if (!this.$v.tmpUE.name.required) errors.push('Le nom est obligatoire');
            return errors;
        },
        descriptionErrors () {
            const errors = [];
            if (!this.$v.module.description.$dirty) return errors;

            if (!this.$v.module.description.maxLength) errors.push('La description ne peut pas contenir plus de 255 caractères');
            return errors;
        },
        tmpUEdescriptionErrors () {
            const errors = [];
            if (!this.$v.tmpUE.description.$dirty) return errors;

            if (!this.$v.tmpUE.description.maxLength) errors.push('La description ne peut pas contenir plus de 255 caractères');
            return errors;
        },
        tmpUEcoefficientErrors () {
            const errors = [];
            if (!this.$v.tmpUE.coefficient.$dirty) return errors;

            if (!this.$v.tmpUE.coefficient.between) errors.push('Le coefficient ne peut contenir qu\'une valeur numérique entre 0.1 et 10');
            return errors;
        }
    }
};
</script>

<style scoped>
.display-1 {
    text-align: center;
}
</style>
