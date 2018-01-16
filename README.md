# projet-tiago_arnaud

> Réalisation d'une application de gestion des notes d'une Haute Ecole avec l'utilisation de webpack, VueJS et Vuetify dans le cadre du cours "Projet de technologies web de présentation" donné par M. Fritscher. L'application est visible à [cette adresse](https://heg-web.github.io/projet-tiago_arnaud/).

## Description du projet
### De l'idée ...
L'idée de base du projet était de pouvoir gérer les différents résultats scolaires réalisés au sein d'une formation modulaire, telle que dans la plupart des Hautes Ecoles de Suisse romande.<br>
Au départ, il était question d'une gestion totale de la vie scolaire en comprenant :
- Gestion des années scolaires, des semestres, des modules et des unités d'enseignement
- Gestion des horaires semestriels
- Gestion de résumés par leçon regroupés sur la page de l'unité d'enseignement / du module

### ... à la réalisation
Nous avons ensuite fait une estimation du temps requis pour chaque fonctionnalité et nous nous sommes vite rendu compte qu'il fallait qu'on se limite à une application plus simple dans le cadre du cours étant donné que nous n'avions qu'un mois et demi à disposition.<br>
Nous nous sommes alors limité à la gestion de modules, d'unités d'enseignement et de notes / moyennes.<br>
Les fonctionnalités que nous n'avons pas pu implémenter seront certainement ajoutées plus tard.

## Guide d'installation

``` bash
# installer toutes les dépendences
$ npm install

# lancer le serveur local avec rafraîchissement automatique à l'adresse localhost:8080
$ npm run dev

# build pour la production
$ npm run build

# build pour la production avec un rapport d'analyse
$ npm run build --report

# déployer sur la branche gh-pages de l'association HEG-Web sur Github visible à l'adresse heg-web.github.io/moncv-ArnaudPl (tous les fichiers doivent avoir été commit)
$ npm run deploy
```

## Configuration
### Editeur - .editorconfig
Définir `indent_size = 4`

### ESLint - .eslintrc.js
Ajouter :
``` js
'rules': {
    "semi": ["error", "always"],
    "indent": ["error", 4],
    ...
}
```

### Webpack - config/index.js
Modifier :
``` js
build: {
    ...
    assetsPublicPath: '/projet-tiago_arnaud/',
    ...
}
```

## Technologies utilisées
Toutes les technologies utilisées sont disponibles via le gestionnaire de paquets de Node : [npm](https://www.npmjs.com/).<br>
Seuls les paquets installés indépendemment et les plus importants seront listés ci-dessous.<br>
Les informations quant à l'installation ou à l'utilisation de celles-ci ne seront pas fournies dans ce Readme, merci de vous référer à leur documentation officielle.

### Global
- vue-cli
- vue
- vue-router
- vuetify
- vue-scrollto
- eslint
- webpack
- push-dir

### Tableau de bord
- vue-masonry

## Problèmes rencontrés et solutions
Le principal problème durant ce projet aura été le temps disponible. Nous avons donc réduit nos exigences quant aux fonctionnalités pour réussir à terminer complètement le projet dans les temps sans avoir de fonctionnalités semi-implémentées.



## Principales leçons apprises


## Schéma de l'architecture
> Structure des imbrications des composants et accès aux données

## Images de croquis papier