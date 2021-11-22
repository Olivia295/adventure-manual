<template>
  <v-container v-if="loggedIn" style="max-width:450px">
    <v-container>
      <v-row justify="center">
        <v-dialog v-model="dialogForAddingNewPlot" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="indigo" dark v-bind="attrs" v-on="on">
              创建新剧情
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">创建新剧情:</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newPlotTitle"
                      label="Title"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      label="Content"
                      v-model="newPlotContent"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="selectPlotType"
                      :items="plotType"
                      label="PlotType"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Reward"
                      v-model="newPlotReward"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closePlotDialog">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="submitNewPlot">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
    <div v-if="plots.length > 0" class="my-4">
      <template v-for="plot in plots">
        <v-card
          :key="plot.id"
          class="mx-auto"
          color="grey lighten-4"
          max-width="600"
        >
          <v-card-text class="pt-6" style="position: relative;">
            <v-dialog
              v-model="dialogForAddingNewMission[plot.id]"
              persistent
              max-width="600px"
              :retain-focus="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  absolute
                  :color="plot.color"
                  class="white--text"
                  fab
                  large
                  right
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-card-title>
                  <span class="text-h5"
                    >为 {{ plot.title }} 剧情添加新任务：</span
                  >
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          class="mx-2"
                          label="任务名字"
                          prepend-icon="mdi-comment"
                          v-model="newMissionTitle"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          class="mx-2"
                          label="任务细节"
                          prepend-icon="mdi-comment"
                          v-model="newMissionDetail"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container> </v-card-text
                ><v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeMissionDialog(plot.id)"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="submitNewMission(plot)"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <div class="font-weight-light grey--text text-h6 mb-2">
              {{ plot.plotType }}
            </div>
            <div class="text-h4 font-weight-light mb-2">
              {{ plot.title }}
            </div>
            <v-container>
              <v-divider class="my-2"></v-divider>
              <v-row justify="center">
                <v-col md="4">
                  <v-card
                    class="d-flex justify-center mb-4"
                    :color="
                      $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'
                    "
                    flat
                    tile
                  >
                    <div class="class-h5 font-bold">剧情内容：</div>
                  </v-card>
                  <v-card
                    class="d-flex justify-center mb-4"
                    :color="
                      $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'
                    "
                    flat
                    tile
                  >
                    <div class="text-h5 font-weight-light">
                      {{ plot.content }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <div>
              <v-data-table
                :headers="headers"
                :items="plot.missions"
                class="elevation-1"
              >
                <template v-slot:item.finished="{ item }">
                  <v-simple-checkbox
                    v-model="item.finished"
                    disabled
                  ></v-simple-checkbox>
                </template>
              </v-data-table>
            </div>

            <v-container>
              <v-divider class="my-4"></v-divider>
              <v-row justify="center">
                <v-col md="4">
                  <v-card
                    class="d-flex justify-center mb-4"
                    :color="
                      $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'
                    "
                    flat
                    tile
                  >
                    <div class="class-h5 font-bold">奖励：</div>
                  </v-card>
                  <v-card
                    class="d-flex justify-center mb-4"
                    :color="
                      $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'
                    "
                    flat
                    tile
                  >
                    <div class="text-h5 font-weight-light">
                      {{ plot.reward }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider class="mb-4"></v-divider>
        </v-card>
      </template>
    </div>
  </v-container>
  <v-container v-else style="max-width: 500px">
    <v-alert text color="indigo400">
      <div class="text-h5 indigo--text">
        你还没登录！
      </div>
      <v-spacer></v-spacer>
      <div>AdventureManual是一款让你养成良好记录任务习惯的应用。</div>

      <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>

      <v-row align="center" no-gutters>
        <v-col class="grow" cols="12" sm="8" md="10">
          未拥有账户？注册新账户来开启冒险之旅吧！
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="shrink">
          <v-btn cols="12" md="2" color="indigo" outlined to="/register">
            注册
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>

      <v-row align="center" no-gutters>
        <v-col class="grow" cols="12" sm="8" md="10">
          已拥有账户？请登录以开启你的冒险之旅吧！
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="shrink">
          <v-btn cols="12" md="2" color="indigo" outlined to="/login">
            登录
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/auth";
import db from "@/fb";

export default {
  data() {
    return {
      dialogForAddingNewMission: {},
      dialogForAddingNewPlot: false,
      headers: [
        { text: "Title", value: "title", align: "start", sortable: false },
        { text: "Detail", value: "detail", align: "center" },
        { text: "Finished", value: "finished", align: "end" },
      ],
      //登录信息
      currentUserInfo: undefined,
      currentUserRef: undefined,
      currentUserAuth: undefined,
      loggedIn: undefined,

      currentPlotRef: undefined,
      newMissionTitle: "",
      newMissionDetail: "",

      newPlotTitle: undefined,
      newPlotContent: undefined,
      newPlotReward: undefined,

      selectPlotType: "(未选定)",
      plotType: [
        "(未选定)",
        "主线任务",
        "支线任务",
        "随机任务",
        "忠诚任务",
        "隐藏任务",
      ],

      plots: [],
    };
  },
  computed: {},
  mounted() {
    this.setupFirebase();
  },
  methods: {
    //获取当前时间戳
    updateTimestamps() {
      return (this.createdDate = new Date());
    },
    //时间戳转换为时间
    timestampToTime(timestamps) {
      var date = new Date(timestamps * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let y = date.getFullYear() - 1969;
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "年 " + MM + "月" + d + "日 " + h + "时" + m + "分" + s + "秒";
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
    //渲染任务列表
    getPlots() {
      let plots = [];
      db.collection("plots").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
            this.currentPlotRef = change.doc.id;

            plots.push({
              ...change.doc.data(),
              missions: this.getMissions(change.doc.id),
              id: change.doc.id,
            });
          }
        });
      });
      this.plots = plots;
    },
    getMissions(_currentPlotRef) {
      let missions = [];
      db.collection("missions").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().plot.id == _currentPlotRef
          ) {
            // console.log("change " + change.doc.data().plot.id);
            // console.log("ref " + _currentPlotRef);
            missions.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
      });
      return missions;
    },
    closeMissionDialog(plotId) {
      this.dialogForAddingNewMission[plotId] = false;
    },
    submitNewMission(plot) {
      this.closeMissionDialog(plot.id);
      //   console.log(this.newMissionTitle + " ! " + this.newMissionDetail);
      //   console.log(plot.id);
      //   console.log(this.currentUserRef);
      db.collection("missions").add({
        title: this.newMissionTitle,
        detail: this.newMissionDetail,
        createdTimestamps: this.updateTimestamps(),
        user: db.doc("users/" + this.currentUserRef),
        plot: db.doc("plots/" + plot.id),
        finished: false,
      });
    },
    closePlotDialog() {
      this.dialogForAddingNewPlot = false;
    },
    submitNewPlot() {
      this.closePlotDialog();
      db.collection("plots").add({
        title: this.newPlotTitle,
        content: this.newPlotContent,
        reward: this.newPlotReward,
        plotType: this.selectPlotType,
        createdTimestamps: this.updateTimestamps(),
        user: db.doc("users/" + this.currentUserRef),
        color: "#ff00ff",
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

    this.getPlots();
  },
};
</script>

<style></style>
