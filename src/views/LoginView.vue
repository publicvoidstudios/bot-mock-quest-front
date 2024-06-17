<template>
  <MainContainer>
    <LeftSide>
      <h2 class="header mb-[25px]">Login to your Account</h2>
      <div class="flex items-center justify-center mt-[-3px] mb-[28px]">
        <hr class="w-[120px] border-s border-fontSecondarySubtle">
        <span class="text-[15px] text-fontSecondarySubtle w-[213px] text-center">with email</span>
        <hr class="w-[120px] border-s border-fontSecondarySubtle">
      </div>
      <form class="form" @submit.prevent>
        <div>
          <input
              class="form-input form-input--wide form-input--start-image bg-person mb-[10px]"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              v-model="username"
          >
          <label for="email" class="hidden">Email</label>
        </div>
        <div class="relative mb-[25px]">
          <input
              class="form-input form-input--wide form-input--start-image bg-shield-slash"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              ref="passwordInput"
              v-model="password"
          >
          <label for="password" class="hidden">Password</label>
          <span
              class="eye-slash"
              @click="togglePasswordVisibility"

          >
            <img src="../assets/eye-slash.svg" alt="Slashed eye">
          </span>
        </div>
        <button type="submit" class="btn-primary mb-[20px]" ref="loginBtn" @click.prevent="handleSubmit">LOG IN</button>
        <div v-if="message" class="mb-[15px]">
          <p class="text-red-500 font-bold">{{message}}</p>
        </div>
        <span class="text-[16px] text-fontSecondarySubtle mb-[20px]">Don’t have account? <router-link class="font-bold text-primaryLight" to="/register">Create an account</router-link></span>
      </form>
    </LeftSide>
  </MainContainer>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, watch} from 'vue';
import {useRouter} from "vue-router";
import MainContainer from "@/components/MainContainer.vue";
import LeftSide from "@/components/LeftSide.vue";
import {authUser} from "@/ts/authUser";

import type {User} from 'src/ts/types'
import {useAuthStore} from "@/stores/authStore";
import {storeUser} from "@/ts/storeUser";
import {getUserFromStorage} from "@/ts/getUserFromStorage";

const authStore = useAuthStore();
const router = useRouter();

const passwordInput: Ref<HTMLInputElement>|Ref<null>|Ref<unknown> = ref(null);

const loginBtn:any = ref(null);

const togglePasswordVisibility = () => {
  const inputElement = passwordInput.value as HTMLInputElement;
  inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
}

onMounted(() => {
  (loginBtn.value as HTMLButtonElement).disabled = true;
  const user = getUserFromStorage();
  if(user?.id != -1) {
    router.push('/')
  }
})

const username = ref('');
const password = ref('');

const message = ref('');

watch([username, password], ([newEmail, newPassword]) => {
  const btn = loginBtn.value as HTMLButtonElement;
  btn.disabled = !(newEmail.trim() !== '' && newPassword.trim() !== '');
});

const handleSubmit = async () => {
  let userList: unknown = undefined;

  await fetch('http://localhost:3000/api/v1/get/users')
      .then(res => res.json())
      .then(users => {
        userList = users
      })
  console.log(userList)

  if(userList){
    const auth: User | null = authUser((userList as User[]), username.value, password.value)
    console.log(auth)
    if(auth) {
      storeUser(auth);
      await router.push('/')
    }
  }
}
</script>