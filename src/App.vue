<template>

  <v-app class="primary lighten-4">
      
    <Navbar />
    <v-main class="indigo50">
        <!-- <top-header></top-header> -->
      <router-view></router-view>
    </v-main>
      <!-- <div>
    Logged in
    <div v-if="loggedIn">Yes</div>
    <div v-else>No</div>
    <v-btn @click="signOut">Sign out</v-btn>
  </div> -->
  </v-app>
</template>

<script>
import "firebase/auth";

import Navbar from "./components/Navbar";

export default {
  components: { Navbar },
  name: "App",
  data() {
    return {
        loggedIn: false,
        icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    };
  },
  
  mounted() {
    console.log(this.$vuetify.breakpoint.width);
  },

  methods: {
    
  },
};
</script>
