<template>
  <v-container v-if="loggedIn" style="max-width: 500px">
    <v-card class="py-2 px-1 mx-auto rounded-b-xl" color="indigo50">
      <v-text-field
        class="mx-1 black--text"
        v-model="title"
        hide-details="auto"
        label="输入你的任务吧~"
        :error-messages="titleErrors"
        required
        @input="$v.title.$touch()"
        @blur="$v.title.$touch()"
        solo
        @keydown.enter="submitNewMission"
      >
        <template v-slot:append>
          <v-fade-transition>
            <v-icon v-if="title" @click="submitNewMission">
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
            <v-text-field
              outlined
              v-model="detail"
              label="任务细节"
              @input="$v.detail.$touch()"
              @blur="$v.detail.$touch()"
            ></v-text-field>

            <v-select
              outlined
              v-model="selectType"
              :items="type"
              :error-messages="selectErrors"
              label="任务类型"
              required
              @change="$v.select.$touch()"
              @blur="$v.select.$touch()"
            ></v-select>

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
          class="mr-2"
        ></v-progress-circular>
      </v-row>

      <v-card v-if="missions.length > 0">
        <v-slide-y-transition class="py-0" group tag="v-list">
          <template v-for="(mission, i) in missions">
            <v-divider v-if="mission.finished == false" :key="i"></v-divider>
            <v-list v-if="mission.finished == false" :key="mission.id">
              <v-list-item :key="mission.id" v-if="mission.finished == false">
                <v-list-item-action>
                  <v-checkbox
                    v-model="mission.finished"
                    @click="changeMissionFinishedStatus(mission)"
                  >
                  </v-checkbox>
                </v-list-item-action>

                <v-list-group :value="false" no-action>
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>{{ mission.title }}</v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list class="d-flex justify-center">
                    <v-form>
                      <v-layout wrap align-center>
                        <v-flex>
                          <v-list-item-content class="ma-4">
                            <v-flex align-center justify-center column>
                              <v-layout row align-center justify-center>
                                <div
                                  class="ma-2 indigo--text font-weight-black"
                                >
                                  任务创建时间：
                                </div>
                              </v-layout>
                              <v-flex row align-center>
                                <v-card-text
                                  class="ma-2"
                                  v-model="mission.createdTimestamps"
                                >
                                  {{
                                    timestampToTime(mission.createdTimestamps)
                                  }}
                                </v-card-text>
                              </v-flex>
                            </v-flex>
                          </v-list-item-content>
                          <v-list-item-content class="">
                            <v-text
                              class="ma-2 d-flex justify-center font-weight-black indigo--text"
                            >
                              任务名字：
                            </v-text>

                            <v-text-field
                              outlined
                              v-model="editingTitle"
                              :label="`${mission.title}`"
                              :disabled="!EDITING"
                            ></v-text-field>
                          </v-list-item-content>
                          <v-list-item-content class="indigo--text">
                            <v-text
                              class="ma-2 d-flex justify-center font-weight-black indigo--text"
                            >
                              任务细节：
                            </v-text>
                            <v-text-field
                              outlined
                              v-model="editingDetail"
                              :label="`${mission.detail}`"
                              :disabled="!EDITING"
                            ></v-text-field>
                          </v-list-item-content>

                          <v-list-item-content class="indigo--text">
                            <div
                              class="ma-2 d-flex justify-center font-weight-black indigo--text"
                            >
                              任务类型：
                            </div>

                            <v-select
                              outlined
                              v-model="editingMissionType"
                              :items="type"
                              :label="`${mission.missionType}`"
                              :disabled="!EDITING"
                            ></v-select>
                          </v-list-item-content>
                          <v-list-content>
                            <div>
                              {{ mission.user.id }}
                            </div>
                            <v-text>
                              {{ currentUserAuth.uid }}
                            </v-text>
                          </v-list-content>
                          <!-- {{this.currentUserAuth}} -->
                        </v-flex>
                      </v-layout>

                      <div v-if="EDITING">
                        <v-btn block @click="saveMission(mission)">Save</v-btn>
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
                        <v-btn block @click="editMission(mission)">Edit</v-btn>

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
                </v-list-group>

                <v-scroll-x-transition> </v-scroll-x-transition>
                <v-list-item-action>
                  <v-icon @click="deleteMission(mission)">mdi-close</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </template>
        </v-slide-y-transition>
      </v-card>

      <v-divider class="mb-4"></v-divider>

      <v-card v-if="missions.length > 0">
        <v-slide-y-transition class="py-0" group tag="v-list">
          <template v-for="(mission, i) in missions">
            <v-divider v-if="mission.finished == false" :key="i"></v-divider>
            <v-list-item :key="mission.id" v-if="mission.finished == false">
              <v-list-item-action>
                <v-checkbox
                  v-model="mission.finished"
                  @click="changeMissionFinishedStatus(mission)"
                >
                  <template v-slot:label>
                    <div :class="'primary--text'" class="ml-4">
                      {{ mission.title }}
                    </div>
                  </template>
                </v-checkbox>
              </v-list-item-action>

              <v-spacer></v-spacer>

              <v-scroll-x-transition> </v-scroll-x-transition>
              <v-icon class="mx-1" @click="deleteMission(mission)"
                >mdi-close</v-icon
              >
            </v-list-item>
          </template>
        </v-slide-y-transition>
      </v-card>

      <v-divider class="my-8"></v-divider>

      <v-card v-if="missions.length > 0">
        <v-slide-y-transition class="py-0" group tag="v-list">
          <template v-for="(mission, i) in missions">
            <v-divider v-if="mission.finished == true" :key="i"></v-divider>
            <v-list-item :key="mission.id" v-if="mission.finished == true">
              <v-list-item-action>
                <v-checkbox
                  v-model="mission.finished"
                  :color="mission.finished && 'indigo'"
                  @click="changeMissionFinishedStatus(mission)"
                >
                  <template v-slot:label>
                    <div
                      :class="
                        mission.finished &&
                          'grey--text' &&
                          'text-decoration-line-through'
                      "
                      class="ml-4"
                    >
                      {{ mission.user }}
                    </div>
                  </template>
                </v-checkbox>
              </v-list-item-action>

              <v-spacer></v-spacer>

              <v-scroll-x-transition> </v-scroll-x-transition>
              <v-icon class="mx-1" @click="deleteMission(mission)"
                >mdi-close</v-icon
              >
            </v-list-item>
          </template>
        </v-slide-y-transition>
        <!-- <div>{{ firebase.auth().currentUserInfo.uid }}</div> -->
        <div>{{ currentUserInfo }}</div>
        <div>{{ currentUserAuth.uid }}</div>
        <div>{{ currentUserRef }}</div>
      </v-card>
    </div>
  </v-container>
  <v-container v-else style="max-width: 500px">
    <v-alert text color="indigo400">
      <v-text class="text-h5 indigo--text">
        你还没登录！
      </v-text>
      <v-spacer></v-spacer>
      <v-text>AdventureManual是一款让你养成良好记录任务习惯的应用。</v-text>

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

