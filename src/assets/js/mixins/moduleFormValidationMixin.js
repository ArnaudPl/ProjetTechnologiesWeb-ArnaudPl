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

/*
Désactivé le contrôle de l'unicité du nom pour le moment à cause de conflit avec la modification de module
Remettre comme ci-dessous pour que ça fonctionne et remettre le message d'erreur dans NameErrors :
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
*/

export default {
    mixins: [validationMixin],
    validations: {
        module: {
            name: {
                required,
                maxLength: maxLength(100)
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
    methods: {
        setAlert (type, text) {
            this.alert.type = type;
            this.alert.text = text;
            this.alert.show = true;
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
            confirm: false,
            alert: {
                type: '',
                text: '',
                show: false
            }
        };
    },
    computed: {
        nameErrors () {
            const errors = [];
            if (!this.$v.module.name.$dirty) return errors;

            if (!this.$v.module.name.maxLength) errors.push('Le nom ne peut pas contenir plus de 100 caractères');
            if (!this.$v.module.name.required) errors.push('Le nom est obligatoire');
            // if (!this.$v.module.name.isNameUnique) errors.push('Le nom du module ne peut pas être déjà utilisé par un autre module');
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
