<template>
    <div>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex xs12>
                    <h1>La page demandée n'a pas été trouvée</h1>
                    <v-btn large error :to="{ name: 'Tableau de bord' }">Retourner au tableau de bord</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
};
</script>

<style scoped>
</style>
