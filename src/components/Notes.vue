<template>
    <div>
        <v-layout row v-if="this.$route.name === 'Notes'">
            <v-flex xs12 md8 offset-md2>
                <v-subheader>Historique des notes ajoutées</v-subheader>
                <v-data-table :pagination.sync="pagination" rows-per-page-text="Notes par page :" :items="notesHistory" item-key="date" class="elevation-1" :headers="header" disable-initial-sort>
                    <template slot="items" slot-scope="props">
                        <td>
                            <v-icon :color="props.item.value > 4 ? 'green' : ( props.item.value == 4 ? 'yellow' : 'red')">{{ props.item.value > 4 ? 'thumb_up' : (props.item.value == 4 ? 'thumbs_up_down' : 'thumb_down') }}</v-icon>
                        </td>
                        <td>
                            {{ props.item.module }}
                        </td>
                        <td>
                            {{ props.item.ue ? props.item.ue : '-' }}
                        </td>
                        <td class="text-xs-right">
                            {{ props.item.value }}
                        </td>
                        <td class="text-xs-center">
                            {{ props.item.date | toReadableDate }}
                        </td>
                        <td>
                            <v-tooltip top>
                                <v-btn flat icon slot="activator" @click.native="$emit('delete-note', props.item)">
                                    <v-icon>delete_forever</v-icon>
                                </v-btn>
                                <span>Supprimer la note</span>
                            </v-tooltip>
                        </td>
                    </template>
                    <template slot="no-data">
                        Aucune note n'a été ajoutée
                    </template>
                </v-data-table>
                <v-btn class="mt-4" block color="accent" :to="{name: 'Ajout de note'}">Ajouter une note</v-btn>
            </v-flex>
        </v-layout>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data () {
        return {
            header: [
                { text: '', value: 'icon', align: 'center', sortable: false },
                { text: 'Module', value: 'module', align: 'left' },
                { text: 'Unité', value: 'ue', align: 'left' },
                { text: 'Note', value: 'note', align: 'right', sortable: false },
                { text: 'Date', value: 'date', align: 'center' },
                { text: '', value: 'actions', sortable: false }
            ],
            pagination: null,
            modules: null,
            notesHistory: []
        };
    },
    methods: {
        getNotes () {
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
            let notes = [];

            modules.forEach(module => {
                if (!module.UE || module.UE === null || module.UE.length === 0) {
                    if (module.notes && module.notes.length > 0) {
                        module.notes.forEach(note => {
                            note.module = module.name;
                            notes.push(note);
                        });
                    }
                } else {
                    module.UE.forEach(ue => {
                        if (ue.notes && ue.notes.length > 0) {
                            ue.notes.forEach(note => {
                                note.module = module.name;
                                note.ue = ue.name;
                                notes.push(note);
                            });
                        }
                    });
                }
            });

            // notes contient toutes les notes de tous les modules et UE
            function compareDateDESC (a, b) {
                if (a.date < b.date) {
                    return 1;
                } else if (a.date > b.date) {
                    return -1;
                } else {
                    return 0;
                }
            }

            // Tri les notes par date d'ajout décroissant
            notes.sort(compareDateDESC);
            this.notesHistory = notes;
        },
        deleteSelectedNote (note) {
            if (!confirm('Êtes-vous sûr(e) de vous vouloir supprimer cette note ?')) {
                return;
            }
            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));
            modules.forEach(module => {
                if (module.name === note.module) {
                    if (note.ue) {
                        module.UE.forEach(ue => {
                            if (ue.name === note.ue) {
                                ue.notes.forEach(el => {
                                    if (el.value === note.value && el.date === note.date) {
                                        delete note.ue;
                                        delete note.module;
                                        let index = ue.notes.indexOf(note);
                                        ue.notes.splice(index, 1);
                                    }
                                });
                            }
                        });
                    } else {
                        module.notes.forEach(el => {
                            if (el.value === note.value && el.date === note.date) {
                                delete note.module;
                                let index = module.notes.indexOf(note);
                                module.notes.splice(index, 1);
                            }
                        });
                    }
                }
            });
            localStorage.setItem('modules', JSON.stringify(modules));
            this.getNotes();
        }
    },
    mounted: function () {
        // Gestion de la suppression des notes
        this.$on('delete-note', (note) => {
            this.deleteSelectedNote(note);
        });

        // Récupération de toutes les notes
        this.getNotes();
    },
    beforeRouteUpdate (to, from, next) {
        this.getNotes();
        next();
    },
    filters: {
        toReadableDate: function (date) {
            if (!date) return 'Pas de date';
            let monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            let newDate = new Date(date);
            date = newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();
            return date;
        }
    }
};
</script>

<style scoped>
    .display-1, .subheading {
        text-align: center;
    }
</style>
