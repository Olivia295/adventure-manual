<template>
  <v-card class="mt-4 mx-auto" max-width="400">
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="cyan"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
      <v-sparkline
        :labels="Object.keys(dateData)"
        :value="Object.values(dateData)"
        color="white"
        line-width="2"
        padding="16"
      ></v-sparkline>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="text-h6 font-weight-light mb-2">
        User Registrations
      </div>
      <div class="subheading font-weight-light grey--text">
        Last Campaign Performance
      </div>
      <v-divider class="my-2"></v-divider>
      <v-icon class="mr-2" small>
        mdi-clock
      </v-icon>
      <span class="text-caption grey--text font-weight-light"
        >last registration 26 minutes ago</span
      >
    </v-card-text>
    {{ getPast7Days() }}
  </v-card>
</template>
<script>
import firebase from "firebase/compat/app";
import "firebase/auth";
import db from "@/fb";

export default {
  data() {
    return {
      dateData: {
        "12am": 100,
        "3am": 200,
        "6am": 200,
        "9am": 200,
        "12pm": 200,
        "3pm": 200,
        "6pm": 200,
        "9pm": 200,
      },
    };
  },

  mounted() {
    this.getMissions();
    this.getMissionsDate();
    this.setupFirebase();
  },
  methods: {
    //获取当前时间戳
    updateTimestamps() {
      return (this.createdDate = new Date());
    },
    getPast7Days() {},
    timestampToTime(timestamps) {
      var date = new Date(timestamps * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      //   return y + "年 " + MM + "月" + d + "日 ";
      return MM + "-" + d;
    },
    getMissionsDate() {
      db.collection("missions").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
            console.log(
              Date.parse(new Date()).substring(
                0,
                Date.parse(new Date()).length - 2
              )
            );
            console.log(
              this.timestampToTime(
                Date.parse(new Date()).substring(
                  0,
                  Date.parse(new Date()).length - 2
                )
              )
            );
            console.log(change.doc.data().createdTimestamps);
            console.log(
              this.timestampToTime(change.doc.data().createdTimestamps)
            );
          }
        });
      });
    },
    getMissionCountDataToDate() {},
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
    getMissions() {
      let missions = [];
      db.collection("missions").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
            missions.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
      });
      this.missions = missions;
    },
    //时间戳转换为时间
    formatTime(param) {
      let y = param.getFullYear();
      let m = param.getMonth() + 1;
      let d = param.getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d + " ";
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
    this.getMissions();
  },
};
</script>
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
