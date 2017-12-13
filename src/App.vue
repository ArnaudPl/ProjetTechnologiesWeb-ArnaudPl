<template>
  <v-app dark>
    
    <v-navigation-drawer clipped :temporary="mobile" fixed :mini-variant="miniVariant" v-model="drawer" app>
      <v-list>
        <v-list-tile v-for="(item, i) in items" :key="i" value="true">

          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
          
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <v-btn icon @click.native.stop="miniVariant = !miniVariant" v-show="!this.mobile">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>

      <v-btn icon @click.stop="drawer = !drawer" v-show="this.mobile">
        <v-icon v-html="drawer ? 'menu': 'menu'"></v-icon>
      </v-btn>
      
      <v-toolbar-title v-text="title"></v-toolbar-title>

    </v-toolbar>

    <v-content>
      <v-container fluid>

        <v-slide-y-transition mode="out-in">

          <v-layout column align-center>

          </v-layout>
          
        </v-slide-y-transition>

      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2017</span>
      <v-spacer></v-spacer>
      <span>Tiago Rodrigues et Arnaud Plumez</span>
      <v-spacer></v-spacer>
      <span>HEG</span>
    </v-footer>

  </v-app>
</template>

<script>
function isMobile () {
    return window.innerWidth < 993;
}
export default {
    data () {
        return {
            drawer: true,
            items: [
                {
                    icon: 'email',
                    title: 'Inspire'
                }
            ],
            miniVariant: true,
            title: 'Le projet incroyable',
            mobile: false
        };
    },
    created () {
        this.mobile = isMobile();
        this.onResize();
        if (this.mobile) {
            this.drawer = false;
        }
    },
// pas utilisé mounted pask il s'utilise qu'une fois
    mounted () {
        window.addEventListener('resize', this.onResize);
        this.mobile = isMobile();
        this.onResize();
        if (this.mobile) {
            this.drawer = false;
        }
    },
    destroyed () {
        window.removeEventListener('resize', this.onResize);
    },

    methods: {
        onResize () {
            this.mobile = isMobile();

            if (this.mobile) {
                this.miniVariant = false;
                this.drawer = false;
            } else {
                this.drawer = true;
                this.miniVariant = true;
            }
        }
    }
};
</script>
