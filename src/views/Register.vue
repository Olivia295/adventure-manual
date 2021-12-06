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
      ></v-text-field>
      <v-text-field
        v-model="password"
        filled
        @blur="$v.password.$touch()"
        :error-messages="passwordErrors"
        color="deep-purple"
        label="密码"
        type="password"
      ></v-text-field>
      <v-text-field
        v-model="repeatPassword"
        filled
        @blur="$v.repeatPassword.$touch()"
        :error-messages="repeatPasswordErrors"
        color="deep-purple"
        label="再次输入密码"
        type="password"
      ></v-text-field>
      <v-text-field
        v-model="username"
        filled
        @blur="$v.username.$touch()"
        :error-messages="usernameErrors"
        color="deep-purple"
        label="用户名"
        type="string"
      ></v-text-field>
      <v-text-field
        v-model="goal"
        filled
        @blur="$v.goal.$touch()"
        :error-messages="goalErrors"
        color="deep-purple"
        label="写下你的目标吧！"
        type="string"
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
        @click="userRegister()"
      >
        注册
      </v-btn>
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
  sameAs,
} from "vuelidate/lib/validators";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import db from "@/fb";

export default {
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs("password"),
    },
    username: { required, maxLength: maxLength(10) },
    goal: { required },
  },
  data() {
    return {
      agreement: false,
      dialog: false,
      form: false,
      isLoading: false,

      email: undefined,
      password: undefined,
      repeatPassword: undefined,
      username: undefined,
      goal: undefined,
    };
  },
  methods: {
    async userRegister() {
      this.$v.$touch();
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
        this.$router.replace({ name: "Home" });
      } catch (err) {
        console.log(err);
      }
    },
    clearForm() {
      this.$v.$reset();
      this.name = "";
      this.email = "";
      this.goal = "";
      this.password = "";
    },
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
    repeatPasswordErrors() {
      const errors = [];
      if (!this.$v.repeatPassword.$dirty) return errors;
      !this.$v.repeatPassword.sameAsPassword &&
        errors.push("两次密码填写不一致");
      !this.$v.repeatPassword.required && errors.push("请填写验证密码！");
      return errors;
    },
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.maxLength && errors.push("用户名至多有10个字符！");
      !this.$v.username.required && errors.push("请填写用户名！");
      return errors;
    },
    goalErrors() {
      const errors = [];
      if (!this.$v.goal.$dirty) return errors;
      !this.$v.goal.required && errors.push("请填写你的目标！");
      return errors;
    },
  },
};
</script>

<style></style>