import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    title: { required, maxLength: maxLength(10) },
    detail: {},
    selectType: { required },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },

  data() {
    return {
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

      intervalId: null,

      //提交变量
      title: "",
      detail: "",

      selectType: "(未选定)",
      type: [
        "(未选定)",
        "主线任务",
        "支线任务",
        "随机任务",
        "忠诚任务",
        "隐藏任务",
      ],

      createdDate: new Date(),

      //编辑变量
      EDITING: false,
      editingTitle: "",
      editingDetail: "",
      editingMissionType: "",
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
      !this.$v.title.maxLength &&
        errors.push("Title must be at most 10 characters long");
      !this.$v.title.required && errors.push("Title is required.");
      return errors;
    },
    selectErrors() {
      const errors = [];
      if (!this.$v.selectType.$dirty) return errors;
      !this.$v.selectType.required && errors.push("Type is required");
      return errors;
    },
  },
  watch: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged((user) => {
        this.loggedIn = !!user;
        if (user) {
          // User is signed in.
          console.log("signed in");
          this.currentUserAuth = user;
          console.log(this.currentUserAuth);
          this.getUsers(user);
          this.loggedIn = true;
        } else {
          // No user is signed in.
          this.loggedIn = false;
          console.log("signed out", this.loggedIn);
        }
      });
    },
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
      return y + "年 " + MM + "月" + d + "日 " + h + "时" + m + "分" + s + "秒";
    },

    //渲染任务列表
    async getMissions() {
      //   let snapshot = await db.collection("missions").get();
      //   let missions = [];
      //   snapshot.forEach((doc) => {
      //     let appData = doc.data();
      //     appData.id = doc.id;
      //     missions.push(appData);
      //   });
      //   this.missions = missions;
      //   let missions = [];
      //   db.collection("missions").onSnapshot((res) => {
      //     const changes = res.docChanges();
      //     //   let missions = [];
      //     changes.forEach((change) => {
      //       // console.log(change.doc.data().user.id);
      //       // console.log(this.currentUserRef);
      //       if (
      //         change.type === "added" &&
      //         change.doc.data().user.id == this.currentUserRef
      //       ) {
      //         // console.log(change.doc.data().user.id);
      //         // console.log(this.currentUserRef)

      //         // console.log(change.doc.data());

      //         let appData = change.doc.data();
      //         console.log(appData);
      //         appData.id = change.id;
      //         missions.push(appData);

      //         //   this.missions.push({
      //         //     ...change.doc.data(),
      //         //     id: change.doc.id,
      //         //   });
      //       }
      //     });
      //     this.missions = missions;
      //   });
      let missions = [];
      db.collection("missions").onSnapshot((res) => {
        const changes = res.docChanges();
        //   let missions = [];
        changes.forEach((change) => {
          // console.log(change.doc.data().user.id);
          // console.log(this.currentUserRef);
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
            // console.log(change.doc.data().user.id);
            // console.log(this.currentUserRef)

            // console.log(change.doc.data());

            missions.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
      });
      this.missions = missions;
      console.log(missions);
    },
    //提交任务
    submitNewMission() {
      //   console.log("ref is " + this.currentUserRef);
      this.updateTimestamps();
      //当detail为空时，显示“(空)”
      if (this.detail == "") {
        this.detail = "(空)";
      }
      //当selectType为空时，显示“(未选定)”
      if (this.selectType == null) {
        this.selectType = "(未选定)";
      }
      this.$v.$touch(
        db.collection("missions").add({
          title: this.title,
          detail: this.detail,
          missionType: this.selectType,
          createdTimestamps: this.updateTimestamps(),
          user: db.doc("users/" + this.currentUserRef),
          finished: false,
        })
      );
      this.clearAll();
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
      db.collection("missions")
        .doc(mission.id)
        .update({ finished: mission.finished })
        .catch((error) => {
          console.error(error);
        });
    },
    //编辑任务信息
    editMission(mission) {
      this.editingTitle = mission.title;
      this.editingDetail = mission.detail;
      this.editingMissionType = mission.missionType;

      this.EDITING = !this.EDITING;
      this.snackbarForEdit = true;
    },

    //保存任务信息
    saveMission(mission) {
      db.collection("missions")
        .doc(mission.id)
        .update({
          title: this.editingTitle,
          detail: this.editingDetail,
          missionType: this.editingMissionType,
        })
        .catch((error) => {
          console.error(error);
        });
      this.getMissions();
      this.editingTitle = "";
      this.editingDetail = "";
      this.editingMissionType = "";

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

    // this.getMissions();

    db.collection("missions").onSnapshot((res) => {
      const changes = res.docChanges();
      //   let missions = [];
      changes.forEach((change) => {
        // console.log(change.doc.data().user.id);
        // console.log(this.currentUserRef);
        if (
          change.type === "added" &&
          change.doc.data().user.id == this.currentUserRef
        ) {
          // console.log(change.doc.data().user.id);
          // console.log(this.currentUserRef)

          // console.log(change.doc.data());

          this.missions.push({
            ...change.doc.data(),
            id: change.doc.id,
          });
        }
      });
    });
  },
};
</script>
