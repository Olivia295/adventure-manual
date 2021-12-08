<template>
  <v-container v-if="loggedIn" style="max-width:450px">
    <v-container>
      <v-row justify="center">
        <v-dialog v-model="dialogForAddingNewPlot" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="indigo" class="my-4" dark v-bind="attrs" v-on="on">
              创建新剧情
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <div class="text-h5">创建新剧情</div>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      prepend-icon="mdi-form-select"
                      v-model="newPlotTitle"
                      label="剧情名称"
                      filled
                      @blur="$v.newPlotTitle.$touch()"
                      @input="$v.newPlotTitle.$touch()"
                      :error-messages="newPlotTitleErrors"
                      color="deep-purple"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      prepend-icon="mdi-content-paste"
                      v-model="newPlotContent"
                      label="剧情内容"
                      filled
                      @blur="$v.newPlotContent.$touch()"
                      @input="$v.newPlotContent.$touch()"
                      :error-messages="newPlotContentErrors"
                      color="deep-purple"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      prepend-icon="mdi-script"
                      v-model="newPlotType"
                      :items="plotType"
                      label="选择剧情类型"
                      filled
                      @blur="$v.newPlotType.$touch()"
                      @input="$v.newPlotType.$touch()"
                      :error-messages="newPlotTypeErrors"
                      color="deep-purple"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      prepend-icon="mdi-medal"
                      v-model="newPlotReward"
                      label="剧情完成后的奖励"
                      filled
                      @blur="$v.newPlotReward.$touch()"
                      @input="$v.newPlotReward.$touch()"
                      :error-messages="newPlotRewardErrors"
                      color="deep-purple"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <span color="black mx-4">选择剧情颜色</span>
              <v-container>
                <v-row>
                  <v-col class="d-flex justify-center">
                    <v-color-picker v-model="color"></v-color-picker>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeDialogForAddingNewPlot()"
              >
                关闭
              </v-btn>
              <v-btn color="blue darken-1" text @click="submitNewPlot()">
                保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-alert
          v-if="plots.length == 0"
          color="indigo400"
          dark
          border="top"
          icon="mdi-arrow-up-box"
        >
          点击“创建新剧情”来创建一个新剧情吧！
        </v-alert>
      </v-row>
    </v-container>

    <div v-if="plots.length > 0" class="my-4">
      <template v-for="(plot, index) in plots">
        <v-card
          :key="plot.id"
          class="mx-auto"
          color="grey lighten-4"
          max-width="600px"
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

              <v-card :key="plot.id">
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
                          prepend-icon="mdi-form-select"
                          v-model="newMissionTitle"
                          @blur="$v.newMissionTitle.$touch()"
                          @input="$v.newMissionTitle.$touch()"
                          :error-messages="newMissionTitleErrors"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          class="mx-2"
                          label="任务细节（可填）"
                          prepend-icon="mdi-details"
                          v-model="newMissionDetail"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeDialogForAddingNewMissionInPlot(plot)"
                  >
                    关闭
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="submitNewMissionInPlot(plot)"
                  >
                    保存
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
              <v-divider class="my-4"></v-divider>
              <v-row justify="center">
                <v-col md="12">
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
                </v-col>
                <v-col>
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

            <div :key="plot.id">
              <v-data-table
                :headers="headers"
                :items="plot.missions"
                class="elevation-1"
              >
                <template v-slot:[`item.finished`]="{ item }">
                  <v-simple-checkbox
                    v-model="item.finished"
                    @click="changeMissionFinishedStatus(item)"
                    disabled
                  ></v-simple-checkbox>
                </template>
              </v-data-table>
            </div>

            <v-container>
              <v-divider class="my-4"></v-divider>
              <v-row justify="center">
                <v-col md="12">
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
                </v-col>

                <v-col>
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

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-bottom-sheet v-model="sheetForDetelePlot[plot.id]">
              <template v-slot:activator="{ on, attrs }">
                <v-btn block :color="plot.color" v-bind="attrs" v-on="on"
                  >删除该剧情</v-btn
                >
              </template>
              <v-sheet class="text-center" height="200px">
                <v-btn
                  class="mt-6"
                  text
                  color="red"
                  plain
                  @click="deletePlotAndItsMission(plot)"
                >
                  删除
                </v-btn>
                <v-btn
                  class="mt-6"
                  text
                  color="green"
                  plain
                  @click="closeSheetForDeletePlot(plot)"
                >
                  返回
                </v-btn>
                <div class="py-3">
                  你确定要删除剧情{{ plot.title }}吗？
                  <div class="text-caption">
                    这将会删除所有属于该剧情的任务。
                  </div>
                </div>
              </v-sheet>
            </v-bottom-sheet>
          </v-card-actions>
        </v-card>

        <v-divider :key="index" class="my-2"></v-divider>
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
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";

import firebase from "firebase/compat/app";
import "firebase/auth";
import db from "@/fb";

