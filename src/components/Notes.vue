<template>
    <div>
        <h5 class="display-1">{{ title }}</h5>
        <p class="subheading">{{ subheading }}</p>
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: 'Gestion des notes',
            subheading: 'Semestre d\'automne 2017'
        };
    }
};
</script>

<style scoped>
    .display-1, .subheading {
        text-align: center;
    }
</style>
