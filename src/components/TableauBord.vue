<template>
    <div>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex xs12 lg10 offset-lg1>
                    <v-card>
                        <v-card-title primary-title>
                            <h2>Simulateur de notes</h2>
                        </v-card-title>
                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex xs12 lg6>
                                    <h4>
                                        Choisissez un module :
                                    </h4>
                                    <v-select @input="getUEofSelectedModule" :items="modules" item-text="name" item-value="id" v-model="selectedModule"></v-select>
                                    
                                    <div v-show="selectedModule !== -1 && ue.length > 0">
                                        <h4>
                                            Choisissez une unité d'enseignement :
                                        </h4>
                                        <v-select @input="inputUE" :items="ue" item-text="name" item-value="id" v-model="selectedUE"></v-select>
                                    </div>

                                    <h4>
                                        Note à simuler :
                                    </h4>
                                    <v-text-field @input="handleNewNote" v-model="noteSimulee" :rules="noteSimuleeRules"></v-text-field>
                                </v-flex>
                                <v-flex xs12 lg6>
                                    <div class="text-xs-center" v-show="selectedModule !== -1 && (ue.length === 0 || selectedUE !== -1)">
                                        <div class="titre-moyenne">Moyenne du module :</div>
                                        <div class="moyenne" :class="(moyenneModule < 4 ? 'red' : moyenneModule === 4 ? 'yellow' : 'green') + '--text'">{{ moyenneModule === -1 ? 'Aucune note n\'a été ajoutée' : moyenneModule.toFixed(2) }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-show="selectedUE !== -1">
                                        <div class="titre-moyenne">Moyenne de l'unité d'enseignement :</div>
                                        <div class="moyenne" :class="(moyenneUE < 4 ? 'red' : moyenneUE === 4 ? 'yellow' : 'green') + '--text'">{{ moyenneUE === -1 ? 'Aucune note n\'a été ajoutée' : moyenneUE.toFixed(2) }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-show="moyenneModuleSimulee > -1">
                                        <v-divider class="mb-3"></v-divider>
                                        <div class="titre-moyenne">Moyenne simulée du module :</div>
                                        <div class="moyenne" :class="(moyenneModuleSimulee < 4 ? 'red' : moyenneModuleSimulee === 4 ? 'yellow' : 'green') + '--text'">{{ moyenneModuleSimulee.toFixed(2) }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-show="moyenneUESimulee > -1">
                                        <div class="titre-moyenne">Moyenne simulée de l'unité d'enseignement :</div>
                                        <div class="moyenne" :class="(moyenneUESimulee < 4 ? 'red' : moyenneUESimulee === 4 ? 'yellow' : 'green') + '--text'">{{ moyenneUESimulee.toFixed(2) }}</div>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            modules: [],
            selectedModule: -1,
            ue: [],
            selectedUE: -1,
            moyenneModule: -1,
            moyenneUE: -1,
            noteSimulee: null,
            moyenneModuleSimulee: -1,
            moyenneUESimulee: -1,
            noteSimuleeRules: [
                // eslint-disable-next-line
                (v) => (parseFloat(v) >= 1. && parseFloat(v) <= 6. && ((parseFloat(v) * 100) % 5) / 100 === 0) || 'La note doit être entre 1 et 6 et être un multiple de 0.05'
            ]
        };
    },
    methods: {
        getModulesList () {
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
            this.modules = [];

            modules.forEach(mod => {
                this.modules.push({
                    name: mod.name,
                    id: mod.id
                });
            });
        },
        getUEofSelectedModule () {
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
            this.ue = [];
            this.selectedUE = -1;
            let currentModule;

            modules.forEach(mod => {
                if (mod.id === this.selectedModule) {
                    currentModule = mod;
                    if (mod.UE && mod.UE.length > 0) {
                        mod.UE.forEach(ue => {
                            this.ue.push({
                                name: ue.name,
                                id: ue.id
                            });
                        });
                    }
                }
            });

            this.moyenneModule = this.getMoyenneModuleSansUE(currentModule);
        },
        inputUE () {
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
            let moyennesUE = [];
            this.moyenneUE = -1;

            modules.forEach(mod => {
                if (mod.id === this.selectedModule) {
                    mod.UE.forEach(ue => {
                        let moyenneUE = this.getMoyenneUE(ue);
                        if (moyenneUE !== -1) {
                            for (let i = 0; i <= parseFloat(ue.coefficient); i += 0.05) {
                                moyennesUE.push(moyenneUE);
                            }

                            if (ue.id === this.selectedUE) {
                                this.moyenneUE = moyenneUE;
                            }
                        }
                    });
                }
            });
            let sommeMoyennesUE = 0;
            moyennesUE.forEach(moy => {
                sommeMoyennesUE += moy;
            });

            if (moyennesUE.length) this.moyenneModule = sommeMoyennesUE / moyennesUE.length;
            else this.moyenneModule = -1;
        },
        handleNewNote () {
            let moyenneSimUE = -1;
            let moyenneSimModule = -1;
            let moyennesUE = [];

            if (parseFloat(this.noteSimulee) >= 1 && this.selectedModule > -1 && this.noteSimuleeRules[0](this.noteSimulee) === true) {
                let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

                modules.forEach(mod => {
                    if (mod.id === this.selectedModule) {
                        if (mod.UE && mod.UE.length > 0 && this.selectedUE > -1) {
                            mod.UE.forEach(ue => {
                                if (ue.id === this.selectedUE) {
                                    if (!ue.notes) ue.notes = [];
                                    ue.notes.push({ value: parseFloat(this.noteSimulee) });
                                    moyenneSimUE = this.getMoyenneUE(ue);
                                    if (moyenneSimUE !== -1) {
                                        for (let i = 0; i <= parseFloat(ue.coefficient); i += 0.05) moyennesUE.push(moyenneSimUE);
                                    }
                                } else {
                                    let moyenneUE = this.getMoyenneUE(ue);
                                    if (moyenneUE !== -1) {
                                        for (let i = 0; i <= parseFloat(ue.coefficient); i += 0.05) moyennesUE.push(moyenneUE);
                                    }
                                }
                            });
                        }
                    }
                });
                let sommeMoyennesUE = 0;
                moyennesUE.forEach(moyenne => {
                    sommeMoyennesUE += moyenne;
                });

                if (moyennesUE.length) moyenneSimModule = sommeMoyennesUE / moyennesUE.length;
                else moyenneSimModule = -1;
            }

            this.moyenneModuleSimulee = moyenneSimModule;
            this.moyenneUESimulee = moyenneSimUE;
        },
        getMoyenneUE (ue) {
            let sommeNotes = 0;
            if (ue.notes && ue.notes.length > 0) {
                ue.notes.forEach(note => {
                    sommeNotes += note.value;
                });
                return sommeNotes / ue.notes.length;
            } else {
                return -1;
            }
        },
        getMoyenneModuleSansUE (mod) {
            if (this.ue.length === 0 && mod.notes && mod.notes.length > 0) {
                let sommeNotes = 0;

                mod.notes.forEach(note => {
                    sommeNotes += note.value;
                });
                return sommeNotes / mod.notes.length;
            } else {
                return -1;
            }
        }
    },
    mounted: function () {
        this.getModulesList();
    },
    beforeRouteUpdate (to, from, next) {
        this.getModulesList();
        next();
    }
};
</script>

<style>
.simulateur-icone {
    font-size: 12vw;
    width: 100%;
    height: 100%;
}

.titre-moyenne {
    font-size: 1.2em;
}

.moyenne {
    font-size: 2em;
    font-weight: bolder;
    color: red;
}
</style>
