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
                                    <v-select @input="handleNewNote" :items="organizedModules" item-text="name" item-value="id" v-model="selectedModule"></v-select>
                                    
                                    <div v-if="selectedModule !== -1 && organizedModules.find(el => el.id === selectedModule).UE">
                                        <h4>
                                            Choisissez une unité d'enseignement :
                                        </h4>
                                        <v-select @input="handleNewNote" :items="organizedModules.find(el => el.id === selectedModule).UE" item-text="name" item-value="id" v-model="selectedUE"></v-select>
                                    </div>

                                    <h4>
                                        Note à simuler :
                                    </h4>
                                    <v-text-field @input="handleNewNote" v-model="noteSimulee" :rules="noteSimuleeRules"></v-text-field>
                                </v-flex>

                                <v-flex xs12 lg6>
                                    <div class="text-xs-center" v-if="selectedModule !== -1">
                                        <div class="titre-moyenne">Moyenne du module :</div>
                                        <div class="moyenne" :class="(organizedModules.find(el => el.id === selectedModule).moyenne < 4 ? 'red' : organizedModules.find(el => el.id === selectedModule).moyenne === 4 ? 'yellow' : 'green') + '--text'">{{ isNaN(organizedModules.find(el => el.id === selectedModule).moyenne) ? 'Aucune note n\'a été ajoutée' : organizedModules.find(el => el.id === selectedModule).moyenne }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-if="selectedModule !== -1 && selectedUE !== -1">
                                        <div class="titre-moyenne">Moyenne de l'unité d'enseignement :</div>
                                        <div class="moyenne" :class="(organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne < 4 ? 'red' : organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne === 4 ? 'yellow' : 'green') + '--text'">{{ isNaN(organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne) ? 'Aucune note n\'a été ajoutée' : organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-if="moduleWithNewNote.length > 0">
                                        <v-divider class="mb-3"></v-divider>
                                        <div class="titre-moyenne">Moyenne simulée du module :</div>
                                        <div class="moyenne">{{ moduleWithNewNote[0].moyenne }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-if="moduleWithNewNote.length > 0 && selectedUE !== -1">
                                        <div class="titre-moyenne">Moyenne simulée de l'unité d'enseignement :</div>
                                        <div class="moyenne">{{ moduleWithNewNote[0].UE.find(el => el.id === selectedUE).moyenne }}</div>
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
            organizedModules: [],
            selectedModule: -1,
            selectedUE: -1,
            noteSimulee: null,
            noteSimuleeRules: [
                // eslint-disable-next-line
                (v) => (parseFloat(v) >= 1. && parseFloat(v) <= 6. && ((parseFloat(v) * 100) % 5) / 100 === 0) || 'La note doit être entre 1 et 6 et être un multiple de 0.05'
            ],
            moduleWithNewNote: []
        };
    },
    methods: {
        getFormattedModules (modules) {
            let organizedModules = [];

            modules.forEach(mod => {
                let organizedUE = [];
                let tmpModule = {};
                tmpModule.id = mod.id;
                tmpModule.name = mod.name;

                if (mod.UE && mod.UE.length > 0) {
                    mod.UE.forEach(ue => {
                        let tmpUE = {};
                        tmpUE.id = ue.id;
                        tmpUE.name = ue.name;
                        tmpUE.coefficient = ue.coefficient;

                        if (ue.notes && ue.notes.length > 0) {
                            let sommeNotes = 0;
                            ue.notes.forEach(note => {
                                sommeNotes += parseFloat(note.value);
                            });
                            tmpUE.moyenne = (sommeNotes / ue.notes.length).toFixed(2);
                        }

                        organizedUE.push(tmpUE);
                    });
                    tmpModule.UE = organizedUE;

                    // Ajoute toutes les moyennes des UE du module dans un tableau en tenant compte du coefficient
                    let moyennesUE = [];
                    organizedUE.forEach(ue => {
                        if (ue.moyenne) {
                            for (let i = 0; i <= parseFloat(ue.coefficient); i += 0.05) moyennesUE.push(parseFloat(ue.moyenne));
                        }
                    });

                    // Calcule la moyenne générale du module
                    let sommeMoyennesUE = 0;
                    moyennesUE.forEach(moyenne => {
                        sommeMoyennesUE += parseFloat(moyenne);
                    });
                    tmpModule.moyenne = (sommeMoyennesUE / moyennesUE.length).toFixed(2);
                    organizedModules.push(tmpModule);
                } else {
                    if (mod.notes && mod.notes.length > 0) {
                        let sommeNotes = 0;
                        mod.notes.forEach(note => {
                            sommeNotes += parseFloat(note.value);
                        });
                        tmpModule.moyenne = (sommeNotes / mod.notes.length).toFixed(2);
                    }
                    organizedModules.push(tmpModule);
                }
            });
            return organizedModules;
        },
        handleNewNote () {
            this.moduleWithNewNote = [];
            // Vérifie que la note saisie est valide
            if (this.noteSimuleeRules[0](this.noteSimulee) === true) {
                // Vérifie qu'un module ait été sélectionné
                if (this.selectedModule !== -1) {
                    let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
                    // Vérifie que l'utilisateur ait sélectionné une UE si le module en possède
                    if (this.organizedModules.find(el => el.id === this.selectedModule).UE.length > 0 && this.selectedUE !== -1) {
                        modules.find(el => el.id === this.selectedModule).UE.find(el => el.id === this.selectedUE).notes.push({ value: this.noteSimulee });
                    } else if (!this.organizedModules.find(el => el.id === this.selectedModule).UE || this.organizedModules.find(el => el.id === this.selectedModule).UE.length === 0) {
                        modules.find(el => el.id === this.selectedModule).notes.push({ value: this.noteSimulee });
                    } else {
                        return;
                    }
                    modules = this.getFormattedModules([modules.find(el => el.id === this.selectedModule)]);
                    this.moduleWithNewNote = modules;
                }
            }
        }
    },
    mounted: function () {
        this.organizedModules = this.getFormattedModules(localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules')));
    },
    beforeRouteUpdate (to, from, next) {
        if (to.name === 'Tableau de bord') {
            this.organizedModules = this.getFormattedModules(localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules')));
        }
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