export default {
  mixins: [validationMixin],

  validations: {
    newPlotTitle: { required, minLength: minLength(3) },
    newPlotContent: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(140),
    },
    newPlotType: { required },
    newPlotReward: { required },
    newMissionTitle: { required, minLength: minLength(3) },
  },

  data() {
    return {
      type: "hexa",
      hexa: "#0000000",

      sheetForDetelePlot: {},
      dialogForAddingNewMission: {},
      dialogForAddingNewPlot: false,
      //保存剧情信息
      plots: [],

      headers: [
        { text: "任务名字", value: "title", align: "start", sortable: false },
        { text: "任务细节", value: "detail", align: "center" },
        { text: "完成情况", value: "finished", align: "end" },
      ],
      //登录信息
      currentUserInfo: undefined,
      currentUserRef: undefined,
      currentUserAuth: undefined,
      loggedIn: undefined,

      //添加新任务的变量
      currentPlotRef: undefined,
      newMissionTitle: undefined,
      newMissionDetail: undefined,

      //添加新剧情的变量
      newPlotTitle: undefined,
      newPlotContent: undefined,
      newPlotReward: undefined,
      newPlotType: null,
      plotType: ["主线任务", "支线任务", "随机任务", "忠诚任务", "隐藏任务"],
    };
  },
  computed: {
    newPlotTitleErrors() {
      const errors = [];
      if (!this.$v.newPlotTitle.$dirty) return errors;
      !this.$v.newPlotTitle.required && errors.push("请填写剧情标题！");
      !this.$v.newPlotTitle.minLength &&
        errors.push("剧情标题至少填写3个字符！");
      return errors;
    },
    newPlotContentErrors() {
      const errors = [];
      if (!this.$v.newPlotContent.$dirty) return errors;
      !this.$v.newPlotContent.required && errors.push("请填写剧情内容！");
      !this.$v.newPlotContent.minLength &&
        errors.push("任务内容至少填写6个字符！");
      !this.$v.newPlotContent.maxLength &&
        errors.push("任务内容最多填写140个字符");
      return errors;
    },
    newPlotTypeErrors() {
      const errors = [];
      if (!this.$v.newPlotType.$dirty) return errors;
      !this.$v.newPlotType.required && errors.push("请选择剧情类型");
      return errors;
    },
    newPlotRewardErrors() {
      const errors = [];
      if (!this.$v.newPlotReward.$dirty) return errors;
      !this.$v.newPlotReward.required &&
        errors.push("请填写完成剧情后的奖励！");
      return errors;
    },
    newMissionTitleErrors() {
      const errors = [];
      if (!this.$v.newMissionTitle.$dirty) return errors;
      !this.$v.newMissionTitle.required && errors.push("请填写任务标题！");
      !this.$v.newMissionTitle.minLength &&
        errors.push("任务标题至少填写3个字符！");
      return errors;
    },

    // 获取/设定颜色
    color: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
      },
    },
    showColor() {
      if (typeof this.color === "string") return this.color;

      return JSON.stringify(
        Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2));
          return color;
        }, {}),
        null,
        2
      );
    },
  },
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
          //   console.log("signed in");
          this.currentUserAuth = user;
          this.getUsers(user);
          this.loggedIn = true;
        } else {
          // No user is signed in.
          this.loggedIn = false;
          //   console.log("signed out", this.loggedIn);
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
    //渲染剧情列表
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
    //渲染任务列表
    getMissions(currentPlotRef) {
      let missions = [];
      db.collection("missions").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().plot.id == currentPlotRef
          ) {
            missions.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
      });
      return missions;
    },
    //新任务dialog
    //改变 添加该剧情的任务dialog 的状态
    closeDialogForAddingNewMissionInPlot(plot) {
      this.$v.$reset();
      this.dialogForAddingNewMission[plot.id] = false;
      this.newMissionTitle = undefined;
      this.newMissionDetail = undefined;
    },
    //提交该剧情的新任务
    submitNewMissionInPlot(plot) {
      db.collection("missions").add({
        title: this.newMissionTitle,
        detail: this.newMissionDetail,
        createdTimestamps: this.updateTimestamps(),
        user: db.doc("users/" + this.currentUserRef),
        plot: db.doc("plots/" + plot.id),
        finished: false,
      });
      this.closeDialogForAddingNewMissionInPlot(plot);
    },
    //新剧情dialog
    //改变 添加新剧情的dialog 的状态
    closeDialogForAddingNewPlot() {
      this.$v.$reset();
      this.dialogForAddingNewPlot = false;
      this.newPlotTitle = undefined;
      this.newPlotContent = undefined;
      this.newPlotType = null;
      this.newPlotReward = undefined;
    },
    //提交新剧情
    submitNewPlot() {
      this.$v.$touch();
      db.collection("plots").add({
        title: this.newPlotTitle,
        content: this.newPlotContent,
        reward: this.newPlotReward,
        plotType: this.newPlotType,
        createdTimestamps: this.updateTimestamps(),
        user: db.doc("users/" + this.currentUserRef),
        color: this.showColor,
      });
      this.closeDialogForAddingNewPlot();
    },
    //删除剧情sheet
    //改变 删除剧情sheet 的状态
    closeSheetForDeletePlot(plot) {
      this.sheetForDetelePlot[plot.id] = false;
    },
    //删除指定剧情及其所有任务
    deletePlotAndItsMission(plot) {
      for (var i = 0; i < plot.missions.length; i++) {
        console.log(plot.missions[i].id);
        db.collection("missions")
          .doc(plot.missions[i].id)
          .delete()
          .catch((error) => {
            console.error(error);
          });
      }
      db.collection("plots")
        .doc(plot.id)
        .delete()
        .catch((error) => {
          console.error(error);
        });
      this.getPlots();
      this.closeSheetForDeletePlot(plot);
    },
    //改变任务完成情况
    changeMissionFinishedStatus(mission) {
      db.collection("missions")
        .doc(mission.id)
        .update({ finished: !mission.finished })
        .catch((error) => {
          console.error(error);
        });
      this.getPlots();
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
