<template>
    <div>
        <v-container grid-list-md fluid>
            <v-layout row wrap>
                <v-flex id="alertBox" v-if="alert.show" xs12 md8 offset-md2>
                    <v-alert dismissible :type="alert.type" v-model="alert.show" transition="scale-transition">{{ alert.text }}</v-alert>
                </v-flex>
                <v-flex xs12 lg10 offset-lg1 mb-3>
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
                                    
                                    <div v-if="selectedModule !== -1 && nbOfUEInSelectedModule > 0">
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
                                        <div class="moyenne" :class="(parseFloat(organizedModules.find(el => el.id === selectedModule).moyenne) < 4 ? 'red' : parseFloat(organizedModules.find(el => el.id === selectedModule).moyenne) === 4 ? 'yellow' : 'green') + '--text'">{{ isNaN(organizedModules.find(el => el.id === selectedModule).moyenne) ? 'Aucune note n\'a été ajoutée' : organizedModules.find(el => el.id === selectedModule).moyenne }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-if="selectedModule !== -1 && nbOfUEInSelectedModule > 0 && selectedUE !== -1">
                                        <div class="titre-moyenne">Moyenne de l'unité d'enseignement :</div>
                                        <div class="moyenne" :class="(parseFloat(organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne) < 4 ? 'red' : parseFloat(organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne) === 4 ? 'yellow' : 'green') + '--text'">{{ isNaN(organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne) ? 'Aucune note n\'a été ajoutée' : organizedModules.find(el => el.id === selectedModule).UE.find(el => el.id === selectedUE).moyenne }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-if="moduleWithNewNote.length > 0">
                                        <v-divider class="mb-3"></v-divider>
                                        <div class="titre-moyenne">Moyenne simulée du module :</div>
                                        <div class="moyenne" :class="(parseFloat(moduleWithNewNote[0].moyenne) < 4 ? 'red' : parseFloat(moduleWithNewNote[0].moyenne) === 4 ? 'yellow' : 'green') + '--text'">{{ moduleWithNewNote[0].moyenne }}</div>
                                    </div>

                                    <div class="text-xs-center mt-3" v-if="moduleWithNewNote.length > 0 && nbOfUEInSelectedModule > 0 && selectedUE !== -1">
                                        <div class="titre-moyenne">Moyenne simulée de l'unité d'enseignement :</div>
                                        <div class="moyenne" :class="(parseFloat(moduleWithNewNote[0].UE.find(el => el.id === selectedUE).moyenne) < 4 ? 'red' : parseFloat(moduleWithNewNote[0].UE.find(el => el.id === selectedUE).moyenne) === 4 ? 'yellow' : 'green') + '--text'">{{ moduleWithNewNote[0].UE.find(el => el.id === selectedUE).moyenne }}</div>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12 class="text-xs-center mb-3">
                    <h3 class="mb-2">Ordre de tri des modules</h3>
                    <v-btn-toggle mandatory v-model="sortOrder" :style="$vuetify.breakpoint.smAndDown ? 'display: inline-block' : ''">
                        <v-btn flat value="date-asc" :style="$vuetify.breakpoint.smAndDown ? 'display: block; width: 100%;' : ''">
                            <span>Date d'ajout</span>
                            <v-icon>keyboard_arrow_up</v-icon>
                        </v-btn>
                        <v-btn flat value="date-desc" :style="$vuetify.breakpoint.smAndDown ? 'display: block; width: 100%;' : ''">
                            <span>Date d'ajout</span>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-btn>
                        <v-btn flat value="moyenne-asc" :style="$vuetify.breakpoint.smAndDown ? 'display: block; width: 100%;' : ''">
                            <span>Moyenne</span>
                            <v-icon>keyboard_arrow_up</v-icon>
                        </v-btn>
                        <v-btn flat value="moyenne-desc" :style="$vuetify.breakpoint.smAndDown ? 'display: block; width: 100%;' : ''">
                            <span>Moyenne</span>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-btn>
                        <v-btn flat value="nom-asc" :style="$vuetify.breakpoint.smAndDown ? 'display: block; width: 100%;' : ''">
                            <span>Nom</span>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-btn>
                        <v-btn flat value="nom-desc" :style="$vuetify.breakpoint.smAndDown ? 'display: block; width: 100%;' : ''">
                            <span>Nom</span>
                            <v-icon>keyboard_arrow_up</v-icon>
                        </v-btn>
                    </v-btn-toggle>
                </v-flex>
                <v-flex xs12>
                    <v-layout row wrap v-masonry transition-duration="0.3s" item-selector=".item" column-width=".grid-sizer">
                        <v-flex xs12 md6 lg4 xl3 class="grid-sizer" style="width: 100%; margin-bottom: -8px;"></v-flex>
                        <v-flex xs12 md6 lg4 xl3 v-masonry-tile class="item" v-for="mod in sortedArray" :key="mod.id" style="width: 100%;">
                            <v-card :class="isNaN(mod.moyenne) ? '' : parseFloat(mod.moyenne) < 4 ? 'red black--text' : parseFloat(mod.moyenne) === 4 ? 'yellow black--text' : 'green'">
                                <v-card-title>
                                    <span class="nom-module">{{ mod.name }}</span><v-spacer></v-spacer><span class="moyenne-module">{{ isNaN(mod.moyenne) ? 'Pas encore de notes' : 'Moyenne : ' + mod.moyenne }}</span>
                                </v-card-title>
                                <v-divider v-if="mod.UE" :class="parseFloat(mod.moyenne) <= 4 ? 'grey darken-3' : ''"></v-divider>
                                <v-card-text v-if="mod.UE">
                                    <div v-for="(ue, i) in mod.UE" :key="ue.id">
                                        <div class="ml-2 nom-ue">{{ ue.name }}</div>
                                        <div class="ml-4 coefficient-ue">Coefficient : {{ ue.coefficient }}</div>
                                        <div class="ml-4 moyenne-ue">{{ isNaN(ue.moyenne) ? 'Pas encore de notes' : 'Moyenne : ' + ue.moyenne }}</div>
                                        <v-divider v-if="i !== mod.UE.length - 1" class="mb-2 mt-2" :class="parseFloat(mod.moyenne) <= 4 ? 'grey darken-3' : ''"></v-divider> <!-- Ne s'affiche pas si c'est la dernière UE -->
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-tooltip top>
                                        <v-btn flat icon slot="activator" @click="$router.push({ path: `/modules/${parseInt(mod.id)}/edit` })">
                                            <v-icon :class="isNaN(mod.moyenne) ? '' : parseFloat(mod.moyenne) <= 4 ? 'black--text' : ''">edit</v-icon>
                                        </v-btn>
                                        <span>Modifier le module</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <v-btn flat icon slot="activator" @click.native="$emit('delete-module', mod.id)">
                                            <v-icon :class="isNaN(mod.moyenne) ? '' : parseFloat(mod.moyenne) <= 4 ? 'black--text' : ''">delete_forever</v-icon>
                                        </v-btn>
                                        <span>Supprimer le module</span>
                                    </v-tooltip>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
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
            moduleWithNewNote: [],
            sortOrder: 'moyenne-asc',
            alert: {
                type: '',
                text: '',
                show: false
            }
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
                    if (this.nbOfUEInSelectedModule > 1 && this.selectedUE !== -1) {
                        if (!modules.find(el => el.id === this.selectedModule).UE.find(el => el.id === this.selectedUE).notes) modules.find(el => el.id === this.selectedModule).UE.find(el => el.id === this.selectedUE).notes = [];
                        modules.find(el => el.id === this.selectedModule).UE.find(el => el.id === this.selectedUE).notes.push({ value: this.noteSimulee });
                    } else if (this.nbOfUEInSelectedModule === 0) {
                        modules.find(el => el.id === this.selectedModule).notes.push({ value: this.noteSimulee });
                    } else {
                        return;
                    }
                    modules = this.getFormattedModules([modules.find(el => el.id === this.selectedModule)]);
                    this.moduleWithNewNote = modules;
                }
            }
        },
        setAlert (type, text) {
            this.alert.type = type;
            this.alert.text = text;
            this.alert.show = true;
            setTimeout(() => {
                this.$scrollTo('#alertBox');
            }, 10); // 10ms pour laisser le temps au DOM d'afficher l'alert
        }
    },
    computed: {
        nbOfUEInSelectedModule () {
            if (this.organizedModules.length > 0 && this.organizedModules.find(el => el.id === this.selectedModule).UE !== undefined) return this.organizedModules.find(el => el.id === this.selectedModule).UE.length;
            else return 0;
        },
        sortedArray: function () {
            function sortMoyenneASC (a, b) {
                if (isNaN(a.moyenne)) return 1;
                if (isNaN(b.moyenne)) return -1;
                if (parseFloat(a.moyenne) > parseFloat(b.moyenne)) return 1;
                else if (parseFloat(a.moyenne) < parseFloat(b.moyenne)) return -1;
                else return 0;
            }

            function sortMoyennesDESC (a, b) {
                if (isNaN(a.moyenne)) return 1;
                if (isNaN(b.moyenne)) return -1;
                if (parseFloat(a.moyenne) > parseFloat(b.moyenne)) return -1;
                else if (parseFloat(a.moyenne) < parseFloat(b.moyenne)) return 1;
                else return 0;
            }

            function sortNomsASC (a, b) {
                if (a.name > b.name) return 1;
                else if (a.name < b.name) return -1;
                else return 0;
            }

            function sortNomsDESC (a, b) {
                if (a.name < b.name) return 1;
                else if (a.name > b.name) return -1;
                else return 0;
            }

            if (this.organizedModules.length > 0) {
                let sortedArray = [];
                switch (this.sortOrder) {
                case 'date-asc':
                    sortedArray = this.organizedModules.sort((a, b) => a.id - b.id);
                    break;
                case 'date-desc':
                    sortedArray = this.organizedModules.sort((a, b) => b.id - a.id);
                    break;
                case 'moyenne-asc':
                    sortedArray = this.organizedModules.sort(sortMoyenneASC);
                    break;
                case 'moyenne-desc':
                    sortedArray = this.organizedModules.sort(sortMoyennesDESC);
                    break;
                case 'nom-asc':
                    sortedArray = this.organizedModules.sort(sortNomsASC);
                    break;
                case 'nom-desc':
                    sortedArray = this.organizedModules.sort(sortNomsDESC);
                    break;
                }
                this.$nextTick(function () {
                    this.$redrawVueMasonry();
                });
                return sortedArray;
            }
        }
    },
    mounted: function () {
        this.$on('delete-module', (modID) => {
            let nomModule = this.organizedModules.find(el => el.id === modID).name;
            if (confirm('Etes-vous certain de vouloir supprimer le module : ' + nomModule + ' ? \nCette action est irréversible.')) {
                let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

                modules.forEach((mod, index) => {
                    if (mod.id === modID) {
                        modules.splice(index, 1);
                        console.log(modules);
                    }
                });

                localStorage.setItem('modules', JSON.stringify(modules));
                this.setAlert('success', 'Module correctement supprimé !');
                this.organizedModules = this.getFormattedModules(localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules')));
            } else {
                this.setAlert('info', 'Le module n\'a pas été supprimé.');
            }
        });
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

.nom-module {
    font-size: 1.5em;
    max-width: 70%;
}

.moyenne-module {
    font-size: 1.3em;
    font-weight: bolder;
}

.nom-ue {
    font-size: 1.2em;
}

.coefficient-ue {

}

.moyenne-ue {
    font-weight: bold;
    font-size: 1.1em;
}

.note-ue {
    font-size: 2em;
}
</style>
