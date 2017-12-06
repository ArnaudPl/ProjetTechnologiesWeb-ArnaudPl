<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data () {
        return {
            modules: null
        };
    },
    created: function () {
        this.modules = localStorage.getItem('modules');
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // Force l'ajout de module lorsqu'il n'y en a pas encore
            if (vm.modules === null) {
                vm.$router.push({name: 'Ajout de module'});
            }
        });
    },
    beforeRouteUpdate (to, from, next) {
        // Force l'ajout de module lorsqu'il n'y en a pas encore
        if (to.name !== 'Ajout de module' && this.modules === null) {
            next({name: 'Ajout de module'});
        } else {
            next();
        }
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
