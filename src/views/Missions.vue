<template>
  <v-container style="max-width: 500px">
    <v-text-field
      v-model="newMissionTitle"
      label="输入你的任务吧~"
      solo
      :rules="inputRules"
      @keydown.enter="submitNewMission"
    >
      <template v-slot:append>
        <v-fade-transition>
          <v-icon v-if="newMissionTitle" @click="submitNewMission">
            mdi-arrow-left
          </v-icon>
        </v-fade-transition>
      </template>
    </v-text-field>

    <h2 class="text-h4 success--text pl-4">
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

      <v-progress-circular :value="progress" class="mr-2"></v-progress-circular>
    </v-row>

    <v-divider class="mb-4"></v-divider>

    <v-card v-if="missions.length > 0">
      <v-slide-y-transition class="py-0" group tag="v-list">
        <template v-for="(mission, i) in missions">
          <v-divider v-if="i !== 0" :key="mission.id"></v-divider>

          <v-list-item :key="mission.id">
            <v-list-item-action>
              <v-checkbox
                v-model="mission.finished"
                :color="(mission.finished && 'indigo') || 'primatitlery'"
                @click="changeMissionFinishedStatus(mission)"
              >
                <template v-slot:label>
                  <div
                    :class="
                      (mission.finished && 'grey--text') || 'primary--text'
                    "
                    class="ml-4"
                  >
                    {{ mission.title }}
                  </div>
                </template>
              </v-checkbox>
            </v-list-item-action>

            <v-spacer></v-spacer>

            <v-scroll-x-transition>
              <!-- <v-icon v-if="mission.done" color="success">
                mdi-check
              </v-icon> -->
            </v-scroll-x-transition>
            <v-icon class="mx-1" @click="deleteMission(mission.id)"
              >mdi-close</v-icon
            >
          </v-list-item>
        </template>
      </v-slide-y-transition>
    </v-card>
  </v-container>
</template>

<script>
import db from "@/fb";

export default {
  data() {
    return {
      missions: [],
      title: "",
      finished: false,
      newMissionTitle: null,
      intervalId: null,
      inputRules: [
        (v) => (v && v.length >= 3) || "至少输入3个字符！",
      ],
    };
  },

  computed: {
    completedMissions() {
      return this.missions.filter((mission) => mission.finished).length;
    },
    progress() {
      return (this.completedMissions / this.missions.length) * 100;
    },
    remainingMissions() {
      return this.missions.length - this.completedMissions;
    },
  },

  methods: {
    async getMissions() {
      let snapshot = await db.collection("missions").get();
      let missions = [];
      snapshot.forEach((doc) => {
        let appData = doc.data();
        appData.id = doc.id;
        missions.push(appData);
      });
      this.missions = missions;
    },
    //提交任务
    async submitNewMission() {
        await db
          .collection("missions")
          .add({
            title: this.newMissionTitle,
            finished: false,
          })
          .then(() => {});
        this.newMissionTitle = null;
    //   if (this.$ref.form.validate()) {
    //       this.$refs.form.reset();
    //   }
    },
    //更改任务完成属性
    async changeMissionFinishedStatus(mission) {
      await db
        .collection("missions")
        .doc(mission.id)
        .update({ finished: !mission.id.finished })
        .catch((error) => {
          console.error(error);
        });
      this.getMissions();

      //改变字体Style
    },
    //删除任务
    async deleteMission(id) {
      await db
        .collection("missions")
        .doc(id)
        .delete()
        .catch((error) => {
          console.error(error);
        });
      this.getMissions();
    },
  },

  //   created() {
  //     db.collection("missions")
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {
  //           const data = {
  //             id: doc.id,
  //             title: doc.data().title,
  //             done: doc.data().done,
  //           };
  //           this.missions.push(data);
  //         });
  //       });
  //   },
  created() {
    db.collection("missions").onSnapshot((res) => {
      const changes = res.docChanges();

      changes.forEach((change) => {
        if (change.type === "added") {
          this.missions.push({
            ...change.doc.data(),
            id: change.doc.id,
          });
        } else if (change.type === "removed") {
          console.log("it was removed!");
        }
      });
    });
  },
};
</script>
