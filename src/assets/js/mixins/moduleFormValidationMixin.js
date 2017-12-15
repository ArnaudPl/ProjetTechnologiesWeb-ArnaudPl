/* eslint-disable */
// Désactiver eslint pour éviter les erreurs 'no-mixed-operators'
export default {
    data () {
        return {
            module: {
                id: -1,
                name: '',
                description: '',
                hasUE: false
            },
            tmpUE: {
                id: -1,
                name: '',
                description: '',
                coefficient: 1
            },
            headers: [
                { text: 'Nom de l\'unité', value: 'name', align: 'left' },
                { text: 'Description', value: 'description', align: 'left', sortable: false },
                { text: 'Coefficient', value: 'coefficient', align: 'right' },
                { text: 'Actions', value: 'actions', align: 'center', sortable: false}
            ],
            UE: [],
            editMode: false,
            confirm: false,
            alert: {
                type: '',
                text: '',
                show: false
            },
            moduleValid: false,
            UEValid: true,
            // Règles de validation des formulaires
            moduleNameRules: [
                (v) => !!v || 'Le nom du module est obligatoire',
                (v) => v && v.length <= 100 || 'Le nom doit être inférieur ou égal à 100 caractères',
                (v) => this.isModuleNameUnique(this.module.id, v) || 'Le nom ne peut pas avoir déjà été utilisé pour un autre module'
            ],
            moduleDescriptionRules: [
                (v) => v.length <= 255 || 'La description ne peut pas contenir plus de 255 caractères'
            ],
            UENameRules: [
                (v) => !!v || 'Le nom de l\'unité est obligatoire',
                (v) => v.length <= 100 || 'Le nom doit être inférieur ou égal à 100 caractères',
                (v) => this.isUENameUnique(this.module.id, this.tmpUE.id, v) || 'Une seule unité d\'enseignement peut avoir ce nom dans ce module'
            ],
            UEDescriptionRules: [
                (v) => v.length <= 255 || 'La description ne peut pas contenir plus de 255 caractères'
            ],
            UECoefficientRules: [
                (v) => (parseFloat(v) >= 0.1 && parseFloat(v) <= 10.) || 'Le coefficient doit être entre 0.1 et 10'
            ]
        };
    },
    methods: {
        isModuleNameUnique (id, value) {
            if (value === '') return true;
            let isIt = true;

            let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

            modules.forEach(m => {
                if (m.name === value && m.id !== id) isIt = false;
            });
            return isIt;
        },
        isUENameUnique (moduleId, UEId, UEName) {
            if (UEName === '') return true;
            let isIt = true;

            if (moduleId !== -1) {
                let modules = localStorage.getItem('modules') === null ? [] : JSON.parse(localStorage.getItem('modules'));

                modules.forEach(m => {
                    if (m.id === moduleId && m.UE) {
                        m.UE.forEach(ue => {
                            if (ue.name === UEName && ue.id !== UEId) isIt = false;
                        });
                    }
                });
            } else {
                this.UE.forEach(ue => {
                    if (ue.name === UEName &&  ue.id !== UEId) isIt = false;
                });
            }
            return isIt;
        },
        setAlert (type, text) {
            this.alert.type = type;
            this.alert.text = text;
            this.alert.show = true;
            setTimeout(() => {
                this.$scrollTo('#alertBox');
            }, 10); // 10ms pour laisser le temps au DOM d'afficher l'alert
        }
    }
};
