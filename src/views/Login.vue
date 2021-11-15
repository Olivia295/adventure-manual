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
        @click="userLogin"
      >
        Login
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default {
  data() {
    return {
      agreement: false,
      dialog: false,
      form: false,
      isLoading: false,

      email: undefined,
      password: undefined,

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
    async userLogin() {
      try {
    await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        // console.log(val);
        this.$router.replace({ name: "Missions" });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
