/* eslint-disable */
// Désactiver eslint pour éviter les erreurs 'no-mixed-operators'
export default {
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
            confirm: false,
            alert: {
                type: '',
                text: '',
                show: false
            },
            moduleValid: false,
            UEValid: true,
            moduleNameRules: [
                (v) => !!v || 'Le nom du module est obligatoire',
                (v) => v && v.length <= 100 || 'Le nom doit être inférieur ou égal à 100 caractères'
            ],
            moduleDescriptionRules: [
                (v) => v.length <= 255 || 'La description ne peut pas contenir plus de 255 caractères'
            ],
            UENameRules: [
                (v) => this.module.hasUE && !!v || 'Le nom de l\'unité est obligatoire',
                (v) => this.module.hasUE && v.length <= 100 || 'Le nom doit être inférieur ou égal à 100 caractères'
            ],
            UEDescriptionRules: [
                (v) => v.length <= 255 || 'La description ne peut pas contenir plus de 255 caractères'
            ],
            UECoefficientRules: [
                (v) => this.module.hasUE && (parseFloat(v) >= 0.1 && parseFloat(v) <= 10.) || 'Le coefficient doit être entre 0.1 et 10'
            ]
        };
    },
    methods: {
        setAlert (type, text) {
            this.alert.type = type;
            this.alert.text = text;
            this.alert.show = true;
        }
    }
};
