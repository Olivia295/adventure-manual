<template>
  <v-card class="mx-auto" style="max-width: 500px;">
    <v-form ref="form" v-model="form" class="pa-4 pt-6">
      <v-text-field
        v-model="email"
        filled
        @blur="$v.email.$touch()"
        :error-messages="emailErrors"
        color="deep-purple"
        label="邮箱地址"
        type="email"
        @keydown.enter="userLogin()"
      ></v-text-field>
      <v-text-field
        v-model="password"
        filled
        @blur="$v.password.$touch()"
        :error-messages="passwordErrors"
        color="deep-purple"
        label="密码"
        type="password"
        @keydown.enter="userLogin()"
      ></v-text-field>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn text @click="$refs.form.reset()">
        清空
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!form"
        :loading="isLoading"
        class="white--text"
        color="deep-purple accent-4"
        depressed
        @click="userLogin()"
      >
        登录
      </v-btn>
      <v-snackbar v-model="snackbarForSignupFailed">
        {{ errorText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbarForSignupFailed = false"
          >
            关闭
          </v-btn>
        </template>
      </v-snackbar>
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  minLength,
} from "vuelidate/lib/validators";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default {
  mixins: [validationMixin],

  validations: {
    username: { required, maxLength: maxLength(10) },
    email: { required, email },
    password: {
      required,
      minLength: minLength(6),
    }
  },
  data() {
    return {
      errorText: undefined,
      agreement: false,
      dialog: false,
      form: false,
      isLoading: false,

      snackbarForSignupFailed: false,

      email: undefined,
      password: undefined,
    };
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("邮箱格式有误！");
      !this.$v.email.required && errors.push("请填写邮箱！");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength && errors.push("密码最少需要6个字符");
      !this.$v.password.required && errors.push("请填写密码！");
      return errors;
    },
  },
  methods: {
    async userLogin() {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        this.$router.replace({ name: "Home" });
      } catch (err) {
        console.log(err);
        this.errorText = err;
        this.snackbarForSignupFailed = true;
      }
    },
  },
};
</script>

<style></style>
