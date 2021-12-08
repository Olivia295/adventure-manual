<template>
  <v-container v-if="loggedIn" style="max-width: 450px">
    <v-card class="py-2 px-1 mx-auto rounded-b-xl" color="indigo50">
      <v-text-field
        class="mx-1 black--text"
        v-model="title"
        hide-details="auto"
        label="输入你的任务吧~"
        :error-messages="titleErrors"
        required
        solo
        @input="$v.title.$touch()"
        @keydown.enter="submitNewMission()"
      >
        <template v-slot:append>
          <v-fade-transition>
            <v-icon v-if="title" @click="submitNewMission()">
              mdi-arrow-left
            </v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>
      <v-list class="mx-2">
        <v-list-group
          :value="false"
          no-action
          color="indigo"
          @click="clearDetailAndType"
        >
          <template v-slot:activator>
            <v-list-item-content class="rounded-full">
              <v-list-item-title class="indigo--text"
                >更多任务细节</v-list-item-title
              >
            </v-list-item-content>
          </template>
          <form class="ma-4">
            <v-textarea outlined v-model="detail" label="任务细节">
            </v-textarea>

            <v-select
              outlined
              v-model="selectPlot"
              :items="Object.values(plotIdRefTitle)"
              label="对应剧情"
              required
            >
            </v-select>

            <v-layout align-center justify-center>
              <v-btn
                large
                class="mr-4"
                color="indigo100"
                @click="submitNewMission"
              >
                提交
              </v-btn>
              <v-btn large color="indigo100" @click="clearAll">
                清除
              </v-btn>
            </v-layout>
          </form>
        </v-list-group>
      </v-list>
    </v-card>

    <div>
      <h2 class="text-h4 success--text my-4">
        任务:&nbsp;
        <v-fade-transition leave-absolute>
          <span :key="`missions-${missions.length}`">
            {{ missions.length }}
          </span>
        </v-fade-transition>
      </h2>

      <v-divider class="mt-4"></v-divider>

      <v-row class="my-1" align="center">
        <strong class="mx-4 info--text text--darken-2">
          剩余任务: {{ remainingMissions }}
        </strong>

        <v-divider vertical></v-divider>

        <strong class="mx-4 success--text text--darken-2">
          已完成任务: {{ completedMissions }}
        </strong>

        <v-spacer></v-spacer>

        <v-progress-circular
          :value="progress"
          class="mx-2"
        ></v-progress-circular>
      </v-row>

      <v-divider class="mb-4"></v-divider>

      <v-expansion-panels>
        <template v-for="(mission, index) in missions">
          <v-expansion-panel v-if="mission.finished == false" :key="index">
            <v-row>
              <v-col cols="2">
                <v-checkbox
                  class="mx-4"
                  v-model="mission.finished"
                  @click="changeMissionFinishedStatus(mission)"
                >
                </v-checkbox>
              </v-col>
              <v-col cols="8">
                <v-expansion-panel-header
                  ><div
                    :class="
                      (mission.finished && 'grey--text') || 'primary--text'
                    "
                    class="my-2"
                    v-text="mission.title"
                  ></div
                ></v-expansion-panel-header>
              </v-col>
              <v-col cols="2">
                <v-list-item-action>
                  <v-icon class="my-2" @click="deleteMission(mission)"
                    >mdi-close</v-icon
                  >
                </v-list-item-action>
              </v-col>
            </v-row>
            <v-expansion-panel-content>
              <v-list class="d-flex justify-center">
                <v-form>
                  <v-layout wrap align-center>
                    <v-flex>
                      <v-list-item-content class="ma-4">
                        <v-flex align-center justify-center column>
                          <v-layout row align-center justify-center>
                            <div class="ma-2 indigo--text font-weight-black">
                              任务创建时间：
                            </div>
                          </v-layout>
                          <v-flex row align-center>
                            <v-card-text
                              class="ma-2"
                              v-model="mission.createdTimestamps"
                            >
                              {{ timestampToTime(mission.createdTimestamps) }}
                            </v-card-text>
                          </v-flex>
                        </v-flex>
                      </v-list-item-content>
                      <v-list-item-content class="">
                        <div
                          class="ma-2 d-flex justify-center font-weight-black indigo--text"
                        >
                          任务名字：
                        </div>

                        <v-text-field
                          outlined
                          v-model="editingTitle"
                          :label="`${mission.title}`"
                          :disabled="!EDITING"
                        ></v-text-field>
                      </v-list-item-content>
                      <v-list-item-content class="indigo--text">
                        <div
                          class="ma-2 d-flex justify-center font-weight-black indigo--text"
                        >
                          任务细节：
                        </div>
                        <v-textarea
                          outlined
                          v-model="editingDetail"
                          :label="`${mission.detail}`"
                          :disabled="!EDITING"
                        ></v-textarea>
                      </v-list-item-content>

                      <v-list-item-content class="indigo--text">
                        <div
                          class="ma-2 d-flex justify-center font-weight-black indigo--text"
                        >
                          对应故事：
                        </div>

                        <v-select
                          outlined
                          v-model="editingPlotTitle"
                          :items="plotsTitle"
                          :label="plotIdRefTitle[mission.plot.id]"
                          :disabled="!EDITING"
                        ></v-select>
                      </v-list-item-content>
                      <v-list-content> </v-list-content>
                    </v-flex>
                  </v-layout>

                  <div v-if="EDITING">
                    <v-btn block @click="saveMission(mission)">保存</v-btn>
                    <v-snackbar v-model="snackbarForEdit">
                      编辑模式已启动！
                      <template v-slot:action="{ attrs }">
                        <v-btn
                          color="pink"
                          text
                          v-bind="attrs"
                          @click="snackbarForEdit = false"
                        >
                          关闭
                        </v-btn>
                      </template>
                    </v-snackbar>
                  </div>
                  <div v-else>
                    <v-btn block @click="editMission(mission)">编辑</v-btn>

                    <v-snackbar v-model="snackbarForSave">
                      任务已保存！
                      <template v-slot:action="{ attrs }">
                        <v-btn
                          color="green"
                          text
                          v-bind="attrs"
                          @click="snackbarForSave = false"
                        >
                          关闭
                        </v-btn>
                      </template>
                    </v-snackbar>
                  </div>
                </v-form>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>
      </v-expansion-panels>

      <v-divider class="my-4"></v-divider>

      <v-expansion-panels>
        <template v-for="(mission, index) in missions">
          <v-expansion-panel v-if="mission.finished == true" :key="index">
            <v-row>
              <v-col cols="2">
                <v-checkbox
                  class="mx-4"
                  v-model="mission.finished"
                  @click="changeMissionFinishedStatus(mission)"
                >
                </v-checkbox>
              </v-col>
              <v-col cols="8">
                <v-expansion-panel-header
                  ><div
                    :class="
                      (mission.finished && 'grey--text') || 'primary--text'
                    "
                    class="my-2"
                    v-text="mission.title"
                  ></div
                ></v-expansion-panel-header>
              </v-col>
              <v-col cols="2">
                <v-list-item-action>
                  <v-icon class="my-2" @click="deleteMission(mission)"
                    >mdi-close</v-icon
                  >
                </v-list-item-action>
              </v-col>
            </v-row>
            <v-expansion-panel-content>
              <v-list class="d-flex justify-center">
                <v-form>
                  <v-layout wrap align-center>
                    <v-flex>
                      <v-list-item-content class="ma-4">
                        <v-flex align-center justify-center column>
                          <v-layout row align-center justify-center>
                            <div class="ma-2 indigo--text font-weight-black">
                              任务创建时间：
                            </div>
                          </v-layout>
                          <v-flex row align-center>
                            <v-card-text
                              class="ma-2"
                              v-model="mission.createdTimestamps"
                            >
                              {{ timestampToTime(mission.createdTimestamps) }}
                            </v-card-text>
                          </v-flex>
                        </v-flex>
                      </v-list-item-content>
                      <v-list-item-content class="ma-4">
                        <v-flex align-center justify-center column>
                          <v-layout row align-center justify-center>
                            <div class="ma-2 indigo--text font-weight-black">
                              任务完成时间：
                            </div>
                          </v-layout>
                          <v-flex row align-center>
                            <v-card-text
                              class="ma-2"
                              v-model="mission.finishedTimestamps"
                            >
                              {{ timestampToTime(mission.finishedTimestamps) }}
                            </v-card-text>
                          </v-flex>
                        </v-flex>
                      </v-list-item-content>
                      <v-list-item-content class="">
                        <div
                          class="ma-2 d-flex justify-center font-weight-black indigo--text"
                        >
                          任务名字：
                        </div>

                        <v-text-field
                          outlined
                          v-model="editingTitle"
                          :label="`${mission.title}`"
                          :disabled="!EDITING"
                        ></v-text-field>
                      </v-list-item-content>
                      <v-list-item-content class="indigo--text">
                        <div
                          class="ma-2 d-flex justify-center font-weight-black indigo--text"
                        >
                          任务细节：
                        </div>
                        <v-textarea
                          outlined
                          v-model="editingDetail"
                          :label="`${mission.detail}`"
                          :disabled="!EDITING"
                        ></v-textarea>
                      </v-list-item-content>

                      <v-list-item-content class="indigo--text">
                        <div
                          class="ma-2 d-flex justify-center font-weight-black indigo--text"
                        >
                          对应故事：
                        </div>

                        <v-select
                          outlined
                          v-model="editingPlotTitle"
                          :items="plotsTitle"
                          :label="plotIdRefTitle[mission.plot.id]"
                          :disabled="!EDITING"
                        ></v-select>
                      </v-list-item-content>
                      <v-list-content> </v-list-content>
                    </v-flex>
                  </v-layout>

                  <div v-if="EDITING">
                    <v-btn block @click="saveMission(mission)">保存</v-btn>
                    <v-snackbar v-model="snackbarForEdit">
                      编辑模式已启动！
                      <template v-slot:action="{ attrs }">
                        <v-btn
                          color="pink"
                          text
                          v-bind="attrs"
                          @click="snackbarForEdit = false"
                        >
                          关闭
                        </v-btn>
                      </template>
                    </v-snackbar>
                  </div>
                  <div v-else>
                    <v-btn block @click="editMission(mission)">编辑</v-btn>

                    <v-snackbar v-model="snackbarForSave">
                      任务已保存！
                      <template v-slot:action="{ attrs }">
                        <v-btn
                          color="green"
                          text
                          v-bind="attrs"
                          @click="snackbarForSave = false"
                        >
                          关闭
                        </v-btn>
                      </template>
                    </v-snackbar>
                  </div>
                </v-form>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/auth";
