<template>
  <MainContainer>
    <LeftSide>
      <div class="w-[453px] text-start mb-[30px]">
        <h2 class="header mb-[-8px]">Create your account</h2>
        <span class="text-[20px] text-fontSecondarySubtle w-[213px] ">Let's get started!</span>
      </div>
      <form class="form">
        <div class="mb-[10px]">
          <input
              class="form-input form-input--start-image form-input--wide bg-person"
              type="text"
              name="user"
              id="user"
              placeholder="Username"
              v-model="username"
          >
          <label for="user" class="hidden">Username</label>
        </div>
        <div class="mb-[10px]">
          <select class="form-input form-input--start-image form-input--wide bg-person" name="role" id="role" v-model="role">
            <option disabled selected>Select your role</option>
            <option value="frontend">Frontend developer</option>
            <option value="backend">Backend developer</option>
            <option value="fullstack">Fullstack developer</option>
            <option value="designer">Designer</option>
            <option value="qa">QA Engineer</option>
            <option value="admin">Admin</option>
          </select>
          <label for="role" class="hidden">Email</label>
        </div>
        <div class="relative mb-[10px]">
          <input
              class="form-input form-input--start-image form-input--wide bg-shield-slash"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              v-model="password"
              ref="passwordInput"
          >
          <label for="password" class="hidden">Password</label>
          <span
              class="eye-slash"
              @click="toggleVisibility(passwordInput as HTMLInputElement)"
          >
            <img src="../assets/eye-slash.svg" alt="Slashed eye">
          </span>
        </div>
        <div class="relative mb-[10px]">
          <input
              class="form-input form-input--start-image form-input--wide bg-shield-slash"
              type="password"
              name="passwordRepeat"
              id="passwordRepeat"
              placeholder="Confirm Password"
              v-model="passwordRepeat"
              ref="passwordCheckInput"
          >
          <label for="passwordRepeat" class="hidden">Confirm Password</label>
          <span
              class="eye-slash"
              @click="toggleVisibility(passwordCheckInput as HTMLInputElement)"
          >
            <img src="../assets/eye-slash.svg" alt="Slashed eye">
          </span>
        </div>

        <button type="submit" class="btn-primary mb-[20px]" ref="signupBtn" @click.prevent="handleSignup">SIGN UP</button>
        <p class="text-[16px] text-fontSecondarySubtle mb-[20px]">You have account? <router-link class="font-bold text-primaryLight cursor-pointer" to="/login">Login now</router-link></p>
      </form>
    </LeftSide>
  </MainContainer>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, watch} from 'vue'
import { useAuthStore } from "@/stores/authStore";
import MainContainer from "@/components/MainContainer.vue";
import {useRouter} from "vue-router";
import LeftSide from "@/components/LeftSide.vue";
import axios from "axios";
import {generateHashedPassword} from "@/ts/generateHashedPassword";

const authStore = useAuthStore();
const router = useRouter();

const signupBtn: any = ref(null);

onMounted(() => {
  (signupBtn.value as HTMLButtonElement).disabled = true;
})

const username: Ref<string> = ref('');
const role: Ref<string> = ref('');
const password: Ref<string> = ref('');
const passwordRepeat: Ref<string> = ref('');

watch([username, role, password, passwordRepeat], ([newUsername, newRole, newPassword, newPasswordRepeat]) => {
  const btn = signupBtn.value as HTMLButtonElement;
  btn.disabled = !(newUsername.trim() !== '' && newRole.trim() !== '' && newPassword.trim() !== '' && newPasswordRepeat.trim() !== '' && newPasswordRepeat === newPassword);
})

const passwordInput: Ref<HTMLInputElement|null> = ref(null);
const passwordCheckInput: Ref<HTMLInputElement|null> = ref(null);


const toggleVisibility = (input: HTMLInputElement) => {
  input.type = input.type === 'password' ? 'text' : 'password';
}

const handleSignup = async () => {
  const hash: string | null = await generateHashedPassword(password.value, passwordRepeat.value);
  //Send request to register new user
  if(hash) {
    await axios.post('http://localhost:3000/api/v1/post/user', {
      username: username.value,
      hashed_password: hash,
      role: role.value
    })
        .then(res => {
          console.log(res)
        })
  }
  //Change route

  await router.push({path: '/login'});
}
</script>