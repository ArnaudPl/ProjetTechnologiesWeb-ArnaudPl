<template>
    <div>
        <v-container grid-list-lg>
            <form>
                <v-layout row wrap>
                    <v-flex xs12 md8 offset-md2>
                        <v-text-field label="Nom du module" v-model.trim="module.name" :error-messages="nameErrors" counter="255" @input="$v.module.name.$touch()" @blur="$v.module.name.$touch()" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 md8 offset-md2>
                        <v-checkbox label="Est-ce que ce module est composé d'unités d'enseignement ?" v-model="module.hasUE"></v-checkbox>
                    </v-flex>
                    <v-flex xs12 v-show="module.hasUE">
                        <v-layout row wrap>
                            <v-flex xs12 md6>
                                <v-flex xs12>
                                    <div class="display-1">Ajouter une unité d'enseignement</div>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Nom de l'unité d'enseignement" v-model.trim="tmpUE.name" :error-messages="nameErrors" counter="255" @input="$v.tmpUE.name.$touch()" @blur="$v.tmpUE.name.$touch()" required></v-text-field>
                                </v-flex>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-flex xs12>
                                    <div class="display-1">Liste des unités d'enseignement</div>
                                </v-flex>
                                <v-flex xs12>
                                    Bla bla bla
                                </v-flex>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 text-xs-center>
                        <v-btn @click="submit" color="accent">Sauvegarder</v-btn>
                    </v-flex>
                </v-layout>
            </form>
        </v-container>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
    mixins: [validationMixin],
    validations () {
        if (this.module.hasUE) {
            return {
                module: {
                    name: { required, maxLength: maxLength(255) }
                },
                tmpUE: {
                    name: { required, maxLength: maxLength(255) }
                }
            };
        } else {
            return {
                module: {
                    name: { required, maxLength: maxLength(255) }
                }
            };
        }
    },
    data () {
        return {
            module: {
                name: '',
                hasUE: false
            },
            tmpUE: {
                name: ''
            }
        };
    },
    methods: {
        submit () {
            this.$v.$touch();
        }
    },
    computed: {
        nameErrors () {
            const errors = [];
            if (!this.$v.module.name.$dirty) return errors;

            if (!this.$v.module.name.maxLength) errors.push('Le nom ne peut pas contenir plus de 255 caractères');
            if (!this.$v.module.name.required) errors.push('Le nom est obligatoire');
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
