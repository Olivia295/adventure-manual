<template>
  <nav>
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
        <v-card>
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
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-card v-if="loggedIn" class="mx-auto" width="256" tile>
      <v-navigation-drawer app v-model="drawer" color="indigo100">
        <v-container class="mt-2" rounded>
          <v-list-item>
            <v-badge avatar bordered overlap>
              <template v-slot:badge>
                <v-avatar size="64">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/logos/v.png"
                  ></v-img>
                </v-avatar>
              </template>

              <v-avatar size="75">
                <v-img src="../assets/自画像.jpg"></v-img>
              </v-avatar>
            </v-badge>
          </v-list-item>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                {{ currentUserInfo.username }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-subtitle">{{
                currentUserInfo.email
              }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6 indigo400--text"
                >Your Goal:</v-list-item-title
              >

              <v-list-item-subtitle class="text-subtitle black--text">
                {{ currentUserInfo.goal }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-container>
        <v-divider></v-divider>
        <v-list nav dense rounded>
          <v-list-item-group color="primary">
            <v-list-item v-for="(link, i) in links" :to="link.route" :key="i">
              <v-list-item-icon>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ link.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-item class="my-4">
            <v-list-item-content>
              <v-btn @click="changeSheet()"
                >登出
                <v-icon right>mdi-logout</v-icon>
              </v-btn>
              <v-bottom-sheet v-model="sheet" persistent>
                <v-sheet class="text-center" height="200px">
                  <v-btn
                    class="mt-6"
                    text
                    color="green"
                    plain
                    @click="changeSheet()"
                  >
                    仍未决定好
                  </v-btn>
                  <v-btn class="mt-6" text color="red" plain @click="signOut()">
                    现在登出
                  </v-btn>
                  <div class="py-3">
                    你决定现在登出吗？
                  </div>
                </v-sheet>
              </v-bottom-sheet>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
    <v-card v-else>
      <v-navigation-drawer app v-model="drawer" color="indigo100">
        <v-list dense>
          <v-list-item>
            <v-list-item-content class="my-4">
              <v-list-item-title class="text-warp my-4">
                登录开始冒险之旅！
              </v-list-item-title>
              <v-btn class="mb-4 indigo--text" to="/login">登录账户</v-btn>
              <v-divider></v-divider>
              <v-list-item-title class="text-wrap my-4">
                未拥有账户？来注册吧！
              </v-list-item-title>
              <v-btn class="mb-4 indigo--text" to="/register">注册账户</v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </nav>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/auth";
import db from "@/fb";

export default {
  data() {
    return {
      currentUserInfo: "",
      currentUserAuth: "",

      drawer: false,
      sheet: false,
      selectedILink: 0,
      links: [
        { icon: "mdi-home", text: "Home", route: "/" },
        {
          icon: "mdi-format-list-checks",
          text: "Missions",
          route: "/missions",
        },
        { icon: "mdi-sine-wave", text: "Analysis", route: "/analysis" },
        { icon: "mdi-calendar", text: "Calendar", route: "/calendar" },
      ],
      loggedIn: false,
    };
  },
  mounted() {
    this.setupFirebase();
  },

  methods: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged((user) => {
        this.loggedIn = !!user;
        if (user) {
          // User is signed in.
          console.log("signed in");
          this.currentUserAuth = user;
          //   console.log(this.currentUserAuth);
          this.getUsers(user);
          this.loggedIn = true;
        } else {
          // No user is signed in.
          this.loggedIn = false;
          console.log("signed out", this.loggedIn);
        }
      });
    },
    async getUsers(user) {
      let snapshot = await db.collection("users").get();
      snapshot.forEach((doc) => {
        if (doc.data().email == user.email) {
          this.currentUserInfo = doc.data();
        }
      });
    },

    changeSheet() {
      this.sheet = !this.sheet;
    },
    async signOut() {
      try {
        await firebase.auth().signOut();
        this.$router.replace({ name: "Missions" });
      } catch (err) {
        console.log(err);
      }
      this.changeSheet();
    },
  },
};
</script>
