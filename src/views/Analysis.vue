<template>
  <v-container>

    <v-card class="my-8 mx-auto" max-width="400">
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="indigo100"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
        <v-sparkline
          :labels="Object.keys(missionsCreatedInADay)"
          :value="Object.values(missionsCreatedInADay)"
          color="indigo"
          line-width="2"
          padding="16"
        ></v-sparkline>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="text-h6 font-weight-light mb-2">
          用户创建任务数
        </div>
        <div class="subheading font-weight-light grey--text">
          截止至今天
        </div>
        <v-divider class="my-2"></v-divider>
        <v-icon class="mr-2" small>
          mdi-clock
        </v-icon>
      </v-card-text>
    </v-card>
    <v-card class="my-8 mx-auto" max-width="400">
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="indigo100"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
        <v-sparkline
          :labels="Object.keys(missionsFinishedInADay)"
          :value="Object.values(missionsFinishedInADay)"
          color="indigo"
          line-width="2"
          padding="16"
        ></v-sparkline>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="text-h6 font-weight-light mb-2">
          用户完成任务数
        </div>
        <div class="subheading font-weight-light grey--text">
          截止至今天
        </div>
        <v-divider class="my-2"></v-divider>
        <v-icon class="mr-2" small>
          mdi-clock
        </v-icon>
      </v-card-text>
      <div></div>
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
      missionsCreatedInADay: {},
      missionsFinishedInADay: {},
    };
  },

  mounted() {
    this.getMissions();
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
      return MM + "-" + d;
    },
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
    getTimestamp() {
      return Math.round(new Date().getTime() / 1000).toString();
    },
    //渲染任务列表
    getMissions() {
      db.collection("missions").onSnapshot((res) => {
        const changes = res.docChanges();

        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
            if (
              Math.round(new Date().getTime() / 1000) - 604800 <
              change.doc.data().createdTimestamps.seconds <
              Math.round(new Date().getTime() / 1000) - 518400
            ) {
              if (
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] == undefined
              ) {
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] = 0;
              }
              this.missionsCreatedInADay[
                this.timestampToTime(change.doc.data().createdTimestamps)
              ] += 1;
            } else if (
              change.doc.data().createdTimestamps.seconds <
              Math.round(new Date().getTime() / 1000) - 432000
            ) {
              if (
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] == undefined
              ) {
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] = 0;
              }
              this.missionsCreatedInADay[
                this.timestampToTime(change.doc.data().createdTimestamps)
              ] += 1;
            } else if (
              change.doc.data().createdTimestamps.seconds <
              Math.round(new Date().getTime() / 1000) - 345600
            ) {
              if (
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] == undefined
              ) {
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] = 0;
              }
              this.missionsCreatedInADay[
                this.timestampToTime(change.doc.data().createdTimestamps)
              ] += 1;
            } else if (
              change.doc.data().createdTimestamps.seconds <
              Math.round(new Date().getTime() / 1000) - 259200
            ) {
              if (
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] == undefined
              ) {
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] = 0;
              }
              this.missionsCreatedInADay[
                this.timestampToTime(change.doc.data().createdTimestamps)
              ] += 1;
            } else if (
              change.doc.data().createdTimestamps.seconds <
              Math.round(new Date().getTime() / 1000) - 172800
            ) {
              if (
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] == undefined
              ) {
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] = 0;
              }
              this.missionsCreatedInADay[
                this.timestampToTime(change.doc.data().createdTimestamps)
              ] += 1;
            } else if (
              change.doc.data().createdTimestamps.seconds <
              Math.round(new Date().getTime() / 1000) - 86400
            ) {
              if (
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] == undefined
              ) {
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] = 0;
              }
              this.missionsCreatedInADay[
                this.timestampToTime(change.doc.data().createdTimestamps)
              ] += 1;
            } else if (
              change.doc.data().createdTimestamps.seconds <
              Math.round(new Date().getTime() / 1000)
            ) {
              if (
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] == undefined
              ) {
                this.missionsCreatedInADay[
                  this.timestampToTime(change.doc.data().createdTimestamps)
                ] = 0;
              }
              this.missionsCreatedInADay[
                this.timestampToTime(change.doc.data().createdTimestamps)
              ] += 1;
            }
            //finished

            if (typeof change.doc.data().finishedTimestamps != "undefined") {
              if (
                Math.round(new Date().getTime() / 1000) - 604800 <
                change.doc.data().finishedTimestamps.seconds <
                Math.round(new Date().getTime() / 1000) - 518400
              ) {
                if (
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] == undefined
                ) {
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] = 0;
                }
                this.missionsFinishedInADay[
                  this.timestampToTime(change.doc.data().finishedTimestamps)
                ] += 1;
              } else if (
                change.doc.data().finishedTimestamps.seconds <
                Math.round(new Date().getTime() / 1000) - 432000
              ) {
                if (
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] == undefined
                ) {
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] = 0;
                }
                this.missionsFinishedInADay[
                  this.timestampToTime(change.doc.data().finishedTimestamps)
                ] += 1;
              } else if (
                change.doc.data().finishedTimestamps.seconds <
                Math.round(new Date().getTime() / 1000) - 345600
              ) {
                if (
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] == undefined
                ) {
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] = 0;
                }
                this.missionsFinishedInADay[
                  this.timestampToTime(change.doc.data().finishedTimestamps)
                ] += 1;
              } else if (
                change.doc.data().finishedTimestamps.seconds <
                Math.round(new Date().getTime() / 1000) - 259200
              ) {
                if (
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] == undefined
                ) {
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] = 0;
                }
                this.missionsFinishedInADay[
                  this.timestampToTime(change.doc.data().finishedTimestamps)
                ] += 1;
              } else if (
                change.doc.data().finishedTimestamps.seconds <
                Math.round(new Date().getTime() / 1000) - 172800
              ) {
                if (
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] == undefined
                ) {
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] = 0;
                }
                this.missionsFinishedInADay[
                  this.timestampToTime(change.doc.data().finishedTimestamps)
                ] += 1;
              } else if (
                change.doc.data().finishedTimestamps.seconds <
                Math.round(new Date().getTime() / 1000) - 86400
              ) {
                if (
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] == undefined
                ) {
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] = 0;
                }
                this.missionsFinishedInADay[
                  this.timestampToTime(change.doc.data().finishedTimestamps)
                ] += 1;
              } else if (
                change.doc.data().finishedTimestamps.seconds <
                Math.round(new Date().getTime() / 1000)
              ) {
                if (
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] == undefined
                ) {
                  this.missionsFinishedInADay[
                    this.timestampToTime(change.doc.data().finishedTimestamps)
                  ] = 0;
                }
                this.missionsFinishedInADay[
                  this.timestampToTime(change.doc.data().finishedTimestamps)
                ] += 1;
              }
            }
          }
        });
      });
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
    // this.getMissions();
  },
};
</script>
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
