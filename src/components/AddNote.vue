<template>
    <div>
        <v-container grid-list-lg>
            <v-flex id="alertBox" v-if="alert.show" xs12 md8 offset-md2>
                <v-alert dismissible :type="alert.type" v-model="alert.show" transition="scale-transition">{{ alert.text }}</v-alert>
            </v-flex>

            <v-layout row wrap>
                <v-flex xs12>
                    <v-form v-model="noteValid" ref="noteForm">
                        <v-flex xs12 md8 offset-md2>
                            <v-select :items="selectData" v-model="selectedModule" label="Choix du module" :rules="selectModuleRules">
                                <template slot="selection" slot-scope="selected">
                                    {{ selected.item.UEId ? selected.item.moduleName + ' | ' + selected.item.UEName : selected.item.moduleName }}
                                </template>
                                <template slot="item" slot-scope="data">
                                    <template v-if="typeof data.item !== 'object'" item-disabled>
                                        <v-list-tile-content class="ml-2" v-text="data.item"></v-list-tile-content>
                                    </template>
                                    <template v-else-if="data.item.UEId">
                                        <v-list-tile-content class="ml-2" v-text="data.item.UEName"></v-list-tile-content>
                                    </template>
                                    <template v-else>
                                        <v-list-tile-content class="ml-2" v-text="data.item.moduleName"></v-list-tile-content>
                                    </template>
                                </template>
                            </v-select>
                        </v-flex>
                        <v-flex xs12 v-if="selectedModule.UEId" class="text-xs-center">
                            Coefficient de la note : {{ getSelectedUECoefficient }}
                        </v-flex>
                        <v-flex xs8 offset-xs2 md6 offset-md3 lg4 offset-lg4 xl2 offset-xl5>
                            <v-text-field box label="Note" hint="Valeur entre 1 et 6" persistent-hint v-model.trim="note" :rules="noteRules" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 text-xs-center>
                            <v-btn @click="addNote" color="accent">Ajouter la note</v-btn>
                        </v-flex>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            alert: {
                type: '',
                text: '',
                show: false
            },
            modules: [],
            noteValid: false,
            selectedModule: -1,
            selectData: [],
            note: 1,
            // Validation rules
            selectModuleRules: [
                // eslint-disable-next-line
                (v) => !!v && v !== -1 || 'Le choix d\'un module est obligatoire'
            ],
            noteRules: [
                // eslint-disable-next-line
                (v) => !!v || 'Ce champ est obligatoire',
                // eslint-disable-next-line
                (v) => v && parseFloat(v) >= 1 && parseFloat(v) <= 6 || 'La valeur doit être comprise entre 1 et 6'
            ]
        };
    },
    computed: {
        getSelectedUECoefficient: function () {
            return this.modules.find(el => el.id === this.selectedModule.moduleId).UE.find(el => el.id === this.selectedModule.UEId).coefficient;
        }
    },
    methods: {
        setAlert (type, text) {
            this.alert.type = type;
            this.alert.text = text;
            this.alert.show = true;
            setTimeout(() => {
                this.$scrollTo('#alertBox');
            }, 10); // 10ms pour laisser le temps au DOM d'afficher l'alert
        },
        isFirstModuleWithUE (id) {
            let isIt = false;
            this.selectUE.forEach(el => {
                if (el.id === id && el.UE) isIt = true;
            });

            return isIt;
        },
        getDataForSelectModules () {
            let selectData = [];
            this.modules.forEach(m => {
                selectData.push({ header: m.name });
                if (m.UE && m.UE.length > 0) {
                    m.UE.forEach(ue => {
                        selectData.push({ moduleId: m.id, moduleName: m.name, UEId: ue.id, UEName: ue.name });
                    });
                } else {
                    selectData.push({ moduleId: m.id, moduleName: m.name });
                }
            });
            return selectData;
        },
        returnModulesFromStorage () {
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
            // S'il n'y a pas d'UE, on veut quand meme un tableau vide -> Sinon problème d'affichage
            modules.forEach(m => {
                if (!m.UE) m.UE = [];
            });
            return modules;
        },
        addNote () {
            if (this.$refs.noteForm.validate()) {
                let note = this.note;
                let modules = this.returnModulesFromStorage();

                modules.forEach(m => {
                    if (m.id === this.selectedModule.moduleId) {
                        if (this.selectedModule.UEId) {
                            m.UE.forEach(ue => {
                                if (ue.id === this.selectedModule.UEId) {
                                    if (!ue.notes) ue.notes = [];
                                    ue.notes.push({ value: note, date: Date.now() });
                                }
                            });
                        } else {
                            if (!m.notes) m.notes = [];
                            m.notes.push({ value: note, date: Date.now() });
                        }
                    }
                });

                localStorage.setItem('modules', JSON.stringify(modules));

                this.selectedModule = -1;
                this.note = 1;

                this.setAlert('success', 'La note a été ajoutée avec succès !');
            } else {
                this.setAlert('error', 'Veuillez corriger les erreurs du formulaire');
            }
        }
    },
    mounted () {
        this.modules = this.returnModulesFromStorage();
        this.selectData = this.getDataForSelectModules();
    }
};
</script>

<style scoped>
</style>
