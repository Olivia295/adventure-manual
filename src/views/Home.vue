<template>
  <v-container style="max-width:500px">
    <v-card v-if="plots.length > 0">
      <template v-for="(plot, i) in plots">
        <v-card :key="i" class="mx-auto" color="grey lighten-4" max-width="600">
          <v-card-text class="pt-6" style="position: relative;">
            <v-btn absolute color="orange" class="white--text" fab large right>
              <v-icon>mdi-cart</v-icon>
            </v-btn>
            <div class="font-weight-light grey--text text-h6 mb-2">
              {{ plot.title }}
            </div>
            <h3 class="text-h4 font-weight-light orange--text mb-2">
              {{ plot.plotType }}
            </h3>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Name
                    </th>
                    <th class="text-left">
                      Calories
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i">
                    <td>{{ plot.title }}</td>
                    <td>{{ plot.content }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-divider class="mb-4"></v-divider>
        </v-card>
      </template>
    </v-card>
  </v-container>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/auth";
import db from "@/fb";

export default {
  data() {
    return {
      //登录信息
      currentUserInfo: undefined,
      currentUserRef: undefined,
      currentUserAuth: undefined,
      loggedIn: undefined,

    //   currentPlotRef: undefined,

      plots: [],
    };
  },
  computed: {},
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
    //渲染任务列表
    async getPlots() {
      let plots = [];
      db.collection("plots").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
              console.log(change.doc.id)
            this.getMissions(change.doc.id);
            plots.push({
              ...change.doc.data(),
              missions:this.getMissions(change.doc.id),
              id: change.doc.id,
            });
            console.log(plots[0].missions)
          }
        });
      });
      this.plots = plots;
    },
    async getMissions(_currentPlotRef) {
      let missions = [];
      db.collection("missions").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().plot.id == _currentPlotRef
          ) {
            console.log("change " + change.doc.data().plot.id);
            console.log("ref " + _currentPlotRef);
            missions.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
            console.log(missions[0]);
          }
        });
      });
      return missions;
    },
  },
  created() {
    //获取currentUserRef
    db.collection("users").onSnapshot((res) => {
      const changes = res.docChanges();

      changes.forEach((change) => {
        if (
          change.type === "added" &&
          this.currentUserAuth.email == change.doc.data().email
        ) {
          this.currentUserRef = change.doc.id;
        }
      });
    });

    this.getPlots();
  },
};
</script>

<style></style>
