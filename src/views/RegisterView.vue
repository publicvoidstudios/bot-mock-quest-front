<template>
  <MainContainer>
    <FormContainer>
      <div class="w-[100%] sm:w-[450px] text-start mb-[30px]">
        <h2 class="header">Create your account</h2>
        <span class="text-[20px] text-fontSecondarySubtle w-[210px] ">Let's get started!</span>
      </div>
      <form class="form w-[100%] sm:w-[450px]">
        <div class="mb-2.5 w-[100%]">
          <input
              class="form-input form-input--start-image bg-person w-[100%]"
              type="text"
              name="user"
              id="user"yy
              placeholder="Username"
              v-model="username"
          >
          <label for="user" class="hidden">Username</label>
        </div>
        <div class="mb-2.5 w-[100%]">
          <select class="form-input form-input--start-image form-input--wide bg-person w-[100%]" name="role" id="role" v-model="role">
            <option value="" disabled selected>Select your role</option>
            <option value="frontend">Frontend developer</option>
            <option value="backend">Backend developer</option>
            <option value="fullstack">Fullstack developer</option>
            <option value="designer">Designer</option>
            <option value="qa">QA Engineer</option>
            <option value="admin">Admin</option>
          </select>
          <label for="role" class="hidden">Email</label>
        </div>
        <div class="relative mb-2.5 w-[100%]">
          <input
              class="form-input form-input--start-image form-input--wide bg-shield-slash w-[100%]"
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
              @click="toggleVisibility(passwordInput as HTMLInputElement, 'pass')"
          >
            <svg v-if="passIconsState['pass'] === 'on'" viewBox="0 0 24 24" width="30" height="30">
              <path :fill="'#d3d4eb'" :d="icons.eye"></path>
            </svg>
            <svg v-if="passIconsState['pass'] === 'off'" viewBox="0 0 24 24" width="30" height="30">
              <path :fill="'#d3d4eb'" :d="icons.eyeOff"></path>
            </svg>
          </span>
        </div>
        <div class="relative mb-2.5 w-[100%]">
          <input
              class="form-input form-input--start-image form-input--wide bg-shield-slash w-[100%]"
              type="password"
              name="passwordRepeat"
              id="passwordRepeat"
              placeholder="Confirm Password"
              v-model="passwordRepeat"
              ref="passwordRepeatInput"
          >
          <label for="passwordRepeat" class="hidden">Confirm Password</label>
          <span
              class="eye-slash"
              @click="toggleVisibility(passwordRepeatInput as HTMLInputElement, 'passCheck')"
          >
            <svg class="" v-if="passIconsState['passCheck'] === 'on'" viewBox="0 0 24 24" width="30" height="30">
              <path :fill="'#d3d4eb'" :d="icons.eye"></path>
            </svg>
            <svg v-if="passIconsState['passCheck'] === 'off'" viewBox="0 0 24 24" width="30" height="30">
              <path :fill="'#d3d4eb'" :d="icons.eyeOff"></path>
            </svg>
          </span>
        </div>

        <button type="submit" class="btn btn-primary mb-5 mt-2.5" ref="signupBtn" @click.prevent="handleSignup">SIGN UP</button>
        <p class="text-[16px] text-fontSecondarySubtle mb-[20px]">You have account? <router-link class="font-bold text-primaryLight cursor-pointer" to="/login">Login now</router-link></p>
      </form>
    </FormContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, watch} from 'vue'
import { useAuthStore } from "@/stores/authStore";
import MainContainer from "@/components/MainContainer.vue";
import {useRouter} from "vue-router";
import FormContainer from "@/components/FormContainer.vue";
import axios from "axios";
import {generateHashedPassword} from "@/ts/generateHashedPassword";
import {mdiEyeOutline, mdiEyeOffOutline} from "@mdi/js"
const authStore = useAuthStore();
const router = useRouter();

const icons = {
  eye: mdiEyeOutline,
  eyeOff: mdiEyeOffOutline,
}

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

const passwordRepeatInput: Ref<HTMLInputElement | null> = ref(null)
const passwordInput: Ref<HTMLInputElement | null> = ref(null)

const passIconsState: Ref<Record<string, string>> = ref({
  pass: "off",
  passCheck: "off"
})

const toggleVisibility = (input: HTMLInputElement, key: string) => {
  input.type = input.type === 'password' ? 'text' : 'password';
  passIconsState.value[key] = passIconsState.value[key] === 'off' ? 'on' : 'off';
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