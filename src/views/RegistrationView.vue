<template>
  <main class="container mx-auto">
    <h1 class="font-bold text-4xl uppercase text-center mt-7 text-gray-700"> Registration</h1>
    <form class="bg-white p-4 mt-7 rounded-lg flex flex-col">
      <div class="input-container">
        <label class="form-label" for="roles">Role:</label>
        <select class="form-input" id="roles" v-model="role">
          <option disabled selected>Select your role</option>
          <option value="admin">admin</option>
          <option value="frontend">frontend</option>
          <option value="backend">backend</option>
          <option value="fullstack">fullstack</option>
          <option value="designer">designer</option>
          <option value="qa">qa</option>
        </select>
      </div>
      <div class="input-container">
        <label class="form-label" for="username">Username</label>
        <input v-model="username" class="form-input" id="username" type="text" maxlength="50" placeholder="ex: CuriousMonkey#1405" required>
      </div>
      <div class="input-container">
        <label class="form-label" for="pass">Password</label>
        <input v-model="password" class="form-input" id="pass" type="password" maxlength="50" required>
      </div>
      <div class="input-container">
        <label class="form-label" for="pass_repeat">Password Again</label>
        <input v-model="password_repeat" class="form-input" id="pass_repeat" type="password" maxlength="50" required>
      </div>
      <div class="self-center">
        <button @click.prevent="registerUser" class="bg-teal-500 text-white font-bold rounded-lg p-3 uppercase drop-shadow shadow mt-7 hover:bg-teal-700">Register</button>
      </div>

    </form>
  </main>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";

type Role = 'frontend' | 'backend' | 'fullstack' | 'designer' | 'qa' | 'admin'

const role = ref('');
const username = ref('');
const password = ref('');
const password_repeat = ref('');


const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/post/user', {
      username: username.value,
      role: role.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('Registered user successfully!');
      role.value = '';
      username.value = '';
      password.value = '';
      password_repeat.value = '';
    } else {
      console.error('Failed to register user');
    }
  } catch (error) {
    console.error('Error registering user:', error?.message, error?.response?.data?.message);
  }
}
</script>