import db from "@/fb";

import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    title: { required, maxLength: maxLength(10) },
  },

  data() {
    return {
      plotIdRefTitle: {},

      //登录信息
      currentUserInfo: undefined,
      currentUserRef: undefined,
      currentUserAuth: undefined,
      loggedIn: undefined,

      //开关控制
      snackbarForSave: false,
      snackbarForEdit: false,
      dialog: false,
      menu: false,

      //渲染变量
      missions: [],

      //提交变量
      title: "",
      detail: "",

      selectPlot: "(未指定)",
      plotsTitle: [],

      createdDate: new Date(),

      //编辑变量
      EDITING: false,
      editingTitle: "",
      editingDetail: "",
      editingPlotTitle: "",
    };
  },

  computed: {
    //计算已完成的任务
    completedMissions() {
      return this.missions.filter((mission) => mission.finished).length;
    },
    //计算未完成的任务
    remainingMissions() {
      return this.missions.length - this.completedMissions;
    },
    //计算已完成任务在所有任务中的比例
    progress() {
      return (this.completedMissions / this.missions.length) * 100;
    },

    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push("请填写任务名字！");
      return errors;
    },
  },

  mounted() {
    this.getMissions();
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
    //   return y + "年 " + MM + "月" + d + "日 ";
      return y + "年 " + MM + "月" + d + "日 " + h + "时" + m + "分" + s + "秒";
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
    //渲染剧情列表
    getPlots() {
      let plots = [];
      let plotsTitle = [];
      db.collection("plots").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
            this.currentPlotRef = change.doc.id;
            this.plotIdRefTitle[change.doc.id] = change.doc.data().title;
            plots.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });

        for (var i = 0; i < plots.length; i++) {
          plotsTitle.push(plots[i].title);
        }
        this.plotsTitle = plotsTitle;
      });
    },

    //提交任务
    submitNewMission() {
      this.$v.$touch();
      if (this.title != "") {
        this.updateTimestamps();
        //当detail为空时，显示“(空)”
        if (this.detail == "") {
          this.detail = "(空)";
        }
        //当selectType为空时，显示“(未选定)”
        if (this.selectType == null) {
          this.selectType = "(未选定)";
        }

        var plotId = Object.keys(this.plotIdRefTitle).sort(); // 字典元素按key值排序
        var targetPlotId = undefined;
        for (var key in plotId) {
          if (this.plotIdRefTitle[plotId[key]] == this.selectPlot) {
            targetPlotId = plotId[key];
          }
        }

        db.collection("missions").add({
          title: this.title,
          detail: this.detail,
          createdTimestamps: this.updateTimestamps(),
          user: db.doc("users/" + this.currentUserRef),
          plot: db.doc("plots/" + targetPlotId),
          finished: false,
        });
        this.clearAll();
      }
    },

    //清除Submit任务框的内容
    //清空所有
    clearAll() {
      this.$v.$reset();
      this.title = "";
      this.detail = "";
      this.selectType = null;
    },
    //清空detail和missionType
    clearDetailAndType() {
      this.$v.$reset();
      this.detail = "";
      this.selectType = null;
    },

    //更改任务完成属性
    changeMissionFinishedStatus(mission) {
      if (mission.finished == false) {
        db.collection("missions")
          .doc(mission.id)
          .update({
            finished: mission.finished,
            finishedTimestamps: null,
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        db.collection("missions")
          .doc(mission.id)
          .update({
            finished: mission.finished,
            finishedTimestamps: this.updateTimestamps(),
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    //编辑任务信息
    editMission(mission) {
      this.editingTitle = mission.title;
      this.editingDetail = mission.detail;
      this.editingPlotTitle = this.plotIdRefTitle[mission.plot.id];
      this.editingPlotTitle = mission.plot;
      this.EDITING = !this.EDITING;
      this.snackbarForEdit = true;
    },

    //保存任务信息
    saveMission(mission) {
      var plotId = Object.keys(this.plotIdRefTitle).sort(); // 字典元素按key值排序
      var editingPlotId = undefined;
      for (var key in plotId) {
        if (this.plotIdRefTitle[plotId[key]] == this.editingPlotTitle) {
          editingPlotId = plotId[key];
        }
      }
      db.collection("missions")
        .doc(mission.id)
        .update({
          title: this.editingTitle,
          detail: this.editingDetail,
          plot: db.doc("plots/" + editingPlotId),
        })
        .catch((error) => {
          console.error(error);
        });
      this.getMissions();
      this.editingTitle = undefined;
      this.editingDetail = undefined;
      this.editingPlotTitle = undefined;

      this.EDITING = !this.EDITING;
      this.snackbarForSave = true;
    },

    //删除任务
    deleteMission(mission) {
      db.collection("missions")
        .doc(mission.id)
        .delete()
        .catch((error) => {
          console.error(error);
        });
      //重新渲染一次任务
      this.getMissions();
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
    this.getPlots();
  },
};
</script>
