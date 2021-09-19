<template>
  <v-app class="primary lighten-4">
    <Navbar />
    <v-content class="indigo50">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  components: { Navbar },
  name: "App",
  data() {
    return {};
  },
  mounted() {
    console.log(this.$vuetify.breakpoint.width);
  },
};
</script>
