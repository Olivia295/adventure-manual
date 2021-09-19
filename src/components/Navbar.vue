<template>
  <nav>
    <!-- <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome!</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar> -->
    <v-app-bar depressed flat app color="indigo100">
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="text-uppercase indigo900--text">
        <span class="font-weight-light">Adventure</span>
        <span>Manual</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <!-- dropdown menu -->

      <v-menu offset-y transition="fab-transition">
        <template v-slot:activator="{ on, attrs }" class="d-none">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
            color="indigo900"
            class="d-none d-md-block"
          >
            <v-icon left>mdi-chevron-down</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.route"
            router
            :to="link.route"
          >
            <v-list-item-title>
              {{ link.text }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn text class="d-none d-lg-block" color="indigo900">
        <span>Sign Out</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" class="indigo400">
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          :to="link.route"
        >
          <v-list-item-action>
            <v-icon class="indigo800--text" :elevation="10">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-subtitle class="white--text mx-auto pa-4">{{
              link.text
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon class="indigo800--text">mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-subtitle class="white--text mx-auto pa-4"
              >Log Out</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: "mdi-view-dashboard", text: "Dashboard", route: "/" },
        { icon: "mdi-folder", text: "My Projects", route: "/projects" },
        { icon: "mdi-account", text: "Team", route: "/team" },
      ],
    };
  },
};
</script>

<style></style>
