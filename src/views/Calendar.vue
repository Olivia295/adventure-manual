<template>
  <v-container>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn color="indigo" class="mr-4" @click="dialog = true" dark>
              新任务
            </v-btn>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              今天
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              class="mr-4"
              @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>日</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>周</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>月</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4天</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>

        <!-- Add event dialog-->
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-container>
              <v-form @submit.prevent="addEvent">
                <v-text-field
                  v-model="name"
                  type="text"
                  label="任务名字 //必须填"
                ></v-text-field>
                <v-text-field
                  v-model="details"
                  type="text"
                  label="任务描述"
                ></v-text-field>
                <v-text-field
                  v-model="start"
                  type="date"
                  label="开始日期 //必须填"
                ></v-text-field>
                <v-text-field
                  v-model="end"
                  type="date"
                  label="截止日期 //必须填"
                ></v-text-field>
                <v-text-field
                  v-model="color"
                  type="color"
                  label="颜色 //点击可打开颜色选择器"
                ></v-text-field>
                <v-btn
                  type="submit"
                  color="indigo"
                  class="mr-4"
                  @click.stop="dialog = false"
                  >创建任务</v-btn
                >
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>

        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="indigo"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon @click="deleteEvent(selectedEvent.id)"
                    >mdi-delete</v-icon
                  >
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card-text>
                <form v-if="currentlyEditing !== selectedEvent.id">
                  {{ selectedEvent.details }}
                </form>
                <form v-else>
                  <textarea-autosize
                    v-model="selectedEvent.details"
                    type="text"
                    style="width:100%"
                    :min-height="100"
                    placeholder="add note"
                  >
                  </textarea-autosize>
                </form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="indigo" @click="selectedOpen = false">
                  关闭
                </v-btn>
                <v-btn
                  text
                  v-if="currentlyEditing !== selectedEvent.id"
                  @click.prevent="editEvent(selectedEvent)"
                >
                  编辑
                </v-btn>
                <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row></v-container
  >
</template>

<script>
import db from "@/fb";
import firebase from "firebase/compat/app";

export default {
  data() {
    return {
      currentUserRef: undefined,

      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: "month",
      typeToLabel: {
        month: "月",
        week: "周",
        day: "日",
        "4day": "四天",
      },
      name: null,
      details: null,
      start: null,
      end: null,
      color: "#1976D2",
      currentlyEditing: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      dialog: false,
    };
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
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.startYear;
      const endYear = end.end.endYear;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${suffixMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
  },
  mounted() {
    this.getEvents();
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

    async getEvents() {
      let events = [];
      db.collection("events").onSnapshot((res) => {
        const changes = res.docChanges();
        changes.forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().user.id == this.currentUserRef
          ) {
            events.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
      });
      this.events = events;
    },
    async addEvent() {
      if (this.name && this.start && this.end) {
        await db.collection("events").add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color,
          user: db.doc("users/" + this.currentUserRef),
        });
        this.getEvents();
        (this.name = ""),
          (this.details = ""),
          (this.start = ""),
          (this.end = ""),
          (this.color = "#1976D2");
      } else {
        alert("名字、开始日期、终止日期为必填");
      }
    },

    async updateEvent(ev) {
      await db
        .collection("events")
        .doc(this.currentlyEditing)
        .update({
          details: ev.details,
        });
      this.selectedOpen = false;
      this.currentlyEditing = null;
    },

    async deleteEvent(ev) {
      await db
        .collection("events")
        .doc(ev)
        .delete();

      this.selectedOpen = false;
      this.getEvents();
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>

<style></style>
