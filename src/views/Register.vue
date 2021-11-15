<template>
  <v-card class="mx-auto" style="max-width: 500px;">
    <v-form ref="form" v-model="form" class="pa-4 pt-6">
      <!-- :rules="[rules.password, rules.length(12)]" -->
      <v-text-field
        v-model="email"
        :rules="[rules.email]"
        filled
        color="deep-purple"
        label="Email address"
        type="email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        filled
        color="deep-purple"
        counter="12"
        label="Password"
        style="min-height: 96px"
        type="password"
      ></v-text-field>
      <v-text-field
        v-model="username"
        filled
        color="deep-purple"
        label="Username"
        type="string"
      ></v-text-field>
      <v-text-field
        v-model="goal"
        filled
        color="deep-purple"
        label="Write down your goal!"
        type="string"
      ></v-text-field>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn text @click="$refs.form.reset()">
        Clear
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!form"
        :loading="isLoading"
        class="white--text"
        color="deep-purple accent-4"
        depressed
        @click="userRegister"
      >
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import db from "@/fb";

export default {
  data() {
    return {
      agreement: false,
      dialog: false,
      form: false,
      isLoading: false,

      uid: undefined,
      email: undefined,
      password: undefined,
      name: undefined,
      goal: undefined,

      rules: {
        email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
        length: (len) => (v) =>
          (v || "").length >= len ||
          `Invalid character length, required ${len}`,
        // password: v => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
        //   'Password must contain an upper case letter, a numeric character, and a special character',
        required: (v) => !!v || "This field is required",
      },
    };
  },
  methods: {
    async userRegister() {
      try {
        const user = firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
        console.log(user);
        db.collection("users").add({
          email: this.email,
          password: this.password,
          username: this.username,
          goal: this.goal,
        });
        this.$router.replace({ name: "Missions" });
      } catch (err) {
        console.log(err);
      }
    },
    recordUser() {},
  },
};
</script>

<style></style>
