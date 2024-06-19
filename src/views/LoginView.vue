<template>
  <MainContainer>
    <FormContainer>
      <div class="w-[100%] sm:w-[450px]">
        <h2 class="header mb-[25px]">Login to your Account</h2>
        <div class="flex items-center justify-center mt-[-3px] mb-[28px]">
          <hr class="w-[30%] sm:w-[120px] border-s border-fontSecondarySubtle">
          <span class="text-[15px] text-fontSecondarySubtle w-[40%] sm:w-[213px] text-center">with your username</span>
          <hr class="w-[30%] sm:w-[120px] border-s border-fontSecondarySubtle">
        </div>
      </div>

      <form class="form w-[100%] sm:w-[450px]" @submit.prevent>
        <div class="w-[90%]">
          <input
              class="form-input form-input--wide form-input--start-image bg-person mb-[10px] w-[100%]"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              v-model="username"
          >
          <label for="username" class="hidden">Username</label>
        </div>
        <div class="relative mb-[25px] w-[90%]">
          <input
              class="pr-[50px] w-[100%] form-input form-input--start-image bg-shield-slash "
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
            <svg v-if="passwordInputType === 'text'" viewBox="0 0 24 24" width="30" height="30">
              <path :fill="'#d3d4eb'" :d="icons.eye"></path>
            </svg>
            <svg v-if="passwordInputType === 'password'" viewBox="0 0 24 24" width="30" height="30">
              <path :fill="'#d3d4eb'" :d="icons.eyeOff"></path>
            </svg>
          </span>
        </div>
        <button type="submit" class="btn btn-primary mb-[20px]" ref="loginBtn" @click.prevent="handleSubmit">LOG IN</button>
        <div v-if="message" class="mb-[15px]">
          <p class="text-red-500 font-bold">{{message}}</p>
        </div>
        <span class="text-[16px] text-fontSecondarySubtle mb-[20px]">Don’t have account? <router-link class="font-bold text-primaryLight" to="/register">Create an account</router-link></span>
      </form>
    </FormContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, watch} from 'vue';
import {useRouter} from "vue-router";
import MainContainer from "@/components/MainContainer.vue";
import FormContainer from "@/components/FormContainer.vue";
import {authUser} from "@/ts/authUser";

import type {User} from 'src/ts/types'
import {useAuthStore} from "@/stores/authStore";
import {storeUser} from "@/ts/storeUser";
import {getUserFromStorage} from "@/ts/getUserFromStorage";
import {mdiEyeOutline, mdiEyeOffOutline} from "@mdi/js"


const authStore = useAuthStore();
const router = useRouter();

const icons = {
  eye: mdiEyeOutline,
  eyeOff: mdiEyeOffOutline,
}

const passwordInput: Ref<HTMLInputElement>|Ref<null>|Ref<unknown> = ref(null);

const loginBtn:any = ref(null);

let passwordInputType = ref('password')

const togglePasswordVisibility = () => {
  const inputElement = passwordInput.value as HTMLInputElement;
  inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
  passwordInputType.value = passwordInputType.value === 'password' ? 'text' : 'password';
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